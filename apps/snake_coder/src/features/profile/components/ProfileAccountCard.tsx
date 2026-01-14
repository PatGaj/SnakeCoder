import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RiRefreshLine, RiSave2Line, RiUserSmileLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

import { Badge, Box, Button, Input, Select, Separator } from '@/components'
import { usePathname, useRouter } from '@/i18n/navigation'

export type ProfileAccountData = {
  userName: string
  nickName: string
  firstName?: string | null
  lastName?: string | null
}

type ProfileAccountFormValues = {
  nickName: string
  firstName?: string
  lastName?: string
}

export type ProfileAccountSaveResult =
  | { ok: true }
  | { ok: false; error: 'Invalid nickname' | 'Nickname already exists' | 'Generic' }

export type ProfileAccountCardProps = {
  account: ProfileAccountData
  onSave: (values: ProfileAccountFormValues) => Promise<ProfileAccountSaveResult>
}

const NICKNAME_REGEX = /^[A-Za-z0-9_]+$/

const ProfileAccountCard: React.FC<ProfileAccountCardProps> = ({ account, onSave }) => {
  const t = useTranslations('profile')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const schema = React.useMemo(
    () =>
      z.object({
        nickName: z
          .string()
          .trim()
          .min(1, t('errors.nickNameRequired'))
          .regex(NICKNAME_REGEX, t('errors.nickNameInvalid')),
        firstName: z.string().trim().optional(),
        lastName: z.string().trim().optional(),
      }),
    [t]
  )

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickName: account.nickName,
      firstName: account.firstName ?? '',
      lastName: account.lastName ?? '',
    },
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit(async (values) => {
    const result = await onSave(values)
    if (result.ok) {
      toast.success(t('toasts.saved'))
      reset(values)
      return
    }

    if (result.error === 'Invalid nickname') {
      toast.error(t('errors.nickNameInvalid'))
      setError('nickName', { message: t('errors.nickNameInvalid') })
      return
    }

    if (result.error === 'Nickname already exists') {
      toast.error(t('errors.nickNameTaken'))
      setError('nickName', { message: t('errors.nickNameTaken') })
      return
    }

    toast.error(t('errors.generic'))
  })

  return (
    <Box variant="glass" size="lg" round="2xl" className="relative w-full overflow-hidden border-primary-800/70">
      <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-aquaBlue-500/10 blur-3xl" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-snowWhite-50">{account.userName}</p>
            <p className="mt-1 text-sm text-snowWhite-300">{t('account.subtitle')}</p>
          </div>
          <Badge variant="muted" size="sm" className="px-3 py-1">
            @{account.nickName}
          </Badge>
        </div>

        <Separator className="bg-primary-800/70" />

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                title={t('fields.nickName')}
                placeholder={t('placeholders.nickName')}
                disabled={isSubmitting}
                destructive={Boolean(errors.nickName)}
                destructiveText={errors.nickName?.message ?? ''}
                autoComplete="nickname"
                {...register('nickName')}
              />
            </div>
            <Input
              title={t('fields.firstName')}
              placeholder={t('placeholders.firstName')}
              disabled={isSubmitting}
              destructive={Boolean(errors.firstName)}
              destructiveText={errors.firstName?.message ?? ''}
              autoComplete="given-name"
              {...register('firstName')}
            />
            <Input
              title={t('fields.lastName')}
              placeholder={t('placeholders.lastName')}
              disabled={isSubmitting}
              destructive={Boolean(errors.lastName)}
              destructiveText={errors.lastName?.message ?? ''}
              autoComplete="family-name"
              {...register('lastName')}
            />
          </div>

          <div className="space-y-2">
            <Select
              title={t('language.title')}
              value={locale}
              disabled={isSubmitting}
              onChange={(event) => {
                const nextLocale = event.target.value
                if (nextLocale !== locale) {
                  router.replace(pathname, { locale: nextLocale })
                }
              }}
              variant="muted"
              size="sm"
              round="lg"
            >
              <option value="pl">{t('language.options.pl')}</option>
              <option value="en">{t('language.options.en')}</option>
            </Select>
            <p className="text-xs text-snowWhite-300">{t('language.hint')}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="inline-flex items-center gap-2 text-xs text-snowWhite-300">
              <RiUserSmileLine size={16} className="text-secondary-300" />
              {t('hint')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                round="lg"
                className="border border-primary-800/70"
                leftIcon={<RiRefreshLine size={16} />}
                onClick={() => reset()}
                disabled={!isDirty || isSubmitting}
              >
                {t('actions.reset')}
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="md"
                round="lg"
                leftIcon={<RiSave2Line size={16} />}
                loading={isSubmitting}
                disabled={!isDirty}
              >
                {t('actions.save')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Box>
  )
}

export default ProfileAccountCard
