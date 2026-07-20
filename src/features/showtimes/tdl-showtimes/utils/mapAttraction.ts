import { AttractionApiItem } from 'hooks/api/showtimes/useAttractionsGetApi';
import { CrowdAttraction } from '../types';

const VALID_RANKS = new Set(['S', 'A', 'B', 'C']);

const mapRank = (
  rankTypeLabel: AttractionApiItem['rankTypeLabel']
): CrowdAttraction['rank'] => {
  if (rankTypeLabel && VALID_RANKS.has(rankTypeLabel)) {
    return rankTypeLabel;
  }
  return null;
};

/**
 * DBマスタのアトラクションを混雑表示用に変換
 * wait は DB 予想待ちのみ（なければ空配列 → 画面は「-」）
 * rank は DB の rankTypeLabel のみ（未登録なら null → 画面は「未登録」）
 */
export const mapAttractionsFromDb = (
  dbAttractions: AttractionApiItem[],
  waitsByAttractionId?: Record<string, Array<number | null>>
): CrowdAttraction[] => {
  return dbAttractions
    .filter((item) => item.pauseFlag !== 1)
    .map((item) => {
      const dbWait = waitsByAttractionId?.[String(item.id)];

      return {
        id: String(item.id),
        name: item.attractionName,
        area: item.areaTypeLabel ?? '',
        rank: mapRank(item.rankTypeLabel),
        thumbUrl: item.thumbUrl ?? '',
        duration:
          item.durationMinutes != null ? `約${item.durationMinutes}分` : '',
        wait: dbWait ?? [],
        dpaFlag: item.dpaFlag === 1,
        priorityPassFlag: item.priorityPassFlag === 1,
      };
    });
};
