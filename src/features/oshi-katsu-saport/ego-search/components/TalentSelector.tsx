import React from 'react';
import { Talent } from '../hooks/useEgoSearchState';
import { TalentSelectField } from 'components/organisms/TalentSelectField';

interface TalentSelectorProps {
  talents: Talent[];
  selectedTalent: Talent | null;
  searchQuery: string;
  /** タレント選択モーダルの開閉状態 */
  isDropdownOpen: boolean;
  enabled: boolean;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: Talent) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  onEnabledChange: (enabled: boolean) => void;
  onReset: () => void;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  talents,
  selectedTalent,
  searchQuery,
  isDropdownOpen,
  enabled,
  onSearchQueryChange,
  onTalentSelect,
  onDropdownOpenChange,
  onEnabledChange,
  onReset,
}) => (
  <TalentSelectField
    talents={talents}
    selectedTalent={selectedTalent}
    searchQuery={searchQuery}
    isOpen={isDropdownOpen}
    onSearchQueryChange={onSearchQueryChange}
    onSelect={onTalentSelect}
    onOpenChange={onDropdownOpenChange}
    onReset={onReset}
  >
    {/* 絞り込み有効化チェックボックス */}
    {selectedTalent && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">選択したタレントの投稿のみで絞り込む</span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          {selectedTalent.talentName}の投稿（
          {selectedTalent.twitterAccounts.map(acc => `@${acc}`).join('、')}
          ）のみで絞り込む
        </p>
      </div>
    )}
  </TalentSelectField>
);

export default TalentSelector;
