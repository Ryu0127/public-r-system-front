import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import HashtagSearchContainer from 'features/oshi-katsu-saport/hashtag-search/containers/HashtagSearchContainer';

export const metadata: Metadata = buildPageMetadata({
  title: 'タレント別 ハッシュタグ投稿/検索 サポート | ホロリスの推し活サポート',
  description:
    'お気に入りのタレントのハッシュタグを簡単に検索・投稿できます。推しのSNS投稿を見逃さず、効率的に推し活を楽しむためのハッシュタグサポート機能。',
  path: '/talent-hashtag-support',
  ogTitle: 'タレント別 ハッシュタグサポート | ホロリスの推し活サポート',
  ogDescription:
    'お気に入りのタレントのハッシュタグを簡単に検索・投稿。推しのSNS投稿を見逃さず、効率的に推し活を楽しめます。',
});

/**
 * タレント別 ハッシュタグ投稿/検索 サポート画面
 *
 * URL: /talent-hashtag-support
 * クエリ: ?talent={タレントslug} でタレントを選択
 */
export default function TalentHashtagSupportPage() {
  return (
    <ClientOnly>
      <HashtagSearchContainer />
    </ClientOnly>
  );
}
