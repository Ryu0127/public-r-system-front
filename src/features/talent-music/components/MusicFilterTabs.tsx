import React from 'react';
import { MusicFilterType } from '../types';

interface FilterTab {
  key: MusicFilterType;
  label: string;
}

const filterTabs: FilterTab[] = [
  { key: 'all', label: 'すべて' },
  { key: 'original', label: 'オリジナル曲' },
  { key: 'cover', label: 'カバー曲' },
];

interface MusicFilterTabsProps {
  activeFilter: MusicFilterType;
  totalCount: number;
  originalCount: number;
  coverCount: number;
  onFilterChange: (filter: MusicFilterType) => void;
}

export const MusicFilterTabs: React.FC<MusicFilterTabsProps> = ({
  activeFilter,
  totalCount,
  originalCount,
  coverCount,
  onFilterChange,
}) => {
  const counts: Record<MusicFilterType, number> = {
    all: totalCount,
    original: originalCount,
    cover: coverCount,
  };

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-md">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeFilter === tab.key
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="inline sm:hidden">{tab.label.replace('オリジナル曲', 'オリジナル').replace('カバー曲', 'カバー')}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === tab.key ? 'bg-white/30' : 'bg-gray-100'
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
