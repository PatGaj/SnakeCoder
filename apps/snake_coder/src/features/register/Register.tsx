'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RiArrowRightLine } from 'react-icons/ri'

import { Badge, Box, Button, Checkbox, Input } from '@/components'
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

const Register = () => {
  const router = useRouter()
  const t = useTranslations('register')

  const registerSchema = React.useMemo(
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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
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
          setError('password', { message: t('errors.passwordComplex') })
          return
        }
        if (response.status === 400 && errorMessage === 'Invalid nickname') {
          toast.error(t('errors.nickNameInvalid'))
          setError('nickName', { message: t('errors.nickNameInvalid') })
          return
        }
        if (response.status === 409 && errorMessage === 'User already exists') {
          toast.error(t('errors.emailTaken'))
          setError('email', { message: t('errors.emailTaken') })
          return
        }
        if (response.status === 409 && errorMessage === 'Nickname already exists') {
          toast.error(t('errors.nickNameTaken'))
          setError('nickName', { message: t('errors.nickNameTaken') })
          return
        }
        toast.error(t('errors.generic'))
        setError('root', { message: t('errors.generic') })
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
      setError('root', { message: t('errors.generic') })
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-2">
          <Input
            title={t('nickName.label')}
            placeholder={t('nickName.placeholder')}
            autoComplete="nickname"
            disabled={isSubmitting}
            destructive={Boolean(errors.nickName)}
            destructiveText={errors.nickName?.message ?? ''}
            {...register('nickName')}
          />
          <Input
            title={t('firstName.label')}
            placeholder={t('firstName.placeholder')}
            autoComplete="given-name"
            disabled={isSubmitting}
            destructive={Boolean(errors.firstName)}
            destructiveText={errors.firstName?.message ?? ''}
            {...register('firstName')}
          />
          <Input
            title={t('lastName.label')}
            placeholder={t('lastName.placeholder')}
            autoComplete="family-name"
            disabled={isSubmitting}
            destructive={Boolean(errors.lastName)}
            destructiveText={errors.lastName?.message ?? ''}
            {...register('lastName')}
          />

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
            autoComplete="new-password"
            disabled={isSubmitting}
            destructive={Boolean(errors.password)}
            destructiveText={errors.password?.message ?? ''}
            {...register('password')}
          />
          <Input
            title={t('confirmPassword.label')}
            type="password"
            placeholder={t('confirmPassword.placeholder')}
            autoComplete="new-password"
            disabled={isSubmitting}
            destructive={Boolean(errors.confirmPassword)}
            destructiveText={errors.confirmPassword?.message ?? ''}
            {...register('confirmPassword')}
          />
          <div className="mt-2">
            <Checkbox
              label={t('terms.label')}
              disabled={isSubmitting}
              destructive={Boolean(errors.acceptTerms)}
              destructiveText={errors.acceptTerms?.message ?? ''}
              {...register('acceptTerms')}
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            round="lg"
            className="mt-4 w-full"
            rightIcon={<RiArrowRightLine size={18} />}
            loading={isSubmitting}
          >
            {t('submit')}
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-snowWhite-200">{t('haveAccount')}</span>
          <Button type="button" variant="glow" size="sm" round="lg" onClick={() => router.push('/login')}>
            {t('goLogin')}
          </Button>
        </div>
      </Box>
    </main>
  )
}

export default Register
