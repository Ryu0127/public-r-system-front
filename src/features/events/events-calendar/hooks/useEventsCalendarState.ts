import { useCallback, useEffect } from 'react';
import { HololiveEvent, EventsMap } from '../types';
import { mockEvents } from '../data/mockEvents';

export interface EventsCalendarState {
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
    eventsMap: EventsMap; // 日付ごとのイベントマップ
  };
}

export interface EventsCalendarActions {
  configControl: {
    sidebarVisible: {
      toggle: () => void;
      close: () => void;
    };
  };
  // 月変更アクション
  changeMonth: (offset: number) => void; // offset: -1(前月), 0(今月), 1(次月)
  changeYear: (year: number) => void; // 年を指定して変更
  changeMonthDirect: (month: number) => void; // 月を指定して変更（1-12）
  goToToday: () => void;
  // データ取得
  fetchMonthData: (month: Date) => void;
  // イベントクリック
  handleEventClick: (event: HololiveEvent) => void;
}

/**
 * モックイベントデータを日付ごとのマップに変換
 */
const transformEventsToMap = (events: HololiveEvent[]): EventsMap => {
  const eventsMap: EventsMap = {};

  events.forEach((event) => {
    const dateKey = event.date;
    if (!eventsMap[dateKey]) {
      eventsMap[dateKey] = [];
    }
    eventsMap[dateKey].push(event);
  });

  // 各日付のイベントを時刻順にソート
  Object.keys(eventsMap).forEach((dateKey) => {
    eventsMap[dateKey].sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  });

  return eventsMap;
};

/**
 * カスタムフック（状態管理）
 */
export const useEventsCalendarState = (
  state: EventsCalendarState,
  setState: React.Dispatch<React.SetStateAction<EventsCalendarState>>
): {
  actions: EventsCalendarActions;
} => {
  const actions: EventsCalendarActions = {
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
     * 年を指定して変更
     */
    changeYear: useCallback(
      (year: number) => {
        setState(prev => {
          const newMonth = new Date(prev.requestParams.currentMonth);
          newMonth.setFullYear(year);
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
     * 月を指定して変更（1-12）
     */
    changeMonthDirect: useCallback(
      (month: number) => {
        setState(prev => {
          const newMonth = new Date(prev.requestParams.currentMonth);
          newMonth.setMonth(month - 1); // 0-11に変換
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
     * 月データ取得（モックデータから）
     */
    fetchMonthData: useCallback(async (month: Date) => {
      try {
        // モックデータをそのまま使用（実際のAPIではここで月のデータをフィルタリング）
        const eventsMap = transformEventsToMap(mockEvents);

        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            isLoading: false,
          },
          data: {
            eventsMap,
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
    }, [setState]),

    /**
     * イベントクリック時の処理
     */
    handleEventClick: useCallback((event: HololiveEvent) => {
      // URLがある場合は新しいタブで開く
      if (event.url) {
        window.open(event.url, '_blank', 'noopener,noreferrer');
      } else {
        // URLがない場合はイベント情報をログ出力（将来的にモーダル表示などに拡張可能）
        console.log('Event clicked:', event);
      }
    }, []),
  };

  /**
   * 月が変更されたときのデータ取得
   */
  useEffect(() => {
    actions.fetchMonthData(state.requestParams.currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.requestParams.currentMonth]);

  return { actions };
};
