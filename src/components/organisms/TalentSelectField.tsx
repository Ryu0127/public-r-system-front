import React, { useMemo } from 'react';
import SectionCard from 'components/atoms/SectionCard';
import {
  TalentSelectionModal,
  PickerTalent,
  buildTalentGroups,
} from 'components/organisms/TalentSelectionModal';

interface TalentSelectFieldProps<T extends PickerTalent & { groupId: number; groupName: string }> {
  talents: T[];
  selectedTalent: T | null;
  searchQuery: string;
  /** タレント選択モーダルの開閉状態 */
  isOpen: boolean;
  onSearchQueryChange: (query: string) => void;
  onSelect: (talent: T) => void;
  onOpenChange: (isOpen: boolean) => void;
  onReset: () => void;
  /** 選択ボックスの下に表示する追加コンテンツ（例: 絞り込みチェックボックス） */
  children?: React.ReactNode;
}

/**
 * タレント選択フィールド（選択表示ボックス + 選択ボタン + リセット + 選択モーダル）
 * 楽曲一覧のタレント選択と同じ操作感を提供する共通部品
 */
export function TalentSelectField<
  T extends PickerTalent & { groupId: number; groupName: string }
>({
  talents,
  selectedTalent,
  searchQuery,
  isOpen,
  onSearchQueryChange,
  onSelect,
  onOpenChange,
  onReset,
  children,
}: TalentSelectFieldProps<T>) {
  const groups = useMemo(() => buildTalentGroups(talents), [talents]);

  const handleModalClose = () => {
    onOpenChange(false);
    onSearchQueryChange('');
  };

  return (
    <section className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <SectionCard className="p-6">
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
            onClick={() => onOpenChange(true)}
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

        {children}
      </SectionCard>

      {/* タレント選択モーダル（楽曲一覧と共通） */}
      <TalentSelectionModal
        isOpen={isOpen}
        talents={talents}
        groups={groups}
        selectedTalent={selectedTalent}
        searchQuery={searchQuery}
        title="タレント選択"
        onSearchQueryChange={onSearchQueryChange}
        onTalentSelect={onSelect}
        onClose={handleModalClose}
      />
    </section>
  );
}
