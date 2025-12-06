import React from 'react';
import { HololiveEvent, EventsMap } from '../types';

interface EventsCalendarGridProps {
  currentMonth: Date;
  eventsMap: EventsMap;
  onEventClick?: (event: HololiveEvent) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string;
}

/**
 * 月のカレンダー日付配列を生成する
 */
const generateCalendarDays = (currentMonth: Date): CalendarDay[] => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const calendarDays: CalendarDay[] = [];

  // 前月の日付を埋める
  const prevMonthLastDay = new Date(year, month, 0);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  // 当月の日付
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  // 次月の日付を埋める
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      dateKey: formatDateKey(date),
    });
  }

  return calendarDays;
};

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
 * 今日かどうかを判定
 */
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * イベントタイプのバッジカラーを取得
 */
const getEventTypeBadge = (type: HololiveEvent['type']): string => {
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
 * イベントカレンダーグリッドコンポーネント
 */
const EventsCalendarGrid: React.FC<EventsCalendarGridProps> = ({
  currentMonth,
  eventsMap,
  onEventClick,
}) => {
  const calendarDays = generateCalendarDays(currentMonth);
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-sky-100 via-purple-100 to-amber-100 border-b-2 border-gray-300">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-3 text-center text-sm md:text-base font-bold ${
              index === 0
                ? 'text-red-600'
                : index === 6
                ? 'text-blue-600'
                : 'text-gray-800'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7">
        {calendarDays.map((calendarDay, index) => {
          const events = eventsMap[calendarDay.dateKey] || [];
          const dayOfWeek = calendarDay.date.getDay();

          return (
            <div
              key={index}
              className={`min-h-[140px] border-b border-r p-2 transition-all ${
                !calendarDay.isCurrentMonth
                  ? 'bg-gray-50'
                  : calendarDay.isToday
                  ? 'bg-gradient-to-br from-amber-50 to-sky-50'
                  : 'bg-white hover:bg-gradient-to-br hover:from-sky-50 hover:to-purple-50'
              }`}
            >
              {/* 日付表示 */}
              <div
                className={`text-sm md:text-base font-semibold mb-2 ${
                  calendarDay.isToday
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md'
                    : dayOfWeek === 0
                    ? 'text-red-600'
                    : dayOfWeek === 6
                    ? 'text-blue-600'
                    : calendarDay.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {calendarDay.date.getDate()}
              </div>

              {/* イベントリスト */}
              <div className="space-y-1.5">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="group relative cursor-pointer"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div
                      className="text-xs px-2 py-1.5 rounded-lg truncate shadow-sm hover:shadow-md transition-all border border-opacity-20"
                      style={{
                        backgroundColor: event.color + '20',
                        borderColor: event.color,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>{getEventTypeBadge(event.type)}</span>
                        <span
                          className="font-medium truncate"
                          style={{ color: event.color }}
                        >
                          {event.title}
                        </span>
                      </div>
                      {event.startTime && (
                        <div className="text-xs text-gray-600 mt-0.5">
                          {event.startTime}
                        </div>
                      )}
                    </div>

                    {/* ホバー時のツールチップ */}
                    <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block">
                      <div
                        className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-[200px] max-w-[300px]"
                        style={{ borderLeft: `4px solid ${event.color}` }}
                      >
                        <div className="font-bold mb-1">{event.title}</div>
                        <div className="text-gray-300 mb-1">{event.talentName}</div>
                        {event.startTime && (
                          <div className="text-gray-400">
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </div>
                        )}
                        {event.description && (
                          <div className="text-gray-300 mt-2 pt-2 border-t border-gray-700">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 追加イベント数表示 */}
                {events.length > 3 && (
                  <div className="text-xs text-gray-500 font-semibold px-2 py-1 bg-gray-100 rounded">
                    +{events.length - 3} 件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsCalendarGrid;
