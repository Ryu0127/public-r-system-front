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
      <div className="flex flex-col items-center gap-4">
        {/* 年月表示（中央揃え） */}
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-semibold text-gray-700">{year}</h2>
          <span className="text-sm text-gray-400 font-light">年</span>
          <h3 className="text-3xl font-semibold text-gray-700 ml-3">{month}</h3>
          <span className="text-sm text-gray-400 font-light">月</span>
        </div>

        {/* 月移動ボタン（中央揃え固定配置） */}
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
