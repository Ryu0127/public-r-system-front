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

  // 次月の日付を埋める（週が完全に埋まるまで）
  const remainder = calendarDays.length % 7;
  const remainingDays = remainder === 0 ? 0 : 7 - remainder;
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
  const iconMap: { [key: string]: string } = {
    'live': '🎤',
    'ファンミーティング': '🤝',
    'コラボイベント': '👥',
    'ポップアップストア': '🛍️',
    'リアルイベント': '🎪',
    'イベント申込': '📝',
    'イベント当落-入金': '💰',
  };
  return iconMap[type] || '📅';
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

  console.log('🔍 calculateEventBars - eventsMap:', eventsMap);

  calendarDays.forEach((day, dayIndex) => {
    const weekRow = Math.floor(dayIndex / 7);
    const dayOfWeek = dayIndex % 7;
    const events = eventsMap[day.dateKey] || [];

    events.forEach((event) => {
      console.log('🔍 calculateEventBars - 処理中のイベント:', event);
      console.log('🔍 calculateEventBars - イベントID:', event.id, '型:', typeof event.id);

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

      // 終了日がカレンダー範囲外の場合、カレンダーの最後まで表示
      const finalEndIndex = eventEndIndex === -1 ? calendarDays.length - 1 : eventEndIndex;

      // 週をまたぐ場合、複数のバーに分割
      let currentIndex = eventStartIndex;
      let currentWeekRow = weekRow;

      while (currentIndex <= finalEndIndex) {
        const currentDayOfWeek = currentIndex % 7;
        const weekEndIndex = Math.min(
          currentIndex + (6 - currentDayOfWeek),
          finalEndIndex
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
  const weeks = Math.ceil(calendarDays.length / 7); // 動的に週数を計算

  // 週ごとのイベントバーをグループ化
  const eventBarsByWeek: { [week: number]: EventBar[] } = {};
  eventBars.forEach((bar) => {
    if (!eventBarsByWeek[bar.weekRow]) {
      eventBarsByWeek[bar.weekRow] = [];
    }
    eventBarsByWeek[bar.weekRow].push(bar);
  });

  // 全カレンダーセルでイベントの行割り当てを計算
  const globalBarRowMapping: { [barId: string]: number } = {};
  const globalEventRowMapping: { [eventId: string]: number } = {};

  // 各セルでの占有行を追跡（動的に初期化）
  const cellOccupiedRows: { [cellIndex: number]: Set<number> } = {};
  for (let i = 0; i < calendarDays.length; i++) {
    cellOccupiedRows[i] = new Set();
  }

  // イベントIDごとに、そのイベントが占有する全セルを計算
  const eventCellsMap: { [eventId: string]: number[] } = {};
  eventBars.forEach((bar) => {
    const eventId = bar.event.id;
    if (!eventCellsMap[eventId]) {
      eventCellsMap[eventId] = [];
    }
    // このバーが占有するセルを追加
    for (let col = bar.startCol; col < bar.startCol + bar.span; col++) {
      const cellIndex = bar.weekRow * 7 + col;
      if (!eventCellsMap[eventId].includes(cellIndex)) {
        eventCellsMap[eventId].push(cellIndex);
      }
    }
  });

  // イベントを開始日順、同じ日付ならスパンが長い順にソート
  const sortedEventIds = Object.keys(eventCellsMap).sort((idA, idB) => {
    const barA = eventBars.find(bar => bar.event.id === idA);
    const barB = eventBars.find(bar => bar.event.id === idB);

    if (!barA || !barB) {
      console.error('🔍 EventsCalendarGrid - イベントバーが見つかりません');
      console.error('🔍 探しているID:', { idA, idB });
      console.error('🔍 eventBars:', eventBars);
      console.error('🔍 eventCellsMap:', eventCellsMap);

      // エラーを防ぐためのフォールバック
      if (!barA && !barB) return 0;
      if (!barA) return 1;
      if (!barB) return -1;
    }

    const eventA = barA.event;
    const eventB = barB.event;
    const dateCompare = eventA.date.localeCompare(eventB.date);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    // スパンが長い順（占有セル数が多い順）
    return eventCellsMap[idB].length - eventCellsMap[idA].length;
  });

  // 各イベントに行を割り当て
  sortedEventIds.forEach((eventId) => {
    const cells = eventCellsMap[eventId];

    // このイベントが占有する全てのセルで空いている最初の行を見つける
    let targetRow = 0;
    let foundEmptyRow = false;

    while (!foundEmptyRow) {
      let isRowAvailable = true;

      // 全てのセルをチェック
      for (const cellIndex of cells) {
        if (cellOccupiedRows[cellIndex].has(targetRow)) {
          isRowAvailable = false;
          break;
        }
      }

      if (isRowAvailable) {
        foundEmptyRow = true;
        // 全てのセルでこの行を占有済みとしてマーク
        for (const cellIndex of cells) {
          cellOccupiedRows[cellIndex].add(targetRow);
        }
        globalEventRowMapping[eventId] = targetRow;
      } else {
        targetRow++;
      }
    }
  });

  // 各バーに行を割り当て
  eventBars.forEach((bar) => {
    const barId = `${bar.event.id}-${bar.weekRow}`;
    globalBarRowMapping[barId] = globalEventRowMapping[bar.event.id];
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
                {weekEventBars.map((bar, barIndex) => {
                  const leftOffset = (bar.startCol / 7) * 100;
                  const width = (bar.span / 7) * 100;
                  const barId = `${bar.event.id}-${bar.weekRow}`;
                  const rowIndex = globalBarRowMapping[barId];

                  return (
                    <div
                      key={`${bar.event.id}-${barIndex}`}
                      className="absolute cursor-pointer pointer-events-auto"
                      style={{
                        top: `${rowIndex * 24}px`,
                        left: `${leftOffset}%`,
                        width: `${width}%`,
                        paddingLeft: '0.25rem',
                        paddingRight: '0.25rem',
                      }}
                      onClick={() => onEventClick?.(bar.event)}
                    >
                      <div
                        className="px-1.5 py-0.5 rounded shadow-sm hover:shadow-md transition-all border border-opacity-20 hover:brightness-75"
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
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsCalendarGrid;
