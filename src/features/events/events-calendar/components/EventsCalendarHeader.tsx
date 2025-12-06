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
    <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800">
          {year}年 {month}月
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-sm font-medium"
          >
            前月
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors text-sm font-medium"
          >
            今月
          </button>
          <button
            onClick={onNextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-sm font-medium"
          >
            次月
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendarHeader;
