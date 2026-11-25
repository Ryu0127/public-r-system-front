import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import { fetchLyricsMusicTitle } from 'features/music-lyrics/api/fetchLyricsMusicTitle';
import {
  buildLyricsPageTitle,
  LYRICS_PAGE_DESCRIPTION,
  parseMusicId,
} from 'features/music-lyrics/utils/lyricsPageMeta';
import MusicLyricsContainer from 'features/music-lyrics/containers/MusicLyricsContainer';

type MusicLyricsPageProps = {
  params: Promise<{ musicId: string }>;
};

/** 楽曲名入りのタイトルをサーバー側で出力する（取得できなければ汎用タイトル） */
export async function generateMetadata({ params }: MusicLyricsPageProps): Promise<Metadata> {
  const { musicId: raw } = await params;
  const musicId = parseMusicId(raw);
  const musicTitle = musicId === null ? null : await fetchLyricsMusicTitle(musicId);

  return buildPageMetadata({
    title: buildLyricsPageTitle(musicTitle),
    description: LYRICS_PAGE_DESCRIPTION,
    path: musicId === null ? undefined : `/music/${musicId}/lyrics`,
    robots: { index: true, follow: true },
  });
}

/**
 * 歌詞・コール確認画面
 *
 * URL: /music/[musicId]/lyrics
 */
export default function MusicLyricsPage() {
  return (
    <ClientOnly>
      <MusicLyricsContainer />
    </ClientOnly>
  );
}
