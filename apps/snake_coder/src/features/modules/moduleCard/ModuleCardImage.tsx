import clsx from 'clsx'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RiLock2Line, RiToolsLine } from 'react-icons/ri'

export type ModuleCardImageState = 'available' | 'locked' | 'building'

export type ModuleCardImageProps = {
  src: string
  state: ModuleCardImageState
  alt?: string
  className?: string
}

const ModuleCardImage: React.FC<ModuleCardImageProps> = ({ src, alt, state, className }) => {
  const t = useTranslations('modules')
  const isOverlayed = state !== 'available'

  return (
    <div
      className={clsx('relative overflow-hidden rounded-2xl border border-primary-800/70 bg-primary-950/45', className)}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary-950/70 via-transparent to-primary-950/70" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-secondary-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-aquaBlue-500/10 blur-2xl" />
      <div className="relative h-28 w-full">
        <Image
          src={src}
          alt={alt ?? t('card.imageAlt')}
          fill
          sizes="(max-width: 1024px) 100vw, 520px"
          className={clsx('object-contain p-4 opacity-95', {
            'opacity-55 grayscale contrast-75 saturate-0 blur-sm': isOverlayed,
          })}
        />
        {state !== 'available' && (
          <>
            <span
              className={clsx('absolute inset-0', state === 'locked' ? 'bg-primary-950/65' : 'bg-primary-950/55')}
            />
            <span className="absolute inset-0 grid place-items-center gap-2">
              {state === 'locked' ? (
                <RiLock2Line size={56} className="text-snowWhite-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]" />
              ) : (
                <RiToolsLine size={56} className="text-snowWhite-50 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]" />
              )}
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-snowWhite-200">
                {state === 'locked' ? t('card.noAccess') : t('card.building')}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default ModuleCardImage
