import React from 'react';
import { SearchIcon } from './Icons';
import { SearchPreviewDisplay } from './SearchPreviewDisplay';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { EgoSearchFilters } from '../types';

interface StickyFooterProps {
  filters: EgoSearchFilters;
  showSearchPreview: boolean;
  onSearchOnTwitter: () => void;
  onClearKeyword: () => void;
  onShowSearchPreviewChange: (show: boolean) => void;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  filters,
  showSearchPreview,
  onSearchOnTwitter,
  onClearKeyword,
  onShowSearchPreviewChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* 検索プレビュー表示エリア */}
          {showSearchPreview && (
            <SearchPreviewDisplay
              filters={filters}
              onClearKeyword={onClearKeyword}
            />
          )}

          {/* ボタンエリア */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* 表示/非表示トグルボタン */}
            <button
              onClick={() => onShowSearchPreviewChange(!showSearchPreview)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-300 whitespace-nowrap w-full md:w-auto"
              title={showSearchPreview ? '検索プレビューを非表示' : '検索プレビューを表示'}
            >
              {showSearchPreview ? (
                <>
                  <ChevronDownIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">検索プレビューを非表示</span>
                </>
              ) : (
                <>
                  <ChevronUpIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">検索プレビューを表示</span>
                </>
              )}
            </button>

            {/* Xで検索ボタン */}
            <button
              onClick={onSearchOnTwitter}
              className="flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
            >
              <SearchIcon />
              Xで検索する
            </button>
          </div>

          {!showSearchPreview && filters.searchKeywords.some(k => k.trim() !== '') && (
            <p className="text-xs text-gray-500 text-center mt-2">
              検索キーワード: {filters.searchKeywords.filter(k => k.trim() !== '').join(', ')}
            </p>
          )}

          <p className="text-xs text-gray-500 text-center mt-2">
            ※ ボタンを押下すると、新しいタブでXの検索結果画面が開きます。
          </p>
        </div>
      </div>
    </div>
  );
};
