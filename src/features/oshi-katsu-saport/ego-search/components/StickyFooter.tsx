import React from 'react';

interface StickyFooterProps {
  onSearchOnTwitter: () => void;
  searchKeyword: string;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  onSearchOnTwitter,
  searchKeyword,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 shadow-2xl z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 検索キーワード表示 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">検索キーワード</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {searchKeyword || '未入力'}
            </p>
          </div>

          {/* 検索ボタン */}
          <button
            onClick={onSearchOnTwitter}
            disabled={!searchKeyword.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
              searchKeyword.trim()
                ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span>Xで検索</span>
          </button>
        </div>
      </div>
    </div>
  );
};
