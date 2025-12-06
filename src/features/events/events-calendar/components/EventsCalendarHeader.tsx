import React from 'react';

interface EventsCalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

/**
 * イベントカレンダーヘッダーコンポーネント
 */
const EventsCalendarHeader: React.FC<EventsCalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onYearChange,
  onMonthChange,
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  // 年の選択肢（現在の年の前後5年）
  const yearOptions = Array.from({ length: 11 }, (_, i) => year - 5 + i);

  // 月の選択肢（1-12）
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        {/* 年月表示（セレクトボックス） */}
        <div className="flex items-baseline gap-2">
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="text-3xl font-bold text-gray-700 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-lg text-gray-400 font-light">年</span>

          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="text-3xl font-bold text-gray-700 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer ml-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-lg text-gray-400 font-light">月</span>
        </div>

        {/* 月移動ボタン */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevMonth}
            className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium"
          >
            ← 前月
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onToday}
            className="text-sky-600 hover:text-sky-700 transition-colors text-sm font-semibold"
          >
            今月
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onNextMonth}
            className="text-gray-600 hover:text-amber-600 transition-colors text-sm font-medium"
          >
            次月 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendarHeader;
