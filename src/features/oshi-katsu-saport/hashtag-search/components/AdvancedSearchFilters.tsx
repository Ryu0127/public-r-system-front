import React, { useState } from 'react';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { searchPresets } from '../types/advancedSearchFilters';
import { buildSearchQueryPreview } from '../utils/buildTwitterSearchUrl';

interface AdvancedSearchFiltersProps {
  state: HashtagSearchState;
  actions: HashtagSearchActions;
}

/**
 * 高度な検索フィルタコンポーネント
 */
const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ state, actions }) => {
  const [newExcludeWord, setNewExcludeWord] = useState('');
  const [showExcludeWordInput, setShowExcludeWordInput] = useState(false);

  const { advancedFilters, data } = state;

  // 検索プレビューテキスト
  const previewText = state.ui.searchQuery
    ? buildSearchQueryPreview(state.ui.searchQuery, advancedFilters)
    : '';

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">高度な検索フィルタ</h3>
        <button
          onClick={() => actions.resetAdvancedFilters()}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
        >
          リセット
        </button>
      </div>

      {/* プリセット検索 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          プリセット検索
        </label>
        <div className="grid grid-cols-2 gap-2">
          {searchPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => actions.applySearchPreset(preset)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors text-left"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 日付範囲フィルタ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          投稿期間
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => actions.setDateRangePreset('today')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.dateRange.preset === 'today'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => actions.setDateRangePreset('yesterday')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.dateRange.preset === 'yesterday'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            昨日
          </button>
          <button
            onClick={() => actions.setDateRangePreset('last7days')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.dateRange.preset === 'last7days'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            過去7日間
          </button>
          <button
            onClick={() => actions.setDateRangePreset('last30days')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.dateRange.preset === 'last30days'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            過去30日間
          </button>
        </div>
      </div>

      {/* メディアフィルタ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メディアタイプ
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => actions.setMediaFilter('all')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.mediaFilter === 'all'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => actions.setMediaFilter('images')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.mediaFilter === 'images'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            画像のみ
          </button>
          <button
            onClick={() => actions.setMediaFilter('videos')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.mediaFilter === 'videos'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            動画のみ
          </button>
          <button
            onClick={() => actions.setMediaFilter('media')}
            className={`px-3 py-2 text-sm rounded border ${
              advancedFilters.mediaFilter === 'media'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            画像・動画
          </button>
        </div>
      </div>

      {/* イラストタグ */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={advancedFilters.includeIllustTag}
            onChange={(e) => actions.setIncludeIllustTag(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">#イラスト タグを含める</span>
        </label>
      </div>

      {/* 除外ワード */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={advancedFilters.excludeWords.enabled}
              onChange={(e) => actions.setExcludeWordsEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">除外ワードフィルタ</span>
          </label>
          <button
            onClick={() => setShowExcludeWordInput(!showExcludeWordInput)}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
          >
            {showExcludeWordInput ? '閉じる' : '+ 追加'}
          </button>
        </div>

        {showExcludeWordInput && (
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={newExcludeWord}
              onChange={(e) => setNewExcludeWord(e.target.value)}
              placeholder="除外したいワードを入力"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newExcludeWord.trim()) {
                  actions.addExcludeWord(newExcludeWord.trim());
                  setNewExcludeWord('');
                }
              }}
            />
            <button
              onClick={() => {
                if (newExcludeWord.trim()) {
                  actions.addExcludeWord(newExcludeWord.trim());
                  setNewExcludeWord('');
                }
              }}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              追加
            </button>
          </div>
        )}

        {data.excludeWords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.excludeWords.map((word) => {
              const isSelected = advancedFilters.excludeWords.selectedWords.some(
                (w) => w.id === word.id
              );
              return (
                <div
                  key={word.id}
                  className={`inline-flex items-center px-3 py-1 text-sm rounded border ${
                    isSelected
                      ? 'bg-red-100 border-red-300 text-red-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => actions.toggleExcludeWord(word)}
                      className="w-3 h-3"
                    />
                    <span>{word.word}</span>
                  </label>
                  <button
                    onClick={() => actions.removeExcludeWord(word.id)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 検索プレビュー */}
      {previewText && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">検索クエリプレビュー:</p>
          <p className="text-sm text-gray-800 font-mono break-all">{previewText}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;
