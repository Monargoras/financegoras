import { NextResponse, type NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { i18n } from './utils/i18nConfig'

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
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(i18n.locales)

  const locale = match(languages, i18n.locales, i18n.defaultLocale)

  return locale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
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
