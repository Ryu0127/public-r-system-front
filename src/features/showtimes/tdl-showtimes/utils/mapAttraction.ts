import { AttractionApiItem } from 'hooks/api/showtimes/useAttractionsGetApi';
import { CrowdAttraction } from '../types';

const DEFAULT_WAIT_LEN = 13;

/**
 * DBマスタのアトラクションを混雑表示用に変換
 * wait は DB 予想待ちがあれば優先、なければモック
 * pass / icon は同名のモックデータがあれば引き継ぐ
 * rank は DB の rankTypeLabel を優先
 */
export const mergeAttractionsWithMock = (
  dbAttractions: AttractionApiItem[],
  mockAttractions: CrowdAttraction[],
  waitsByAttractionId?: Record<string, Array<number | null>>
): CrowdAttraction[] => {
  const mockByName = new Map(
    mockAttractions.map((attraction) => [attraction.name, attraction])
  );

  return dbAttractions
    .filter((item) => item.pauseFlag !== 1)
    .map((item) => {
      const mock = mockByName.get(item.attractionName);
      const emptyWait = Array.from({ length: DEFAULT_WAIT_LEN }, () => null);
      const emptyPass = Array.from({ length: DEFAULT_WAIT_LEN }, () => '-');
      const dbWait = waitsByAttractionId?.[String(item.id)];

      return {
        id: String(item.id),
        name: item.attractionName,
        area: item.areaTypeLabel ?? '',
        rank: item.rankTypeLabel ?? mock?.rank ?? 'C',
        icon: mock?.icon ?? 'castle',
        thumbUrl: item.thumbUrl ?? '',
        duration:
          item.durationMinutes != null ? `約${item.durationMinutes}分` : '',
        wait: dbWait ?? mock?.wait ?? emptyWait,
        pass: mock?.pass ?? emptyPass,
        dpaFlag: item.dpaFlag === 1,
        priorityPassFlag: item.priorityPassFlag === 1,
      };
    });
};
