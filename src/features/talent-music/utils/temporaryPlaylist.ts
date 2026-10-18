import { isValidYoutubeVideoId } from './youtubeVideoId';

/**
 * YouTube の一時プレイリスト（watch_videos）に指定できる動画数の上限
 * ※ watch_videos は YouTube の非公式エンドポイント。仕様変更で動作しなくなる可能性がある
 */
export const TEMPORARY_PLAYLIST_MAX_VIDEOS = 50;

/**
 * 動画IDのリストから YouTube の一時プレイリスト URL を生成する
 * - 不正な動画IDは除外、重複は除去（順序は維持）、上限件数で打ち切り
 * - 有効な動画IDが1件もない場合は null
 */
export const buildTemporaryPlaylistUrl = (videoIds: (string | null | undefined)[]): string | null => {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const raw of videoIds) {
    if (!isValidYoutubeVideoId(raw)) continue;
    const id = raw.trim();
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length >= TEMPORARY_PLAYLIST_MAX_VIDEOS) break;
  }
  if (ids.length === 0) return null;
  return `https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`;
};
