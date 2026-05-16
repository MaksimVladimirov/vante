'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/shared/api/supabase-server'

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Введите email и пароль' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Неверный email или пароль' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
