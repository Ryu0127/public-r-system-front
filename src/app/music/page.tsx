import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import { getMusicOgPage } from 'og/musicOgPages';
import TalentMusicContainer from 'features/talent-music/containers/TalentMusicContainer';

type MusicPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * ?talent= に応じた OGP をサーバー側で出力する
 * （旧: vercel.json の User-Agent 判定 rewrite + public/og/*.html）
 */
export async function generateMetadata({ searchParams }: MusicPageProps): Promise<Metadata> {
  const { talent } = await searchParams;
  const og = getMusicOgPage(typeof talent === 'string' ? talent : null);

  return buildPageMetadata({
    title: og.title,
    description: og.description,
    keywords: og.keywords,
    path: og.path,
    author: true,
    robots: { index: true, follow: true },
    ogImage: {
      url: og.imagePath,
      width: og.imageWidth,
      height: og.imageHeight,
      type: og.imageType,
    },
    twitterImage: og.twitterImagePath,
  });
}

/**
 * 楽曲一覧画面
 *
 * URL: /music
 * クエリ: ?talent={タレントslug} / ?group={グループslug} で絞り込み（OGP も切り替わる）
 */
export default function MusicPage() {
  return (
    <ClientOnly>
      <TalentMusicContainer />
    </ClientOnly>
  );
}
