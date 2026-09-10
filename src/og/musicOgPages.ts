export const SITE_ORIGIN = 'https://public-r-system-front.vercel.app';

export type MusicOgPage = {
  talentSlug: string | null;
  title: string;
  description: string;
  keywords: string;
  path: string;
  imagePath: string;
  twitterImagePath: string;
  imageWidth?: number;
  imageHeight?: number;
};

export const DEFAULT_MUSIC_OG: MusicOgPage = {
  talentSlug: null,
  title: '楽曲一覧 | ホロリスの推し活サポート',
  description:
    'ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認できます。推しの楽曲をまとめてチェックしよう。',
  keywords: '楽曲一覧,ホロライブ,オリジナル曲,カバー曲,ホロリスの推し活サポート,推し活',
  path: '/music',
  imagePath: '/og-image.png',
  twitterImagePath: '/twitter-image.png',
};

export const MUSIC_OG_BY_TALENT: Record<string, MusicOgPage> = {
  'tokino-sora': {
    talentSlug: 'tokino-sora',
    title: 'ときのそら 楽曲一覧 | ホロリスの推し活サポート',
    description:
      'ときのそらのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認できます。推しの楽曲をまとめてチェックしよう。',
    keywords:
      'ときのそら,楽曲一覧,オリジナル曲,カバー曲,ホロライブ,ホロリスの推し活サポート,推し活',
    path: '/music?talent=tokino-sora',
    imagePath: '/og-image-event-2026-11-04-ep-tokino-sora.png',
    twitterImagePath: '/og-image-event-2026-11-04-ep-tokino-sora.png',
    imageWidth: 1048,
    imageHeight: 549,
  },
};

export const getMusicOgPage = (talentSlug: string | null | undefined): MusicOgPage => {
  const slug = (talentSlug ?? '').trim();
  if (!slug) return DEFAULT_MUSIC_OG;
  return MUSIC_OG_BY_TALENT[slug] ?? DEFAULT_MUSIC_OG;
};
