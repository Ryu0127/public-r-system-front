import React from 'react';
import { FilterCategory } from '../types';

interface EventFilterProps {
  selectedFilters: FilterCategory[];
  onToggleFilter: (category: FilterCategory) => void;
  onClearAllFilters: () => void;
}

/**
 * イベントフィルターコンポーネント（チェックボックス形式）
 */
const EventFilter: React.FC<EventFilterProps> = ({ selectedFilters, onToggleFilter, onClearAllFilters }) => {
  const filterOptions: { value: FilterCategory; label: string }[] = [
    { value: 'イベント申込', label: 'イベント申込' },
    { value: 'イベント当落-入金', label: 'イベント当落-入金' },
    { value: 'live-配信チケット', label: 'live-配信チケット' },
    { value: 'コラボイベント', label: 'コラボイベント' },
    { value: 'ポップアップストア', label: 'ポップアップストア' },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-sm font-medium text-gray-700">表示項目:</span>
      {filterOptions.map((option) => {
        const isSelected = selectedFilters.includes(option.value);
        return (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleFilter(option.value)}
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
              {option.label}
            </span>
          </label>
        );
      })}
      <button
        onClick={onClearAllFilters}
        className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-colors"
      >
        すべて外す
      </button>
    </div>
  );
};

export default EventFilter;
