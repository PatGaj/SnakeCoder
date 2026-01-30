'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: ErrorProps) {
  const router = useRouter()
  const params = useParams()
  const locale = typeof params?.locale === 'string' ? params.locale : 'en'

  useEffect(() => {
    router.replace(`/${locale}/dashboard`)
  }, [locale, router])

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-snowWhite-100">
      <h1 className="text-2xl font-semibold">Something went wrong.</h1>
      <p className="mt-2 text-sm text-snowWhite-300">Redirecting to dashboard...</p>
      {process.env.NODE_ENV === 'development' && error?.message ? (
        <pre className="mt-4 whitespace-pre-wrap text-xs text-snowWhite-400">{error.message}</pre>
      ) : null}
    </main>
  )
}
