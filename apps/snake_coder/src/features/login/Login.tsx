'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'

import { Badge, Box, Button, Input } from '@/components'
import { useRouter } from '@/i18n/navigation'
import { RiArrowRightLine, RiGithubFill, RiGoogleFill } from 'react-icons/ri'

type LoginFormValues = {
  email: string
  password: string
}

const Login = () => {
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
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

  return (
    <main className="mx-auto max-w-[1920px] px-6 py-12 md:px-12">
      <Box variant="glass" size="lg" round="2xl" className="mx-auto w-full max-w-lg border-primary-800/70">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-nightBlack-900">
            {t('badge')}
          </Badge>
          <span className="text-xs text-snowWhite-300">{t('hint')}</span>
        </div>

        <div className="mt-5 space-y-3">
          <h1 className="text-2xl font-semibold text-snowWhite-50">{t('title')}</h1>
          <p className="text-snowWhite-300">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-6">
          <Input
            title={t('email.label')}
            type="email"
            placeholder={t('email.placeholder')}
            autoComplete="email"
            disabled={isSubmitting}
            destructive={Boolean(errors.email)}
            destructiveText={errors.email?.message ?? ''}
            {...register('email')}
          />
          <Input
            title={t('password.label')}
            type="password"
            placeholder={t('password.placeholder')}
            autoComplete="current-password"
            disabled={isSubmitting}
            destructive={Boolean(errors.password)}
            destructiveText={errors.password?.message ?? ''}
            {...register('password')}
          />
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            round="lg"
            className="w-full mt-4"
            rightIcon={<RiArrowRightLine size={18} />}
            loading={isSubmitting}
          >
            {t('submit')}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-primary-800/70" />
          <span className="text-xs text-snowWhite-300">{t('oauth.or')}</span>
          <div className="h-px flex-1 bg-primary-800/70" />
        </div>

        <div className="grid gap-3">
          <Button
            type="button"
            variant="muted"
            size="lg"
            round="lg"
            className="w-full border border-primary-800/70"
            leftIcon={<RiGithubFill size={18} />}
            onClick={() => handleOAuth('github')}
            loading={oauthLoading === 'github'}
            disabled={isSubmitting || oauthLoading !== null}
          >
            {t('oauth.github')}
          </Button>
          <Button
            type="button"
            variant="muted"
            size="lg"
            round="lg"
            className="w-full border border-primary-800/70"
            leftIcon={<RiGoogleFill size={18} />}
            onClick={() => handleOAuth('google')}
            loading={oauthLoading === 'google'}
            // disabled={isSubmitting || oauthLoading !== null}
            disabled={true}
          >
            {t('oauth.google')}
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-snowWhite-200">{t('noAccount')}</span>
          <Button type="button" variant="glow" size="sm" round="lg" onClick={() => router.push('/register')}>
            {t('goRegister')}
          </Button>
        </div>
      </Box>
    </main>
  )
}

export default Login
