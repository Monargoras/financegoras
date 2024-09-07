import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const defaultLocale = 'en'
const locales = ['en', 'de']

export const i18n = {
  defaultLocale,
  locales,
} as const

export type Locale = (typeof i18n)['locales'][number]

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest): string | undefined {
  // check NEXT_LOCALE cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')
  if (cookieLocale) {
    return cookieLocale.value
  }

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = match(languages, locales, defaultLocale)

  return locale
}

// eslint-disable-next-line consistent-return
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  /*if (
    [
      '/img/favicon.ico',
      '/img/apple-icon.png',
      '.webmanifest',
      '/img/android-chrome-192x192.png',
      '/img/android-chrome-512x512.png',
      '/img/mstile-150x150.png',
      'browserconfig.xml',
      '/img/favicon-16x16.png',
      '/img/favicon-32x32.png',
      '/img/safari-pinned-tab.svg',
      // Your other files in `public`
    ].includes(pathname)
  ) {
    return NextResponse.redirect(new URL(`/${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
  }*/

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|img/|manifest.json|browserconfig.xml|favicon.ico).*)'],
}
