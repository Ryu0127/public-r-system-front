import React from 'react';
import { EventsCalendarState, EventsCalendarActions } from '../hooks/useEventsCalendarState';
import EventsCalendarHeader from '../components/EventsCalendarHeader';
import EventsCalendarGrid from '../components/EventsCalendarGrid';
import Loading from 'components/Loading';

export interface PresenterProps {
  state: EventsCalendarState;
  actions: EventsCalendarActions;
}

/**
 * イベントカレンダーPresenter
 */
const EventsCalendarPresenter: React.FC<PresenterProps> = ({ state, actions }) => {
  if (state.config.isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 border-4 border-purple-200 rounded-full opacity-15 animate-spin-slow" />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* タイトルセクション */}
        <section className="text-center mb-12 animate-fade-in">
          {/* バッジ */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-lg">
              <span className="text-amber-600 text-2xl">✦</span>
              <span className="text-amber-700 text-sm font-medium uppercase tracking-wider">
                HOLOLIVE EVENTS
              </span>
              <span className="text-sky-600 text-2xl">✦</span>
            </div>
          </div>

          {/* タイトル */}
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            イベントカレンダー
          </h1>

          {/* サブタイトル */}
          <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
            ホロライブのイベント予定をカレンダーで確認できます
          </p>

          {/* 装飾的な区切り線 */}
          <div className="flex items-center justify-center gap-3 opacity-40 pt-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </section>

        {/* 月移動ヘッダー */}
        <EventsCalendarHeader
          currentMonth={state.requestParams.currentMonth}
          onPrevMonth={() => actions.changeMonth(-1)}
          onNextMonth={() => actions.changeMonth(1)}
          onToday={actions.goToToday}
        />

        {/* カレンダー */}
        <div className="py-8">
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
  );
};

export default EventsCalendarPresenter;
