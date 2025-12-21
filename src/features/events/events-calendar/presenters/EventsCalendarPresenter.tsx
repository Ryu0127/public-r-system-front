import React, { useState } from 'react';
import { EventsCalendarState, EventsCalendarActions } from '../hooks/useEventsCalendarState';
import EventsCalendarHeader from '../components/EventsCalendarHeader';
import EventsCalendarGrid from '../components/EventsCalendarGrid';
import EventsListView from '../components/EventsListView';
import ViewModeToggle from '../components/ViewModeToggle';
import EventFilter from '../components/EventFilter';
import EventDetailModal from '../components/EventDetailModal';
import { filterEventsMap } from '../utils/filterEvents';
import { HololiveEvent } from '../types';
import Loading from 'components/Loading';

export interface PresenterProps {
  state: EventsCalendarState;
  actions: EventsCalendarActions;
}

/**
 * イベントカレンダーPresenter
 */
const EventsCalendarPresenter: React.FC<PresenterProps> = ({ state, actions }) => {
  // モーダル状態管理
  const [selectedEvent, setSelectedEvent] = useState<HololiveEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (state.config.isLoading) {
    return <Loading />;
  }

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // イベントクリック時の処理
  const handleEventClick = (event: HololiveEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // フィルタリングされたイベントマップ
  const filteredEventsMap = filterEventsMap(state.data.eventsMap, state.config.selectedFilters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fade-in">
          {/* ホームに戻るボタン */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-amber-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-amber-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">ホームに戻る</span>
            </button>

            {/* モード切り替え（右上） */}
            <div className="flex md:flex-row md:justify-end justify-center md:items-center gap-4 mt-1">
              <ViewModeToggle
                viewMode={state.config.viewMode}
                onViewModeChange={actions.setViewMode}
              />
            </div>
          </div>

          {/* タイトル */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              イベントカレンダー
            </h1>
          </div>

          {/* サブタイトル */}
          <p className="text-lg text-gray-600 font-light">
            ホロライブのイベント予定をカレンダーで確認できます
          </p>
        </header>

        {/* 月移動ヘッダー（中央） */}
        <div className="flex md:flex-row justify-center md:items-center gap-4">
          <EventsCalendarHeader
            currentMonth={state.requestParams.currentMonth}
            onPrevMonth={() => actions.changeMonth(-1)}
            onNextMonth={() => actions.changeMonth(1)}
            onToday={actions.goToToday}
          />
        </div>

        {/* フィルター */}
        <div className="flex justify-center items-center gap-4 mb-8 mt-4">
          <EventFilter
            selectedFilters={state.config.selectedFilters}
            onToggleFilter={actions.toggleFilter}
            onClearAllFilters={actions.clearAllFilters}
          />
        </div>

        {/* カレンダー / リスト表示 */}
        <div>
          {state.config.viewMode === 'calendar' ? (
            <EventsCalendarGrid
              currentMonth={state.requestParams.currentMonth}
              eventsMap={filteredEventsMap}
              onEventClick={handleEventClick}
            />
          ) : (
            <EventsListView
              currentMonth={state.requestParams.currentMonth}
              eventsMap={filteredEventsMap}
              onEventClick={handleEventClick}
            />
          )}

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

      {/* イベント詳細モーダル */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EventsCalendarPresenter;
