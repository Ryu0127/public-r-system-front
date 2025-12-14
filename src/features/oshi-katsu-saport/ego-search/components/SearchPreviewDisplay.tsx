import React from 'react';
import { buildSearchQueryPreview } from '../utils/buildTwitterSearchUrl';
import { EgoSearchFilters } from '../types';

interface SearchPreviewDisplayProps {
  filters: EgoSearchFilters;
  onClearKeyword: () => void;
}

export const SearchPreviewDisplay: React.FC<SearchPreviewDisplayProps> = ({
  filters,
  onClearKeyword,
}) => {
  const previewText = buildSearchQueryPreview(filters);

  return (
    <div className="mb-4 animate-slide-up">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          検索プレビュー
        </h3>
        <button
          onClick={onClearKeyword}
          disabled={!filters.searchKeyword.trim()}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
            filters.searchKeyword.trim()
              ? 'text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-gray-200 hover:border-red-300 cursor-pointer'
              : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
          }`}
        >
          クリア
        </button>
      </div>
      <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200">
        {previewText ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-1">検索クエリ:</p>
            <p className="text-sm text-gray-800 font-mono break-all">{previewText}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center flex items-center justify-center h-full">
            検索キーワードを入力してください
          </p>
        )}
      </div>
    </div>
  );
};
