import React from 'react';
import { TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { HashIcon, SearchIcon } from './Icons';
import { SelectedTagsDisplay } from './SelectedTagsDisplay';
import { SearchPreviewDisplay } from './SearchPreviewDisplay';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface StickyFooterProps {
  mode: 'post' | 'search';
  // 投稿モード用
  selectedTags: string[];
  selectedEventHashtags: TalentHashtagsApiEventHashtag[];
  includeEventUrl: boolean;
  showSelectedTags: boolean;
  onPostToTwitter: () => void;
  onClearTags: () => void;
  onIncludeEventUrlChange: (include: boolean) => void;
  onShowSelectedTagsChange: (show: boolean) => void;
  // 検索モード用
  searchQuery: string;
  showSearchPreview: boolean;
  onSearchOnTwitter: () => void;
  onSearchQueryChange: (query: string) => void;
  onShowSearchPreviewChange: (show: boolean) => void;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  mode,
  selectedTags,
  selectedEventHashtags,
  includeEventUrl,
  showSelectedTags,
  onPostToTwitter,
  onClearTags,
  onIncludeEventUrlChange,
  onShowSelectedTagsChange,
  searchQuery,
  showSearchPreview,
  onSearchOnTwitter,
  onSearchQueryChange,
  onShowSearchPreviewChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {/* 投稿モード */}
          {mode === 'post' && (
            <>
              {/* 選択中のハッシュタグ表示エリア */}
              {showSelectedTags && (
                <SelectedTagsDisplay
                  selectedTags={selectedTags}
                  onClearTags={onClearTags}
                />
              )}

              {/* ボタンエリア */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* 表示/非表示トグルボタン */}
                <button
                  onClick={() => onShowSelectedTagsChange(!showSelectedTags)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 border border-gray-300 whitespace-nowrap w-full md:w-auto"
                  title={showSelectedTags ? '選択中のハッシュタグを非表示' : '選択中のハッシュタグを表示'}
                >
                  {showSelectedTags ? (
                    <>
                      <ChevronDownIcon className="w-5 h-5" />
                      <span className="text-xs md:text-sm font-medium">選択中を非表示</span>
                    </>
                  ) : (
                    <>
                      <ChevronUpIcon className="w-5 h-5" />
                      <span className="text-xs md:text-sm font-medium">選択中を表示</span>
                    </>
                  )}
                </button>

                {/* Xで投稿ボタン */}
                <button
                  onClick={onPostToTwitter}
                  disabled={selectedTags.length === 0}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedTags.length > 0
                      ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <HashIcon />
                  Xで投稿する
                </button>
              </div>

              {!showSelectedTags && (
                <p className="text-xs text-gray-500 text-center mt-1.5">
                  {selectedTags.length > 0
                    ? `${selectedTags.length}個選択中`
                    : 'ハッシュタグを選択してください'
                  }
                </p>
              )}
            </>
          )}

          {/* 検索モード */}
          {mode === 'search' && (
            <>
              {/* 検索プレビュー表示エリア */}
              {showSearchPreview && (
                <SearchPreviewDisplay
                  searchQuery={searchQuery}
                  onSearchQueryChange={onSearchQueryChange}
                />
              )}

              {/* ボタンエリア */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* 表示/非表示トグルボタン */}
                <button
                  onClick={() => onShowSearchPreviewChange(!showSearchPreview)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 border border-gray-300 whitespace-nowrap w-full md:w-auto"
                  title={showSearchPreview ? '検索プレビューを非表示' : '検索プレビューを表示'}
                >
                  {showSearchPreview ? (
                    <>
                      <ChevronDownIcon className="w-5 h-5" />
                      <span className="text-xs md:text-sm font-medium">プレビューを非表示</span>
                    </>
                  ) : (
                    <>
                      <ChevronUpIcon className="w-5 h-5" />
                      <span className="text-xs md:text-sm font-medium">プレビューを表示</span>
                    </>
                  )}
                </button>

                {/* Xで検索ボタン */}
                <button
                  onClick={onSearchOnTwitter}
                  disabled={!searchQuery.trim()}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    searchQuery.trim()
                      ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <SearchIcon />
                  Xで検索する
                </button>
              </div>

              {!showSearchPreview && (
                <p className="text-xs text-gray-500 text-center mt-1.5">
                  {searchQuery.trim()
                    ? `#${searchQuery.trim()}`
                    : '検索ハッシュタグを入力'
                  }
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
