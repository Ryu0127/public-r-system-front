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
    <div className="bg-gradient-to-r from-sky-400 via-purple-400 to-amber-400 px-4 py-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* タイトル */}
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-6">
          ✦ ホロライブ イベントカレンダー ✦
        </h1>

        {/* 月移動コントロール */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md">
          <button
            onClick={onPrevMonth}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            aria-label="前の月"
          >
            ◀
          </button>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-800">
              {year}年 {month}月
            </span>
            <button
              onClick={onToday}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
            >
              今月
            </button>
          </div>

          <button
            onClick={onNextMonth}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            aria-label="次の月"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendarHeader;
