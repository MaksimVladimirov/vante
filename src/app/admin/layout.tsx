import { AdminSidebar } from '@/widgets/admin-sidebar/ui/AdminSidebar';
import styles from './layout.module.css';

export const metadata = { title: 'Admin — TAILOR' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
