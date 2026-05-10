import { headers } from 'next/headers'
import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar'
import styles from './layout.module.css'

export const metadata = { title: 'Admin — TAILOR' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? ''

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
