import React, { useMemo } from 'react';
import { Talent } from '../hooks/useHashtagSearchState';
import { TalentSelectionModal } from 'features/talent-music/components/TalentSelectionModal';
import { MusicTalent, MusicTalentGroup } from 'features/talent-music/types';

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

const toMusicTalent = (talent: Talent): MusicTalent => ({
  id: talent.id,
  talentName: talent.talentName,
  talentNameEn: talent.talentNameEn,
  talentSlug: talent.talentSlug,
  talentNameJoin: talent.talentNameJoin,
  groupName: talent.groupName,
  groupId: talent.groupId,
  iconImgUrl: talent.iconImgUrl,
});

/** フラットなタレント一覧をグループ別に変換（楽曲一覧モーダルの表示用） */
const buildGroups = (talents: Talent[]): MusicTalentGroup[] => {
  const map = new Map<number, MusicTalentGroup>();
  for (const talent of talents) {
    let group = map.get(talent.groupId);
    if (!group) {
      group = {
        groupId: talent.groupId,
        groupName: talent.groupName || 'その他',
        groupNameEn: '',
        talents: [],
      };
      map.set(talent.groupId, group);
    }
    group.talents.push(toMusicTalent(talent));
  }
  return Array.from(map.values());
};

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  talents,
  selectedTalent,
  searchQuery,
  isDropdownOpen,
  onSearchQueryChange,
  onTalentSelect,
  onDropdownOpenChange,
  onReset,
}) => {
  const groups = useMemo(() => buildGroups(talents), [talents]);
  const modalTalents = useMemo(() => talents.map(toMusicTalent), [talents]);

  const handleModalTalentSelect = (musicTalent: MusicTalent) => {
    const talent = talents.find((t) => t.id === musicTalent.id);
    if (talent) {
      onTalentSelect(talent);
    }
  };

  const handleModalClose = () => {
    onDropdownOpenChange(false);
    onSearchQueryChange('');
  };

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          タレントを選択
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[12rem] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm truncate">
            {selectedTalent ? (
              <span className="font-medium text-gray-800">{selectedTalent.talentNameJoin}</span>
            ) : (
              <span className="text-gray-400">タレントを選択してください</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDropdownOpenChange(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white rounded-xl font-medium hover:from-[#0d8bd9] hover:to-[#1DA1F2] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>タレント選択</span>
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            選択中:{' '}
            <span className="font-semibold text-gray-900">
              {selectedTalent?.talentNameJoin ?? '未選択'}
            </span>
          </p>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 transition-colors"
          >
            選択をリセット
          </button>
        </div>
      </div>

      {/* タレント選択モーダル（楽曲一覧と共通） */}
      <TalentSelectionModal
        isOpen={isDropdownOpen}
        talents={modalTalents}
        groups={groups}
        selectedTalent={selectedTalent ? toMusicTalent(selectedTalent) : null}
        searchQuery={searchQuery}
        title="タレント選択"
        onSearchQueryChange={onSearchQueryChange}
        onTalentSelect={handleModalTalentSelect}
        onClose={handleModalClose}
      />
    </section>
  );
};
