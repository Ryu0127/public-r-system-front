import { useCallback } from "react";
import { useLifeScheduleDayTaskGetApi } from "hooks/api/life/useLifeScheduleDayTaskGetApi";
import { LifeScheduleDayTaskApiRequest, useLifeScheduleDayTaskPostApi } from "hooks/api/life/useLifeScheduleDayTaskPostApi";
import { EventsGoogleCalendarRegistPostApiRequest, useEventsGoogleCalendarRegistPostApi } from "hooks/api/events/useEventsGoogleCalendarRegistPostApi";

// API操作インターフェース
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * 日次スケジュールAPI Hooks
 * @returns API操作関数
 */
export const useLifeScheduleMonthApi = () => {
  // API Hooks
  const { executeLifeScheduleDayTaskGet } = useLifeScheduleDayTaskGetApi();
  return {
    // 月のタスク一覧取得
    executeLifeScheduleDayTaskGet: useCallback(async (month: Date) => {
      const result = await executeLifeScheduleDayTaskGet(month);
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeLifeScheduleDayTaskGet]),
  };
};