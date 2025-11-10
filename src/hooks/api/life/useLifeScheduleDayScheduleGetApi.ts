import { useCallback } from 'react';

/**
 * 予定取得APIレスポンス
 */
export interface LifeScheduleDayScheduleApiResponse {
  status: boolean;
  data: {
    schedules: LifeScheduleDayScheduleApiSchedule[];
  };
}

/**
 * 予定データ
 */
export interface LifeScheduleDayScheduleApiSchedule {
  scheduleId: string;
  scheduleName: string;
  startDateTime: Date;
  endDateTime: Date;
  projectId: string;
  projectColor: string;
}

/**
 * 予定取得APIカスタムフック
 */
export const useLifeScheduleDayScheduleGetApi = () => {
  /**
   * 予定取得API実行
   * @param date 対象日付
   */
  const executeLifeScheduleDayScheduleGet = async (date: Date) => {
    try {
      // TODO: 実際のAPI実装時にはここをAPIコールに置き換える
      // 現在はモックデータを返す

      // モックデータ
      const mockSchedules: LifeScheduleDayScheduleApiSchedule[] = [
        {
          scheduleId: '1',
          scheduleName: '通常勤務',
          startDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
          endDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0),
          projectId: '1',
          projectColor: '#0342ab',
        },
        {
          scheduleId: '2',
          scheduleName: '在宅勤務',
          startDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
          endDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 30),
          projectId: '2',
          projectColor: '#03ab8c',
        },
        {
          scheduleId: '3',
          scheduleName: '午前休',
          startDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0),
          endDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0),
          projectId: '1',
          projectColor: '#0342ab',
        },
        {
          scheduleId: '4',
          scheduleName: '午後休',
          startDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
          endDateTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0),
          projectId: '1',
          projectColor: '#0342ab',
        },
      ];

      return {
        success: true,
        data: {
          status: true,
          data: {
            schedules: mockSchedules,
          },
        },
      };
    } catch (error) {
      // API呼出が異常の場合
      console.error('API Error:', error);
      return {
        apiResponse: null,
        error
      }
    }
  };

  return {
    executeLifeScheduleDayScheduleGet,
  };
};
