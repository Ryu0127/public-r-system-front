import React, { useState } from 'react';
import { TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { HashIcon, SearchIcon } from './Icons';
import { SelectedTagsDisplay } from './SelectedTagsDisplay';
import { SearchPreviewDisplay } from './SearchPreviewDisplay';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface StickyFooterProps {
  hideOnMobile?: boolean;
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
  hideOnMobile = false,
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
  const [isFooterHidden, setIsFooterHidden] = useState(false);
  const hiddenByDropdown = hideOnMobile;
  const isHidden = isFooterHidden || hiddenByDropdown;

  if (isHidden) {
    return (
      <button
        onClick={() => setIsFooterHidden(false)}
        className="fixed bottom-0 right-4 z-50 max-w-2xl mx-auto bg-white border border-gray-300 rounded-t-2xl rounded-b-none shadow-[0_-6px_18px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-700">投稿確認</h3>
        <span className="flex items-center gap-3 text-gray-600">
          <ChevronUpIcon className="w-5 h-5" />
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-end mb-2">
          <button
            onClick={() => setIsFooterHidden(true)}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            フッターを非表示
          </button>
        </div>
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
              <div className="flex flex-col md:flex-row gap-3">
                {/* 表示/非表示トグルボタン */}
                <button
                  onClick={() => onShowSelectedTagsChange(!showSelectedTags)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border border-gray-300 whitespace-nowrap w-full md:w-auto"
                  title={showSelectedTags ? '選択中のハッシュタグを非表示' : '選択中のハッシュタグを表示'}
                >
                  {showSelectedTags ? (
                    <>
                      <ChevronDownIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">選択中のハッシュタグを非表示</span>
                    </>
                  ) : (
                    <>
                      <ChevronUpIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">選択中のハッシュタグを表示</span>
                    </>
                  )}
                </button>

                {/* Xで投稿ボタン */}
                <button
                  onClick={onPostToTwitter}
                  disabled={selectedTags.length === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
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
                <p className="text-xs text-gray-500 text-center mt-2">
                  {selectedTags.length > 0
                    ? `${selectedTags.length}個のハッシュタグが選択されています`
                    : 'ハッシュタグを選択してください'
                  }
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-2">
                ※ 投稿ボタンを押下すると、新しいタブでXの投稿画面が開きます<br />
                ボタンを押下しただけでは、まだ投稿はされませんためご注意ください。
              </p>
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
                  disabled={!searchQuery.trim()}
                  className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
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
                <p className="text-xs text-gray-500 text-center mt-2">
                  {searchQuery.trim()
                    ? `検索ハッシュタグ: #${searchQuery.trim()}`
                    : '検索するハッシュタグを入力してください'
                  }
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-2">
                ※ ボタンを押下すると、新しいタブでXの検索結果画面が開きます。
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
