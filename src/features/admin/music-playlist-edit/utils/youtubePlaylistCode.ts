/** YouTube プレイリストID として許可する形式（API のバリデーションと同一） */
const PLAYLIST_CODE_PATTERN = /^[A-Za-z0-9_-]{2,64}$/;

/**
 * 入力値（プレイリストID または プレイリストURL）からプレイリストIDを取り出す
 * 取り出せない・形式が不正な場合は null
 */
export const extractYoutubePlaylistCode = (input: string): string | null => {
  const value = input.trim();
  if (!value) return null;
  if (PLAYLIST_CODE_PATTERN.test(value)) return value;

  try {
    const url = new URL(value);
    const list = url.searchParams.get('list')?.trim() ?? '';
    return PLAYLIST_CODE_PATTERN.test(list) ? list : null;
  } catch {
    return null;
  }
};

export const buildYoutubePlaylistUrl = (code: string): string =>
  `https://www.youtube.com/playlist?list=${encodeURIComponent(code)}`;

export const buildYoutubePlaylistEmbedUrl = (code: string): string =>
  `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(code)}`;
