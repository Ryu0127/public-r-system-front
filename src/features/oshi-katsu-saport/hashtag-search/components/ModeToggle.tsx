import React from 'react';
import { HashIcon, SearchIcon } from './Icons';

interface ModeToggleProps {
  mode: 'post' | 'search';
  onModeChange: (mode: 'post' | 'search') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-lg inline-flex gap-2 w-full">
        <button
          onClick={() => onModeChange('post')}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'post'
              ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white shadow-lg shadow-blue-500/30'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
        >
          <HashIcon />
          ハッシュタグ投稿
        </button>
        <button
          onClick={() => onModeChange('search')}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'search'
              ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white shadow-lg shadow-blue-500/30'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SearchIcon />
          タグ検索
        </button>
      </div>
    </section>
  );
};
