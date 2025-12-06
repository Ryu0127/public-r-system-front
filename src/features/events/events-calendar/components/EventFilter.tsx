import React from 'react';
import { FilterCategory } from '../types';

interface EventFilterProps {
  selectedFilters: FilterCategory[];
  onToggleFilter: (category: FilterCategory) => void;
}

/**
 * イベントフィルターコンポーネント
 */
const EventFilter: React.FC<EventFilterProps> = ({ selectedFilters, onToggleFilter }) => {
  const filterOptions: { value: FilterCategory; label: string }[] = [
    { value: 'streaming', label: '記念配信' },
    { value: 'event', label: 'イベント/イベント申込' },
    { value: 'goods', label: '期間限定グッズ/ボイス' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filterOptions.map((option) => {
        const isSelected = selectedFilters.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onToggleFilter(option.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default EventFilter;
