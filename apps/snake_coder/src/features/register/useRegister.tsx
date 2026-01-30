import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useRouter } from '@/i18n/navigation'

type RegisterFormValues = {
  nickName: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const NICKNAME_REGEX = /^[A-Za-z0-9_]+$/

// Builds the registration validation schema with translated error messages.
const useRegisterSchema = () => {
  const t = useTranslations('register')

  return React.useMemo(
    () =>
      z
        .object({
          nickName: z.string().trim().min(1, t('errors.nickNameRequired')).regex(NICKNAME_REGEX, t('errors.nickNameInvalid')),
          firstName: z.string().trim().optional(),
          lastName: z.string().trim().optional(),
          email: z.string().email(t('errors.email')),
          password: z.string().min(1, t('errors.passwordRequired')).regex(PASSWORD_REGEX, t('errors.passwordComplex')),
          confirmPassword: z.string().min(1, t('errors.confirmPasswordRequired')),
          acceptTerms: z.boolean().refine((value) => value, { message: t('errors.termsRequired') }),
        })
        .refine((values) => values.password === values.confirmPassword, {
          message: t('errors.passwordsMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  )
}

// Handles registration form state, submission, and post-signup login flow.
export const useRegister = () => {
  const router = useRouter()
  const t = useTranslations('register')
  const registerSchema = useRegisterSchema()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  })

  const onSubmit = async ({ nickName, firstName, lastName, email, password }: RegisterFormValues) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickName,
          firstName: firstName?.trim() || undefined,
          lastName: lastName?.trim() || undefined,
          email,
          password,
        }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        const errorMessage = payload?.error ?? ''

        if (response.status === 400 && errorMessage === 'Weak password') {
          toast.error(t('errors.passwordComplex'))
          form.setError('password', { message: t('errors.passwordComplex') })
          return
        }
        if (response.status === 400 && errorMessage === 'Invalid nickname') {
          toast.error(t('errors.nickNameInvalid'))
          form.setError('nickName', { message: t('errors.nickNameInvalid') })
          return
        }
        if (response.status === 409 && errorMessage === 'User already exists') {
          toast.error(t('errors.emailTaken'))
          form.setError('email', { message: t('errors.emailTaken') })
          return
        }
        if (response.status === 409 && errorMessage === 'Nickname already exists') {
          toast.error(t('errors.nickNameTaken'))
          form.setError('nickName', { message: t('errors.nickNameTaken') })
          return
        }
        toast.error(t('errors.generic'))
        form.setError('root', { message: t('errors.generic') })
        return
      }
      toast.success(t('toast.success'))
      const signInResult = await signIn('credentials', { redirect: false, email, password })
      if (signInResult?.error) {
        router.push('/login')
        return
      }
      router.push('/dashboard')
    } catch {
      toast.error(t('errors.generic'))
      form.setError('root', { message: t('errors.generic') })
    }
  }

  return {
    t,
    form,
    onSubmit,
  }
}
