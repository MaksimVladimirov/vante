'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function loginAction(_: unknown, formData: FormData) {
  const password = formData.get('password') as string

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Неверный пароль' }
  }

  const token = crypto.createHash('sha256').update(password).digest('hex')

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/admin')
}
