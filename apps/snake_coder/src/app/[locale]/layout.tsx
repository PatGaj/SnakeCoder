import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ProviderWrapper } from '@/context/ProvidersWrapper'

import './globals.css'
import SignOutLayout from '@/features/signOutLayout/SignOutLayout'

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

  return (
    <html lang={locale}>
      <body>
        <ProviderWrapper locale={locale}>
          <SignOutLayout>{children}</SignOutLayout>
        </ProviderWrapper>
      </body>
    </html>
  )
}

export default RootLayout
