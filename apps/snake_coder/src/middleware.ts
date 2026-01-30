import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Extracts a locale prefix (e.g. "/pl") from the path when it matches supported locales.
function getLocalePrefix(pathname: string) {
  const m = pathname.match(/^\/([\w-]+)(\/|$)/)
  if (!m) return ''
  const locale = m[1]
  return routing.locales.some((supported) => supported === locale) ? `/${locale}` : ''
}

// Removes the locale prefix from a path, returning "/" when the remainder is empty.
function stripLocale(pathname: string) {
  const localePrefix = getLocalePrefix(pathname)
  if (!localePrefix) return pathname || '/'
  const stripped = pathname.slice(localePrefix.length)
  return stripped || '/'
}

// Builds a redirect response to a path that already includes the locale prefix.
function redirect(req: NextRequest, targetPathWithLocale: string) {
  const url = req.nextUrl.clone()
  url.pathname = targetPathWithLocale
  url.search = ''
  return NextResponse.redirect(url)
}

// Enforces auth and locale-aware routing:
// - redirects authed users away from landing/login/register to dashboard
// - redirects unauthenticated users to landing/login with callbackUrl
// - otherwise delegates to next-intl middleware
export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const requestForNextAuth = {
    headers: { cookie: req.headers.get('cookie') ?? '' },
  } as NextApiRequest

  const session = await getSession({ req: requestForNextAuth })
  const isAuthed = !!session

  const localePrefix = getLocalePrefix(pathname)
  const pathNoLocale = stripLocale(pathname)

  const isRoot = pathNoLocale === '/'
  const isLanding = pathNoLocale === '/landing'
  const isLogin = pathNoLocale === '/login'
  const isRegister = pathNoLocale === '/register'

  if (isAuthed) {
    if (isRoot || isLanding || isLogin || isRegister) {
      return redirect(req, `${localePrefix}/dashboard`)
    }
    return intlMiddleware(req)
  }
  if (isRoot) {
    return redirect(req, `${localePrefix}/landing`)
  }
  if (isLanding || isLogin || isRegister) {
    return intlMiddleware(req)
  }
  const signInUrl = new URL(`${localePrefix}/login`, req.nextUrl.origin)
  signInUrl.searchParams.set('callbackUrl', req.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
