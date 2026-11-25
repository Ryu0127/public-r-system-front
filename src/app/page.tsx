import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import { SITE_NAME } from 'config/site';
import OshiKatsuSaportContainer from 'features/home/oshi-katsu-saport/containers/OshiKatsuSaportContainer';

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description:
    '推し活をもっと楽しく！ホロリスの推し活サポートは、推し活を全力でサポートするファン作成サイトです。タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。',
  path: '/',
  ogDescription:
    '推し活をもっと楽しく！タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。',
});

/**
 * ホーム画面（ホロリスの推し活サポート）
 *
 * URL: /
 * クエリ: ?talent={タレントslug} でタレントを選択
 */
export default function HomePage() {
  return (
    <ClientOnly>
      <OshiKatsuSaportContainer />
    </ClientOnly>
  );
}
