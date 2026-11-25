import { ReactNode } from 'react';
import ClientOnly from 'components/ClientOnly';
import AdminProtectedLayout from 'features/admin/layout/AdminProtectedLayout';

/**
 * 管理画面（/admin/*）共通レイアウト
 * 認証チェック（useAuth）はブラウザ上で行い、未認証なら /login へ遷移する。
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ClientOnly>
      <AdminProtectedLayout>{children}</AdminProtectedLayout>
    </ClientOnly>
  );
}
