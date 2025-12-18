import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMessages } from 'next-intl/server'

import { ProviderWrapper } from '@/context/ProvidersWrapper'

import './globals.css'

type Locale = (typeof locales)[number]
type RootLayoutProps = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

const locales = ['pl', 'en']

export const metadata: Metadata = {
  title: 'Snake Coder',
  description: 'Python learning app',
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children, params }) => {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) {
    notFound()
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ProviderWrapper locale={locale} messages={messages}>
          <div className="bg-linear-to-br from-primary-950 via-primary-800 to-primary-900 min-h-screen">{children}</div>
          <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-secondary-500/15 blur-3xl" />
        </ProviderWrapper>
      </body>
    </html>
  )
}

export default RootLayout
