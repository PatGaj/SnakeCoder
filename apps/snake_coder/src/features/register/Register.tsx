'use client'

import React from 'react'
import { RiArrowRightLine } from 'react-icons/ri'

import { Badge, Box, Button, Checkbox, Input } from '@/components'
import { useRouter } from '@/i18n/navigation'

import { useRegister } from './useRegister'

const Register = () => {
  const router = useRouter()
  const { t, form, onSubmit } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <main className="mx-auto max-w-480 px-6 py-12 md:px-12">
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
