import { DEFAULT_OG_IMAGE_PATH, DEFAULT_TWITTER_IMAGE_PATH } from 'config/site';

export { SITE_ORIGIN } from 'config/site';

/**
 * /music の OGP 定義。
 * Next.js 移行後は app/music/page.tsx の generateMetadata でサーバー側から出力する
 * （旧: vercel.json の User-Agent 判定 rewrite + public/og/*.html）。
 */
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
  imageType?: string;
};

export const DEFAULT_MUSIC_OG: MusicOgPage = {
  talentSlug: null,
  title: '楽曲一覧 | ホロリスの推し活サポート',
  description:
    'ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認できます。推しの楽曲をまとめてチェックしよう。',
  keywords: '楽曲一覧,ホロライブ,オリジナル曲,カバー曲,ホロリスの推し活サポート,推し活',
  path: '/music',
  imagePath: DEFAULT_OG_IMAGE_PATH,
  twitterImagePath: DEFAULT_TWITTER_IMAGE_PATH,
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
    // 旧 public/og/music-tokino-sora.html（クローラーに実際に返していた内容）に合わせる
    imagePath: '/og/image/og-image-music-tokino-sora.jpg',
    twitterImagePath: '/og/image/og-image-music-tokino-sora.jpg',
    imageWidth: 1699,
    imageHeight: 904,
    imageType: 'image/jpeg',
  },
};

export const getMusicOgPage = (talentSlug: string | null | undefined): MusicOgPage => {
  const slug = (talentSlug ?? '').trim();
  if (!slug) return DEFAULT_MUSIC_OG;
  return MUSIC_OG_BY_TALENT[slug] ?? DEFAULT_MUSIC_OG;
};
