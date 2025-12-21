import React, { useState } from 'react';
import EventsCalendarPresenter from '../presenters/EventsCalendarPresenter';
import { EventsCalendarState, useEventsCalendarState } from '../hooks/useEventsCalendarState';

/**
 * イベントカレンダーContainer
 */
const EventsCalendarContainer: React.FC = () => {
  // 初期状態
  const [state, setState] = useState<EventsCalendarState>({
    requestParams: {
      currentMonth: (() => {
        const today = new Date();
        today.setDate(1);
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
    },
    config: {
      isLoading: true,
      sidebarVisible: false,
      viewMode: 'calendar',
      selectedFilters: ['イベント申込', 'イベント当落-入金', 'live-配信チケット', 'コラボイベント', 'ポップアップストア'], // デフォルトで全て選択
    },
    data: {
      eventsMap: {},
    },
  });

  // カスタムフックで状態管理
  const { actions } = useEventsCalendarState(state, setState);

  return <EventsCalendarPresenter state={state} actions={actions} />;
};

export default EventsCalendarContainer;
