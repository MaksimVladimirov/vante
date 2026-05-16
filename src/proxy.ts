import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/shared/i18n/locales'

function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? ''
  return acceptLang.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ─── Admin routes: Supabase session auth ───────────────────────
  if (pathname.startsWith('/admin')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    let supabaseResponse = NextResponse.next({
      request: { headers: requestHeaders },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (pathname.startsWith('/admin/login')) {
      if (user) return NextResponse.redirect(new URL('/admin', request.url))
      return supabaseResponse
    }

    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url))
    return supabaseResponse
  }

  // ─── Store routes: locale prefix ───────────────────────────────
  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )

  if (!hasLocale) {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
