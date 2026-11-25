import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import EgoSearchContainer from 'features/oshi-katsu-saport/ego-search/containers/EgoSearchContainer';

export const metadata: Metadata = buildPageMetadata({
  title: 'エゴサーチ サポート | ホロリスの推し活サポート',
  description:
    '高度な検索フィルタで効率的にエゴサーチができます。タレントアカウントの絞り込みや、除外ワード設定など、便利な機能が満載。',
  path: '/ego-search-support',
  twitterDescription: '高度な検索フィルタで効率的にエゴサーチができます。',
});

/**
 * エゴサーチ サポート画面
 *
 * URL: /ego-search-support
 * クエリ: ?talent={タレントslug} でタレントを選択
 */
export default function EgoSearchSupportPage() {
  return (
    <ClientOnly>
      <EgoSearchContainer />
    </ClientOnly>
  );
}
