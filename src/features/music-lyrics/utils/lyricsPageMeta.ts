import { SITE_NAME } from 'config/site';

/** 歌詞・コール確認画面の説明文（metadata 用） */
export const LYRICS_PAGE_DESCRIPTION =
  '楽曲の歌詞とライブで入れるコールを一緒に確認できます。表示モードの切り替えや文字サイズの変更にも対応。';

/** 歌詞・コール確認画面のタイトル（楽曲名が分かれば含める） */
export const buildLyricsPageTitle = (musicTitle: string | null | undefined): string =>
  musicTitle ? `${musicTitle} 歌詞・コール | ${SITE_NAME}` : `歌詞・コール確認 | ${SITE_NAME}`;

/** URL パラメータを正の整数の楽曲IDに変換（不正値は null） */
export const parseMusicId = (raw: string | undefined): number | null => {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};
