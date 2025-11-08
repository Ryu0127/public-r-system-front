import { useCallback, useEffect } from 'react';
import { LifeScheduleDayTaskApiTask } from 'hooks/api/life/useLifeScheduleDayTaskGetApi';
import { useLifeScheduleMonthApi } from './useLifeScheduleMonthApi';

export interface LifeScheduleMonthState {
  // リクエストパラメータ
  requestParams: {
    currentMonth: Date; // 表示中の月（その月の1日の日付）
  };
  // 画面制御
  config: {
    isLoading: boolean;
    sidebarVisible: boolean;
  };
  // データ項目
  data: {
    monthlyTasks: MonthlyTasksMap; // 日付ごとのタスクマップ
  };
}

// 日付ごとのタスクマップ (yyyy-mm-dd形式の日付文字列をキーとする)
export type MonthlyTasksMap = Record<string, MonthTask[]>;

export interface MonthTask {
  taskId: string;
  taskName: string;
  startDateTime: Date;
  endDateTime: Date;
  projectId: string;
  projectColor: string;
}

export interface LifeScheduleMonthActions {
  configControl: {
    sidebarVisible: {
      toggle: () => void;
      close: () => void;
    };
  };
  // 月変更アクション
  changeMonth: (offset: number) => void; // offset: -1(前月), 0(今月), 1(次月)
  goToToday: () => void;
  // データ取得
  fetchMonthData: (month: Date) => void;
}

/**
 * 日付を yyyy-mm-dd 形式の文字列に変換
 */
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * APIタスクデータを月次タスクに変換
 */
const transformApiTask = (apiTask: LifeScheduleDayTaskApiTask): MonthTask => ({
  taskId: apiTask.taskId,
  taskName: apiTask.taskName,
  startDateTime: new Date(apiTask.startDateTime),
  endDateTime: new Date(apiTask.endDateTime),
  projectId: apiTask.projectId,
  projectColor: '#0342ab', // デフォルトカラー
});

/**
 * カスタムフック（状態管理）
 */
export const useLifeScheduleMonthState = (
  state: LifeScheduleMonthState,
  setState: React.Dispatch<React.SetStateAction<LifeScheduleMonthState>>
): {
  actions: LifeScheduleMonthActions;
} => {
  // API Hooks
  const api = useLifeScheduleMonthApi();

  const actions: LifeScheduleMonthActions = {
    /**
     * 画面制御
     */
    configControl: {
      sidebarVisible: {
        toggle: useCallback(() => {
          setState(prev => ({
            ...prev,
            config: {
              ...prev.config,
              sidebarVisible: !prev.config.sidebarVisible,
            },
          }));
        }, [setState]),
        close: useCallback(() => {
          setState(prev => ({
            ...prev,
            config: {
              ...prev.config,
              sidebarVisible: false,
            },
          }));
        }, [setState]),
      },
    },

    /**
     * 月変更
     */
    changeMonth: useCallback(
      (offset: number) => {
        setState(prev => {
          const newMonth = new Date(prev.requestParams.currentMonth);
          newMonth.setMonth(newMonth.getMonth() + offset);
          newMonth.setDate(1); // 1日に設定
          return {
            ...prev,
            requestParams: {
              currentMonth: newMonth,
            },
          };
        });
      },
      [setState]
    ),

    /**
     * 今月に移動
     */
    goToToday: useCallback(() => {
      const today = new Date();
      today.setDate(1);
      today.setHours(0, 0, 0, 0);
      setState(prev => ({
        ...prev,
        requestParams: {
          currentMonth: today,
        },
      }));
    }, [setState]),

    /**
     * 月データ取得
     */
    fetchMonthData: useCallback(async (month: Date) => {
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const currentDate = new Date(startDate);
      const apiResponse = await api.executeLifeScheduleDayTaskGet(currentDate);
      const dateKey = formatDateKey(currentDate);

      const monthlyTasksMap: MonthlyTasksMap = {};
      if (apiResponse.success && apiResponse.data) {
        monthlyTasksMap[dateKey] = apiResponse.data.tasks.map(transformApiTask);
      } else {
        monthlyTasksMap[dateKey] = [];
      }

      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
        },
        data: {
          monthlyTasks: monthlyTasksMap,
        },
      }));

        // try {
        //   // 月の最初の日と最後の日を取得
        //   const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
        //   const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        //   // 月の各日のタスクを取得
        //   const monthlyTasksMap: MonthlyTasksMap = {};
        //   const currentDate = new Date(startDate);

        //   while (currentDate <= endDate) {
        //     const dateKey = formatDateKey(currentDate);
        //     const result = await executeLifeScheduleDayTaskGet(new Date(currentDate));

        //     if (result.apiResponse?.status && result.apiResponse?.data) {
        //       monthlyTasksMap[dateKey] = result.apiResponse.data.tasks.map(transformApiTask);
        //     } else {
        //       monthlyTasksMap[dateKey] = [];
        //     }

        //     currentDate.setDate(currentDate.getDate() + 1);
        //   }

        //   setState(prev => ({
        //     ...prev,
        //     config: {
        //       ...prev.config,
        //       isLoading: false,
        //     },
        //     data: {
        //       monthlyTasks: monthlyTasksMap,
        //     },
        //   }));
        // } catch (error) {
        //   console.error('Failed to fetch month data:', error);
        //   setState(prev => ({
        //     ...prev,
        //     config: {
        //       ...prev.config,
        //       isLoading: false,
        //     },
        //   }));
        // }
    }, [api, setState]),
  };

  /**
   * 初期データ取得
   */
  useEffect(() => {
    // 初期データ取得
    actions.fetchMonthData(state.requestParams.currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disableコメントでビルドエラーによる警告を抑制

  return { actions };
};
