import { useCallback, useEffect } from 'react';
import { LifeScheduleMonthTaskApiTask } from 'hooks/api/life/useLifeScheduleMonthTaskGetApi';
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
const transformApiTask = (apiTask: LifeScheduleMonthTaskApiTask): MonthTask => ({
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
      try {
        // 月次API呼び出し（1回の呼び出しで月全体のタスクを取得）
        const apiResponse = await api.executeLifeScheduleMonthTaskGet(month);

        const monthlyTasksMap: MonthlyTasksMap = {};

        if (apiResponse.success && apiResponse.data) {
          // タスクをscheduleDate（yyyy-mm-dd形式）でグループ化
          apiResponse.data.tasks.forEach((task) => {
            const dateKey = task.scheduleDate; // APIレスポンスのscheduleDateをそのまま使用

            if (!monthlyTasksMap[dateKey]) {
              monthlyTasksMap[dateKey] = [];
            }

            monthlyTasksMap[dateKey].push(transformApiTask(task));
          });
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
      } catch (error) {
        console.error('Failed to fetch month data:', error);
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            isLoading: false,
          },
        }));
      }
    }, [api, setState]),
  };

  /**
   * 月が変更されたときのデータ取得
   */
  useEffect(() => {
    // 月が変更されたときにデータを取得
    actions.fetchMonthData(state.requestParams.currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.requestParams.currentMonth]); // currentMonthが変更されたときに再実行

  return { actions };
};
