import { useCallback, useEffect } from 'react';
import { HololiveEvent, EventsMap, ViewMode, FilterCategory } from '../types';
import { fetchPublicEvents } from '../api/eventsApi';

export interface EventsCalendarState {
  // リクエストパラメータ
  requestParams: {
    currentMonth: Date; // 表示中の月（その月の1日の日付）
  };
  // 画面制御
  config: {
    isLoading: boolean;
    sidebarVisible: boolean;
    viewMode: ViewMode; // 表示モード
    selectedFilters: FilterCategory[]; // 選択中のフィルター
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
  // 表示モード変更
  setViewMode: (mode: ViewMode) => void;
  // フィルター変更
  toggleFilter: (category: FilterCategory) => void;
  clearAllFilters: () => void;
  // データ取得
  fetchMonthData: (month: Date) => void;
  // イベントクリック
  handleEventClick: (event: HololiveEvent) => void;
}

/**
 * モックイベントデータを日付ごとのマップに変換
 * 公開されているイベントのみを含める（statusがpublishedまたは未設定）
 */
const transformEventsToMap = (events: HololiveEvent[]): EventsMap => {
  const eventsMap: EventsMap = {};

  console.log('🔍 transformEventsToMap - 受信イベント数:', events.length);
  console.log('🔍 transformEventsToMap - 受信イベント:', events);

  // イベントのstatusをチェック
  const statusCounts = events.reduce((acc, event) => {
    const status = event.status || 'undefined';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('🔍 transformEventsToMap - ステータス別カウント:', statusCounts);

  // statusに関係なくすべてのイベントを表示
  console.log('🔍 transformEventsToMap - すべてのイベントを表示（statusフィルタリング無効）');

  events.forEach((event) => {
    // 開始日と終了日を取得
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    // イベントの全期間にわたってマッピング
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      // 同じイベントが既に追加されていないかチェック
      if (!eventsMap[dateKey].some(e => e.id === event.id)) {
        eventsMap[dateKey].push(event);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  console.log('🔍 transformEventsToMap - 生成されたイベントマップ:', eventsMap);

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
     * 表示モード変更
     */
    setViewMode: useCallback(
      (mode: ViewMode) => {
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            viewMode: mode,
          },
        }));
      },
      [setState]
    ),

    /**
     * フィルター切り替え
     */
    toggleFilter: useCallback(
      (category: FilterCategory) => {
        setState(prev => {
          const currentFilters = prev.config.selectedFilters;
          const newFilters = currentFilters.includes(category)
            ? currentFilters.filter(f => f !== category)
            : [...currentFilters, category];

          return {
            ...prev,
            config: {
              ...prev.config,
              selectedFilters: newFilters,
            },
          };
        });
      },
      [setState]
    ),

    /**
     * すべてのフィルターを外す
     */
    clearAllFilters: useCallback(() => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          selectedFilters: [],
        },
      }));
    }, [setState]),

    /**
     * 月データ取得（APIから）
     */
    fetchMonthData: useCallback(async (month: Date) => {
      try {
        // ローディング状態を設定
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            isLoading: true,
          },
        }));

        console.log('🔍 fetchMonthData - APIリクエスト開始');

        // APIからイベントデータを取得
        const response = await fetchPublicEvents();

        console.log('🔍 fetchMonthData - APIレスポンス:', response);

        if (response.success && response.data) {
          console.log('🔍 fetchMonthData - 取得したイベント数:', response.data.length);

          const eventsMap = transformEventsToMap(response.data);

          console.log('🔍 fetchMonthData - 最終的なイベントマップ:', eventsMap);

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
        } else {
          console.error('🔍 fetchMonthData - APIエラー:', response.error);
          throw new Error(response.error || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('Failed to fetch month data:', error);
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            isLoading: false,
          },
          data: {
            eventsMap: {},
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
