export type SimplePage = {
  slug: string;
  title: string;
  description: string;
  /** <meta name="description"> / OGP 用の説明文 */
  metaDescription: string;
  /** <meta name="keywords"> */
  keywords: string;
  htmlPath: string;
  ogImagePath: string;
  ogImageWidth: number;
  ogImageHeight: number;
};

/**
 * public/event 配下の静的HTML一覧。
 * HTMLを追加したらここにエントリを足す（app/event/[slug] でビルド時に静的生成される）。
 */
export const SIMPLE_PAGES: SimplePage[] = [
  {
    slug: '2026-11-04-ep-tokino-sora',
    title: 'ときのそら NEW EP「CHECK！」購入ガイド',
    description: '販売エディション・イベントスケジュール・先着特典・店舗一覧',
    metaDescription:
      'ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。',
    keywords: 'ときのそら,CHECK!,EP,購入ガイド,ホロライブ,先着特典,イベント,ホロリスの推し活サポート,推し活',
    htmlPath: '/event/2026-11-04-ep-tokino-sora/index.html',
    ogImagePath: '/og-image-event-2026-11-04-ep-tokino-sora.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
];

export const findSimplePage = (slug: string | undefined): SimplePage | undefined =>
  SIMPLE_PAGES.find((page) => page.slug === slug);
