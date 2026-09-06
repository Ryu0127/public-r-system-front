export type SimplePage = {
  slug: string;
  title: string;
  description: string;
  htmlPath: string;
};

/**
 * public/event 配下の静的HTML一覧。
 * HTMLを追加したらここにエントリを足す。
 */
export const SIMPLE_PAGES: SimplePage[] = [
  {
    slug: '2026-11-04-ep-tokino-sora',
    title: 'ときのそら NEW EP「CHECK！」購入ガイド',
    description: '販売エディション・イベントスケジュール・先着特典・店舗一覧',
    htmlPath: '/event/2026-11-04-ep-tokino-sora/index.html',
  },
];

export const findSimplePage = (slug: string | undefined): SimplePage | undefined =>
  SIMPLE_PAGES.find((page) => page.slug === slug);
