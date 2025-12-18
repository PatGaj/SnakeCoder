'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from 'react-hot-toast'

type ProvidersWrapperProps = {
  children: React.ReactNode
  locale: string
  messages: any
}

const queryClient = new QueryClient()

export const ProviderWrapper: React.FC<ProvidersWrapperProps> = ({ children, locale, messages }) => {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Warsaw">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
