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
    <div className="mb-6">
      <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-white/60">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* 年月表示 */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-400 text-white rounded-xl px-5 py-3 shadow-md">
              <span className="text-3xl font-bold">{month}</span>
              <span className="text-lg ml-1">月</span>
            </div>
            <div className="bg-gradient-to-br from-sky-400 to-blue-400 text-white rounded-xl px-5 py-3 shadow-md">
              <span className="text-2xl font-bold">{year}</span>
              <span className="text-sm ml-1">年</span>
            </div>
          </div>

          {/* 月移動ボタン */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevMonth}
              className="group flex items-center justify-center w-12 h-12 rounded-xl bg-white hover:bg-gradient-to-br hover:from-sky-400 hover:to-blue-400 text-gray-600 hover:text-white shadow-md hover:shadow-xl transition-all duration-300"
              aria-label="前の月"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={onToday}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 font-semibold text-sm"
            >
              今月
            </button>

            <button
              onClick={onNextMonth}
              className="group flex items-center justify-center w-12 h-12 rounded-xl bg-white hover:bg-gradient-to-br hover:from-sky-400 hover:to-blue-400 text-gray-600 hover:text-white shadow-md hover:shadow-xl transition-all duration-300"
              aria-label="次の月"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendarHeader;
