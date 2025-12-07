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

interface EventBar {
  event: HololiveEvent;
  startCol: number; // 0-6 (日曜-土曜)
  span: number; // 横に何列分伸びるか
  weekRow: number; // カレンダーの何週目か
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
    case 'goods':
      return '🛍️';
    case 'voice':
      return '🎧';
    case 'application':
      return '📝';
    default:
      return '📅';
  }
};

/**
 * イベントバーを計算（複数日にわたるイベント対応）
 */
const calculateEventBars = (
  calendarDays: CalendarDay[],
  eventsMap: EventsMap
): EventBar[] => {
  const eventBars: EventBar[] = [];
  const processedEvents = new Set<string>();

  calendarDays.forEach((day, dayIndex) => {
    const weekRow = Math.floor(dayIndex / 7);
    const dayOfWeek = dayIndex % 7;
    const events = eventsMap[day.dateKey] || [];

    events.forEach((event) => {
      // すでに処理済みのイベントはスキップ
      if (processedEvents.has(event.id)) {
        return;
      }

      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      // このイベントが表示される全ての週を計算
      const eventStartIndex = dayIndex;
      const eventEndIndex = calendarDays.findIndex(
        (d) => d.dateKey === formatDateKey(endDate)
      );

      if (eventEndIndex === -1) {
        // 終了日がカレンダー範囲外の場合、カレンダーの最後まで表示
        const span = 7 - dayOfWeek;
        eventBars.push({
          event,
          startCol: dayOfWeek,
          span,
          weekRow,
        });
      } else {
        // 週をまたぐ場合、複数のバーに分割
        let currentIndex = eventStartIndex;
        let currentWeekRow = weekRow;

        while (currentIndex <= eventEndIndex) {
          const currentDayOfWeek = currentIndex % 7;
          const weekEndIndex = Math.min(
            currentIndex + (6 - currentDayOfWeek),
            eventEndIndex
          );
          const span = weekEndIndex - currentIndex + 1;

          eventBars.push({
            event,
            startCol: currentDayOfWeek,
            span,
            weekRow: currentWeekRow,
          });

          currentIndex = weekEndIndex + 1;
          currentWeekRow++;
        }
      }

      processedEvents.add(event.id);
    });
  });

  return eventBars;
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
  const eventBars = calculateEventBars(calendarDays, eventsMap);
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const weeks = 6; // 6週分表示

  // 週ごとのイベントバーをグループ化
  const eventBarsByWeek: { [week: number]: EventBar[] } = {};
  eventBars.forEach((bar) => {
    if (!eventBarsByWeek[bar.weekRow]) {
      eventBarsByWeek[bar.weekRow] = [];
    }
    eventBarsByWeek[bar.weekRow].push(bar);
  });

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
      <div>
        {Array.from({ length: weeks }).map((_, weekIndex) => {
          const weekDays = calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
          const weekEventBars = eventBarsByWeek[weekIndex] || [];

          return (
            <div key={weekIndex} className="relative">
              {/* 日付グリッド */}
              <div className="grid grid-cols-7">
                {weekDays.map((calendarDay, dayIndex) => {
                  const dayOfWeek = calendarDay.date.getDay();

                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[200px] border-b border-r p-2 transition-all ${
                        !calendarDay.isCurrentMonth
                          ? 'bg-gray-50'
                          : calendarDay.isToday
                          ? 'bg-gradient-to-br from-amber-50 to-sky-50'
                          : 'bg-white hover:bg-gradient-to-br hover:from-sky-50 hover:to-purple-50'
                      }`}
                    >
                      {/* 日付表示 */}
                      <div
                        className={`text-sm md:text-base font-semibold mb-1 ${
                          calendarDay.isToday
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-xs'
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
                    </div>
                  );
                })}
              </div>

              {/* イベントバー（絶対配置） */}
              <div className="absolute top-10 left-0 right-0 pointer-events-none">
                <div className="grid grid-cols-7">
                  {(() => {
                    // 各列（日付）ごとのイベントカウントを追跡
                    const columnEventCounts: { [col: number]: number } = {};

                    return weekEventBars
                      .sort((a, b) => {
                        // 開始列順、同じ列なら開始日順にソート
                        if (a.startCol === b.startCol) {
                          return a.event.date.localeCompare(b.event.date);
                        }
                        return a.startCol - b.startCol;
                      })
                      .map((bar, barIndex) => {
                        const leftOffset = (bar.startCol / 7) * 100;
                        const width = (bar.span / 7) * 100;

                        // この列でのイベント順序を取得
                        const eventIndexInColumn = columnEventCounts[bar.startCol] || 0;
                        columnEventCounts[bar.startCol] = eventIndexInColumn + 1;

                        return (
                          <div
                            key={`${bar.event.id}-${barIndex}`}
                            className="col-span-7 relative pointer-events-auto"
                            style={{
                              marginTop: `${eventIndexInColumn * 24}px`,
                            }}
                          >
                        <div
                          className="absolute cursor-pointer group"
                          style={{
                            left: `${leftOffset}%`,
                            width: `${width}%`,
                            paddingLeft: '0.25rem',
                            paddingRight: '0.25rem',
                          }}
                          onClick={() => onEventClick?.(bar.event)}
                        >
                          <div
                            className="px-1.5 py-0.5 rounded shadow-sm hover:shadow-md transition-all border border-opacity-20"
                            style={{
                              backgroundColor: bar.event.color + '20',
                              borderColor: bar.event.color,
                              fontSize: '0.65rem',
                              lineHeight: '1.2',
                            }}
                          >
                            <div className="flex items-center gap-0.5 overflow-hidden">
                              <span className="flex-shrink-0 text-xs">
                                {getEventTypeIcon(bar.event.type)}
                              </span>
                              <span
                                className="font-medium truncate"
                                style={{ color: bar.event.color }}
                              >
                                {bar.event.title}
                              </span>
                            </div>
                          </div>

                          {/* ホバー時のツールチップ */}
                          <div className="absolute left-0 top-full mt-1 z-20 hidden group-hover:block">
                            <div
                              className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-[200px] max-w-[300px]"
                              style={{ borderLeft: `4px solid ${bar.event.color}` }}
                            >
                              <div className="font-bold mb-1">{bar.event.title}</div>
                              <div className="text-gray-300 mb-1">{bar.event.talentName}</div>
                              {bar.event.endDate && (
                                <div className="text-gray-400">
                                  {bar.event.date} ~ {bar.event.endDate}
                                </div>
                              )}
                              {bar.event.startTime && (
                                <div className="text-gray-400">
                                  {bar.event.startTime}
                                  {bar.event.endTime && ` - ${bar.event.endTime}`}
                                </div>
                              )}
                              {bar.event.description && (
                                <div className="text-gray-300 mt-2 pt-2 border-t border-gray-700">
                                  {bar.event.description}
                                </div>
                              )}
                            </div>
                          </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsCalendarGrid;
