import React from 'react';
import { Talent } from '../hooks/useHashtagSearchState';
import { TalentSelectField } from 'components/organisms/TalentSelectField';

interface TalentSelectorProps {
  talents: Talent[];
  selectedTalent: Talent | null;
  searchQuery: string;
  /** タレント選択モーダルの開閉状態 */
  isDropdownOpen: boolean;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: Talent) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  onReset: () => void;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  talents,
  selectedTalent,
  searchQuery,
  isDropdownOpen,
  onSearchQueryChange,
  onTalentSelect,
  onDropdownOpenChange,
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
  />
);
