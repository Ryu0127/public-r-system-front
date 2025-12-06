import React from 'react';

interface EventsCalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

/**
 * イベントカレンダーヘッダーコンポーネント
 */
const EventsCalendarHeader: React.FC<EventsCalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {/* 前月ボタン */}
        <button
          onClick={onPrevMonth}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 transition-all group"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-600 group-hover:text-amber-600 transition-colors">前月</span>
        </button>

        {/* 年月表示（中央） */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-semibold text-gray-700">{year}</h2>
            <span className="text-sm text-gray-400 font-light">年</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-semibold text-gray-700">{month}</h3>
            <span className="text-sm text-gray-400 font-light">月</span>
          </div>
          <button
            onClick={onToday}
            className="ml-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors text-xs font-semibold"
          >
            今月
          </button>
        </div>

        {/* 次月ボタン */}
        <button
          onClick={onNextMonth}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 transition-all group"
        >
          <span className="text-sm font-medium text-gray-600 group-hover:text-amber-600 transition-colors">次月</span>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventsCalendarHeader;
