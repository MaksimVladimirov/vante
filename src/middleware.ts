import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('admin_auth')?.value
  const expected = await computeToken(process.env.ADMIN_PASSWORD ?? '')

  if (cookie !== expected) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: '/admin/:path*',
}
