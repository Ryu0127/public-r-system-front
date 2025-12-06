import React from 'react';
import { EventsCalendarState, EventsCalendarActions } from '../hooks/useEventsCalendarState';
import EventsCalendarHeader from '../components/EventsCalendarHeader';
import EventsCalendarGrid from '../components/EventsCalendarGrid';
import Loading from 'components/Loading';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';

export interface PresenterProps {
  state: EventsCalendarState;
  actions: EventsCalendarActions;
}

/**
 * イベントカレンダーPresenter
 */
const EventsCalendarPresenter: React.FC<PresenterProps> = ({ state, actions }) => {
  return (
    <LayoutBaseTs
      sidebarContent={<HeaderSideMenu items={[]} />}
      sidebarVisible={state.config.sidebarVisible}
      onToggle={actions.configControl.sidebarVisible.toggle}
      onClose={actions.configControl.sidebarVisible.close}
    >
      <>
        {state.config.isLoading ? (
          <Loading />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
            <div
              className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
              style={{ animationDuration: '15s' }}
            />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 border-4 border-purple-200 rounded-full opacity-15 animate-spin-slow" />

            {/* メインコンテンツ */}
            <div className="relative z-10">
              {/* ヘッダー */}
              <EventsCalendarHeader
                currentMonth={state.requestParams.currentMonth}
                onPrevMonth={() => actions.changeMonth(-1)}
                onNextMonth={() => actions.changeMonth(1)}
                onToday={actions.goToToday}
              />

              {/* カレンダー */}
              <div className="max-w-7xl mx-auto px-4 py-8">
                <EventsCalendarGrid
                  currentMonth={state.requestParams.currentMonth}
                  eventsMap={state.data.eventsMap}
                  onEventClick={actions.handleEventClick}
                />

                {/* 凡例 */}
                <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">イベント種類</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎂</span>
                      <span className="text-sm text-gray-700">誕生日配信</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <span className="text-sm text-gray-700">記念配信</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎤</span>
                      <span className="text-sm text-gray-700">ライブ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎵</span>
                      <span className="text-sm text-gray-700">コンサート</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👥</span>
                      <span className="text-sm text-gray-700">コラボ配信</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🤝</span>
                      <span className="text-sm text-gray-700">リアルイベント</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <span className="text-sm text-gray-700">その他</span>
                    </div>
                  </div>
                </div>

                {/* 装飾的なアイコン列 */}
                <div className="flex justify-center gap-6 text-4xl opacity-20 mt-12">
                  <span className="text-amber-500">✦</span>
                  <span className="text-sky-500">◆</span>
                  <span className="text-purple-500">✧</span>
                  <span className="text-amber-500">◆</span>
                  <span className="text-sky-500">✦</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </LayoutBaseTs>
  );
};

export default EventsCalendarPresenter;
