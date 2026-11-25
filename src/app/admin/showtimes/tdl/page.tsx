import type { Metadata } from 'next';
import TdlShowtimesContainer from 'features/showtimes/tdl-showtimes/containers/TdlShowtimesContainer';

export const metadata: Metadata = {
  title: 'TDL ショー&パレード タイムライン',
};

/**
 * 管理画面 TDL ショー&パレード タイムライン
 *
 * URL: /admin/showtimes/tdl
 */
export default function AdminTdlShowtimesPage() {
  return <TdlShowtimesContainer />;
}
