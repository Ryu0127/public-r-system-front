import React from 'react';

interface SearchPreviewDisplayProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const SearchPreviewDisplay: React.FC<SearchPreviewDisplayProps> = ({
  searchQuery,
  onSearchQueryChange,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          検索プレビュー
        </h3>
        <button
          onClick={() => onSearchQueryChange('')}
          disabled={!searchQuery.trim()}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 border ${
            searchQuery.trim()
              ? 'text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-gray-200 hover:border-red-300 cursor-pointer'
              : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
          }`}
        >
          クリア
        </button>
      </div>
      <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
        {searchQuery.trim() ? (
          <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#1DA1F2] text-white text-lg rounded-full shadow-md">
            #{searchQuery.trim()}
          </span>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            検索するハッシュタグを入力してください
          </p>
        )}
      </div>
    </div>
  );
};
