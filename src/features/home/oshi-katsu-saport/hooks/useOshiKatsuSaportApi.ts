import { useCallback } from "react";
import { useHomeFeaturesGetApi } from "hooks/api/home/useHomeFeaturesGetApi";
import { useHomeChangeLogsGetApi } from "hooks/api/home/useHomeChangeLogsGetApi";
import { useHomeLimitedTimeTopicGetApi } from "hooks/api/home/useHomeLimitedTimeTopicGetApi";
import { useTalentMusicGetApi } from "hooks/api/talent-music/useTalentMusicGetApi";

/** ホーム画面の楽曲ショーケースで表示する件数 */
export const HOME_MUSIC_SHOWCASE_COUNT = 10;

/**
 * 推し活サポートホーム画面API Hooks
 * @returns API操作関数
 */
export const useOshiKatsuSaportApi = () => {
  // API Hooks
  const { executeHomeFeaturesGet } = useHomeFeaturesGetApi();
  const { executeHomeChangeLogsGet } = useHomeChangeLogsGetApi();
  const { executeHomeLimitedTimeTopicGet } = useHomeLimitedTimeTopicGetApi();
  const { executeTalentMusicGetByParams } = useTalentMusicGetApi();

  return {
    // 機能一覧取得
    executeHomeFeaturesGet: useCallback(async () => {
      const result = await executeHomeFeaturesGet();
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeHomeFeaturesGet]),

    // 更新履歴取得
    executeHomeChangeLogsGet: useCallback(async () => {
      const result = await executeHomeChangeLogsGet();
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeHomeChangeLogsGet]),

    // 期間限定トピック取得
    executeHomeLimitedTimeTopicGet: useCallback(async () => {
      const result = await executeHomeLimitedTimeTopicGet();
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeHomeLimitedTimeTopicGet]),

    // 楽曲ショーケース用の先頭数件取得（楽曲一覧と同じAPIを再利用）
    executeHomeMusicGet: useCallback(async () => {
      const result = await executeTalentMusicGetByParams({
        page: 1,
        perPage: HOME_MUSIC_SHOWCASE_COUNT,
      });
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeTalentMusicGetByParams]),
  };
};
