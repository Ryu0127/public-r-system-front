import React from 'react';
import { HololiveEvent, EventsMap } from '../types';

interface EventsListViewProps {
  currentMonth: Date;
  eventsMap: EventsMap;
  onEventClick?: (event: HololiveEvent) => void;
}

/**
 * イベントタイプのアイコンを取得
 */
const getEventTypeIcon = (type: HololiveEvent['type']): string => {
  switch (type) {
    case 'anniversary':
      return '🎉';
    case 'live':
      return '🎤';
    case 'concert':
      return '🎵';
    case 'meet':
      return '🤝';
    case 'collab':
      return '👥';
    case 'birthday':
      return '🎂';
    default:
      return '📅';
  }
};

/**
 * 日付をフォーマット
 */
const formatDate = (dateStr: string): { month: number; day: number; weekday: string } => {
  const date = new Date(dateStr);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: weekdays[date.getDay()],
  };
};

/**
 * イベントリスト表示コンポーネント
 */
const EventsListView: React.FC<EventsListViewProps> = ({
  currentMonth,
  eventsMap,
  onEventClick,
}) => {
  // 現在の月のイベントを取得してソート
  const currentMonthEvents: { date: string; events: HololiveEvent[] }[] = [];

  Object.keys(eventsMap)
    .sort()
    .forEach((dateKey) => {
      const date = new Date(dateKey);
      if (
        date.getFullYear() === currentMonth.getFullYear() &&
        date.getMonth() === currentMonth.getMonth()
      ) {
        currentMonthEvents.push({ date: dateKey, events: eventsMap[dateKey] });
      }
    });

  if (currentMonthEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">この月にはイベントがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentMonthEvents.map(({ date, events }) => {
        const { month, day, weekday } = formatDate(date);
        const isWeekend = weekday === '土' || weekday === '日';

        return (
          <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            {/* 日付ヘッダー */}
            <div className="bg-gradient-to-r from-amber-50 to-sky-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-700">{day}</span>
                <span className="text-sm text-gray-500">
                  {month}月
                </span>
                <span
                  className={`text-sm font-medium ${
                    weekday === '日' ? 'text-red-600' : weekday === '土' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  ({weekday})
                </span>
              </div>
            </div>

            {/* イベントリスト */}
            <div className="divide-y divide-gray-100">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex gap-3">
                    {/* アイコン */}
                    <div className="flex-shrink-0 text-2xl">{getEventTypeIcon(event.type)}</div>

                    {/* イベント情報 */}
                    <div className="flex-1 min-w-0">
                      {/* タイトル */}
                      <h3
                        className="font-semibold text-gray-800 mb-1"
                        style={{ color: event.color }}
                      >
                        {event.title}
                      </h3>

                      {/* タレント名 */}
                      <p className="text-sm text-gray-600 mb-1">{event.talentName}</p>

                      {/* 時刻 */}
                      {event.startTime && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </div>
                      )}

                      {/* 説明 */}
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      )}
                    </div>

                    {/* 矢印アイコン */}
                    <div className="flex-shrink-0 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsListView;
