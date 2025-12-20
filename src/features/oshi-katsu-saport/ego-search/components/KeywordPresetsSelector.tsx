import React, { useState, useEffect } from 'react';
import { KeywordPreset, keywordPresets } from '../types';
import { Talent } from '../hooks/useEgoSearchState';

interface KeywordPresetsSelectorProps {
  onPresetsSelect: (keywords: string[]) => void;
  selectedTalent?: Talent | null;
  disabled?: boolean;
}

export const KeywordPresetsSelector: React.FC<KeywordPresetsSelectorProps> = ({
  onPresetsSelect,
  selectedTalent,
  disabled = false,
}) => {
  const [selectedPresetIds, setSelectedPresetIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  // タレント変更時に選択をクリア
  useEffect(() => {
    setSelectedPresetIds(new Set());
    onPresetsSelect([]);
  }, [selectedTalent?.id]);

  // タレントが選択されている場合はそのタレントの検索ワードを使用、そうでない場合は固定プリセット
  const presetsToUse: KeywordPreset[] = selectedTalent?.searchWorks
    ? selectedTalent.searchWorks.flatMap((group, groupIndex) =>
        group.keywords.map((keyword, keywordIndex) => ({
          id: `${selectedTalent.id}-${groupIndex}-${keywordIndex}`,
          label: keyword,
          keyword: keyword,
          category: group.gropuName, // API has typo "gropu"
        }))
      )
    : keywordPresets;

  // カテゴリごとにプリセットをグループ化
  const presetsByCategory = presetsToUse.reduce((acc, preset) => {
    const category = preset.category || 'その他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(preset);
    return acc;
  }, {} as Record<string, KeywordPreset[]>);

  const categories = Object.keys(presetsByCategory);

  // プリセット選択/解除
  const handleTogglePreset = (presetId: string) => {
    const newSelected = new Set(selectedPresetIds);
    if (newSelected.has(presetId)) {
      newSelected.delete(presetId);
    } else {
      newSelected.add(presetId);
    }
    setSelectedPresetIds(newSelected);

    // 選択されたプリセットのキーワードを抽出
    const selectedKeywords = presetsToUse
      .filter((preset) => newSelected.has(preset.id))
      .map((preset) => preset.keyword);

    onPresetsSelect(selectedKeywords);
  };

  // すべてクリア
  const handleClearAll = () => {
    setSelectedPresetIds(new Set());
    onPresetsSelect([]);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">タレント別検索ワード</h3>
            <p className="text-xs text-gray-500 mt-1">
              タレント別に関連するキーワードを選択して、検索ワードに追加できます
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isExpanded ? '閉じる' : '開く'}
          </button>
        </div>

        {/* 選択中のプリセット数表示 */}
        {selectedPresetIds.size > 0 && (
          <div className="mb-3 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-blue-600">{selectedPresetIds.size}</span> 個のキーワードを選択中
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              すべてクリア
            </button>
          </div>
        )}

        {/* プリセット一覧 */}
        {isExpanded && (
          <div className="space-y-4 mt-4">
            {categories.map((category) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <h4 className="text-xs font-semibold text-gray-600 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {presetsByCategory[category].map((preset) => {
                    const isSelected = selectedPresetIds.has(preset.id);
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleTogglePreset(preset.id)}
                        disabled={disabled}
                        className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 border-2 ${
                          isSelected
                            ? 'bg-[#1DA1F2] text-white border-[#1DA1F2] shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        } ${
                          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {isSelected && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
