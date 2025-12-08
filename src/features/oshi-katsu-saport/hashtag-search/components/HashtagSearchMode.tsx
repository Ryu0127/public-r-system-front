import React from 'react';
import { TalentHashtagsApiHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { SearchIcon, getHashtagIcon } from './Icons';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import TalentAccountFilters from './TalentAccountFilters';

interface HashtagSearchModeProps {
  state: HashtagSearchState;
  actions: HashtagSearchActions;
  selectedTalent: any;
  hashtags: TalentHashtagsApiHashtag[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onQuickSearch: (tag: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const HashtagSearchMode: React.FC<HashtagSearchModeProps> = ({
  state,
  actions,
  selectedTalent,
  hashtags,
  searchQuery,
  onSearchQueryChange,
  onQuickSearch,
  onKeyPress,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      {/* カードヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <SearchIcon />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              タグ検索
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTalent?.talentNameJoin || '未選択'}
            </p>
          </div>
          <button
            onClick={() => actions.setShowAdvancedFilters(!state.config.showAdvancedFilters)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              state.config.showAdvancedFilters
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {state.config.showAdvancedFilters ? '詳細フィルタを閉じる' : '詳細フィルタ'}
          </button>
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
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {hashtags.map((hashtag) => (
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

      {/* 高度検索フィルタ */}
      {state.config.showAdvancedFilters && (
        <div className="space-y-4">
          <TalentAccountFilters state={state} actions={actions} />
          <AdvancedSearchFilters state={state} actions={actions} />
        </div>
      )}
    </div>
  );
};
