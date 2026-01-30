import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useRouter } from '@/i18n/navigation'

type LoginFormValues = {
  email: string
  password: string
}

// Provides login form state and handlers for credentials and OAuth flows.
export const useLogin = () => {
  const router = useRouter()
  const t = useTranslations('login')
  const locale = useLocale()
  const searchParams = useSearchParams()

  const loginSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().email(t('errors.email')),
        password: z.string().min(1, t('errors.passwordRequired')),
      }),
    [t]
  )

  React.useEffect(() => {
    const error = searchParams.get('error')
    if (!error) return
    toast.error(t('errors.oauth'))
  }, [searchParams, t])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      const result = await signIn('credentials', { redirect: false, email, password })
      if (result?.error) {
        toast.error(t('errors.invalidCredentials'))
        return
      }
      toast.success(t('toast.success'))
      router.push('/dashboard')
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  const [oauthLoading, setOauthLoading] = React.useState<'google' | 'github' | null>(null)

  const handleOAuth = (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    signIn(provider, { callbackUrl: `/${locale}/dashboard` }).catch(() => {
      setOauthLoading(null)
      toast.error(t('errors.oauth'))
    })
  }

  return {
    t,
    router,
    form,
    onSubmit,
    oauthLoading,
    handleOAuth,
  }
}
