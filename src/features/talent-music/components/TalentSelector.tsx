import React from 'react';
import { MusicTalent, MusicTalentGroup } from '../types';
import SectionCard from 'components/atoms/SectionCard';

interface TalentSelectorProps {
  selectedTalent: MusicTalent | null;
  selectedGroup: MusicTalentGroup | null;
  onOpenModal: () => void;
  onReset: () => void;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  selectedTalent,
  selectedGroup,
  onOpenModal,
  onReset,
}) => {
  const selectionLabel = selectedTalent
    ? selectedTalent.talentNameJoin
    : selectedGroup
    ? selectedGroup.groupName
    : null;

  return (
    <section
      className="max-w-2xl mx-auto mb-8 animate-fade-in"
      style={{ animationDelay: '0.1s' }}
    >
      <SectionCard className="p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          タレント・グループを選択
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[12rem] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm truncate">
            {selectionLabel ? (
              <span className="font-medium text-gray-800">{selectionLabel}</span>
            ) : (
              <span className="text-gray-400">タレントもしくはグループを選択してください</span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>タレント・グループ選択</span>
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            選択中:{' '}
            <span className="font-semibold text-gray-900">
              {selectionLabel ?? '未選択'}
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
      </SectionCard>
    </section>
  );
};
