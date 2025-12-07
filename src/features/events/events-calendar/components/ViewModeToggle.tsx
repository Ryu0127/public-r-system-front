import React from 'react';
import { ViewMode } from '../types';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * 表示モード切り替えボタンコンポーネント
 */
const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-md border border-gray-200">
      <button
        onClick={() => onViewModeChange('calendar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
          viewMode === 'calendar'
            ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        カレンダー
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
          viewMode === 'list'
            ? 'bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        リスト
      </button>
    </div>
  );
};

export default ViewModeToggle;
