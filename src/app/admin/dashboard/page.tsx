import type { Metadata } from 'next';
import AdminDashboardContainer from 'features/admin/dashboard/containers/AdminDashboardContainer';

export const metadata: Metadata = {
  title: '管理画面ダッシュボード | ホロリスの推し活サポート',
  description: 'ホロリスの推し活サポートの管理画面ダッシュボード',
};

/**
 * 管理画面 ダッシュボード
 *
 * URL: /admin/dashboard
 */
export default function AdminDashboardPage() {
  return <AdminDashboardContainer />;
}
