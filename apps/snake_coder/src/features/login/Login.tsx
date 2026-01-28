'use client'

import React from 'react'

import { Badge, Box, Button, Input } from '@/components'
import { RiArrowRightLine, RiGithubFill, RiGoogleFill } from 'react-icons/ri'
import { useLogin } from './useLogin'

const Login = () => {
  const { t, router, form, onSubmit, oauthLoading, handleOAuth } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

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
