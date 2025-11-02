import React from 'react';

export interface DateOption {
  value: string;
  label: string;
}

interface LifeScheduleDayDateSelectorProps {
  currentDate: Date;
  dateOptions: DateOption[];
  onDateSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * 日付選択コンポーネント
 * スケジュール画面の日付選択機能を提供
 */
export const LifeScheduleDayDateSelector: React.FC<LifeScheduleDayDateSelectorProps> = ({
  currentDate,
  dateOptions,
  onDateSelect
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <button className="p-1 rounded hover:bg-gray-100">
          <span className="text-lg">◀</span>
        </button>
        <select
          className="border rounded px-3 py-1.5 text-sm bg-white"
          value={currentDate.toISOString()}
          onChange={onDateSelect}
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="p-1 rounded hover:bg-gray-100">
          <span className="text-lg">▶</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm rounded text-gray-600 hover:bg-gray-100">
          今日
        </button>
        <select className="border rounded px-3 py-1.5 text-sm bg-white">
          <option value="day">日</option>
          <option value="week">週</option>
          <option value="month">月</option>
        </select>
      </div>
    </div>
  );
};

export default LifeScheduleDayDateSelector;