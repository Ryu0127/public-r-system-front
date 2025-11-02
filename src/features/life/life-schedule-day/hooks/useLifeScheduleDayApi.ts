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
export const useLifeScheduleDayApi = () => {
  // API Hooks
  const { executeLifeScheduleDayTaskGet } = useLifeScheduleDayTaskGetApi();
  const { executeLifeScheduleDayTaskPost } = useLifeScheduleDayTaskPostApi();
  const { executeEventsGoogleCalendarRegist } = useEventsGoogleCalendarRegistPostApi();

  return {
    // タスク一覧取得
    executeLifeScheduleDayTaskGet: useCallback(async (date: Date) => {
      const result = await executeLifeScheduleDayTaskGet(date);
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeLifeScheduleDayTaskGet]),

    // タスク更新 
    update: useCallback(async (requestParams: LifeScheduleDayTaskApiRequest): Promise<ApiResponse<boolean>> => {
      const result = await executeLifeScheduleDayTaskPost(requestParams);
      return {
        success: true,
        data: result !== null
      };
    }, [executeLifeScheduleDayTaskPost]),

    // Googleカレンダーへの登録
    registGoogleCalendar: useCallback(async (requestParams: EventsGoogleCalendarRegistPostApiRequest): Promise<ApiResponse<boolean>> => {
      const result = await executeEventsGoogleCalendarRegist(requestParams);
      return {
        success: true,
        data: result !== null
      };
    }, [executeEventsGoogleCalendarRegist]),
  };
};