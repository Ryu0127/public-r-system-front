import React from 'react';
import { Hashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import { SearchIcon, getHashtagIcon } from './Icons';

interface HashtagSearchModeProps {
  selectedTalent: Talent | null;
  hashtags: Hashtag[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onQuickSearch: (tag: string) => void;
  onSearchOnTwitter: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const HashtagSearchMode: React.FC<HashtagSearchModeProps> = ({
  selectedTalent,
  hashtags,
  searchQuery,
  onSearchQueryChange,
  onQuickSearch,
  onSearchOnTwitter,
  onKeyPress,
}) => {
  const quickSearchTags = hashtags.slice(0, 6);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      {/* カードヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <SearchIcon />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              タグ検索
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTalent?.name || '未選択'}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          ハッシュタグを入力してXで検索できます
        </p>
      </div>

      {/* クイック検索ボタン */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          クイック検索
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {quickSearchTags.map((hashtag) => (
            <button
              key={hashtag.id}
              onClick={() => onQuickSearch(hashtag.tag)}
              className="px-4 py-3 bg-white border-2 border-gray-200 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 group"
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 text-gray-500 group-hover:text-white">
                  {getHashtagIcon(hashtag.description)}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-white">#{hashtag.tag}</span>
                  <span className="text-xs text-gray-500 group-hover:text-blue-100">
                    {hashtag.description}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 検索入力エリア */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          検索するハッシュタグを入力
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="例: ときのそら"
            className="w-full px-4 py-4 pr-12 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※ #記号は自動で追加されます
        </p>
      </div>

      {/* プレビュー */}
      <div className="mb-6">
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

      {/* 検索ボタン */}
      <div>
        <button
          onClick={onSearchOnTwitter}
          disabled={!searchQuery.trim()}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            searchQuery.trim()
              ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <SearchIcon />
          Xで検索する
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          ※ ボタンを押下すると、新しいタブでXの検索結果画面が開きます
        </p>
      </div>
    </div>
  );
};
