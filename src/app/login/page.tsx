import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import LoginContainer from 'features/auth/login/containers/LoginContainer';

export const metadata: Metadata = buildPageMetadata({
  title: 'ログイン | ホロリスの推し活サポート',
  description: 'ホロリスの推し活サポートにログインして、推し活をもっと楽しみましょう。',
  path: '/login',
});

/**
 * ログイン画面
 *
 * URL: /login
 * クエリ: ?from={遷移元パス} ログイン後の戻り先
 */
export default function LoginPage() {
  return (
    <ClientOnly>
      <LoginContainer />
    </ClientOnly>
  );
}
