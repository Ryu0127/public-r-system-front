import { useCallback } from "react";
import { useLifeScheduleMonthTaskGetApi } from "hooks/api/life/useLifeScheduleMonthTaskGetApi";

/**
 * 月次スケジュールAPI Hooks
 * @returns API操作関数
 */
export const useLifeScheduleMonthApi = () => {
  // API Hooks
  const { executeLifeScheduleMonthTaskGet } = useLifeScheduleMonthTaskGetApi();
  return {
    // 月のタスク一覧取得
    executeLifeScheduleMonthTaskGet: useCallback(async (month: Date) => {
      const result = await executeLifeScheduleMonthTaskGet(month);
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeLifeScheduleMonthTaskGet]),
  };
};