import { useCallback } from "react";
import { useHomeFeaturesGetApi } from "hooks/api/home/useHomeFeaturesGetApi";
import { useHomeChangeLogsGetApi } from "hooks/api/home/useHomeChangeLogsGetApi";
import { useHomeLimitedTimeTopicGetApi } from "hooks/api/home/useHomeLimitedTimeTopicGetApi";

/**
 * 推し活サポートホーム画面API Hooks
 * @returns API操作関数
 */
export const useOshiKatsuSaportApi = () => {
  // API Hooks
  const { executeHomeFeaturesGet } = useHomeFeaturesGetApi();
  const { executeHomeChangeLogsGet } = useHomeChangeLogsGetApi();
  const { executeHomeLimitedTimeTopicGet } = useHomeLimitedTimeTopicGetApi();

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
  };
};
