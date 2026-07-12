import React, { useEffect, useMemo } from 'react';
import TalentAvatar from 'components/atoms/TalentAvatar';

/** タレント選択モーダルで扱う最小限のタレント情報 */
export interface PickerTalent {
  id: string;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
  iconImgUrl?: string;
}

/** タレント選択モーダルで扱うグループ情報 */
export interface PickerTalentGroup<T extends PickerTalent = PickerTalent> {
  groupId: number;
  groupName: string;
  groupNameEn: string;
  talents: T[];
}

/**
 * フラットなタレント一覧を groupId ごとのグループ一覧に変換する
 * （グループ情報を持たないAPIレスポンスをモーダルのグループ別表示に使うためのヘルパー）
 */
export function buildTalentGroups<
  T extends PickerTalent & { groupId: number; groupName: string }
>(talents: T[]): PickerTalentGroup<T>[] {
  const map = new Map<number, PickerTalentGroup<T>>();
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
    group.talents.push(talent);
  }
  return Array.from(map.values());
}

interface TalentSelectionModalProps<T extends PickerTalent, G extends PickerTalentGroup<T>> {
  isOpen: boolean;
  /** グループ情報なしのフラットリスト（groups が空のときに使用） */
  talents: T[];
  /** グループ一覧。存在する場合はグループ別表示に使用 */
  groups: G[];
  selectedTalent: T | null;
  searchQuery: string;
  /** モーダルタイトル（デフォルト: タレント・グループ選択） */
  title?: string;
  onSearchQueryChange: (query: string) => void;
  onTalentSelect: (talent: T) => void;
  /** 未指定の場合は「グループを選択」ボタンを表示しない */
  onGroupSelect?: (group: G) => void;
  onClose: () => void;
}

/**
 * タレント選択モーダル（検索絞り込み・グループ別表示・アイコングリッド）
 */
export function TalentSelectionModal<T extends PickerTalent, G extends PickerTalentGroup<T>>({
  isOpen,
  talents,
  groups,
  selectedTalent,
  searchQuery,
  title = 'タレント・グループ選択',
  onSearchQueryChange,
  onTalentSelect,
  onGroupSelect,
  onClose,
}: TalentSelectionModalProps<T, G>) {
  // groups がある場合は groups を検索フィルタリングして使用、なければ talents をフラット表示
  // グループ名にマッチ → グループ内の全タレントを表示
  // タレント名にマッチ → マッチしたタレントのみ表示
  const filteredGroups = useMemo(() => {
    if (groups.length === 0) return [];
    const q = searchQuery.toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => {
        const groupMatches =
          g.groupName.toLowerCase().includes(q) ||
          g.groupNameEn.toLowerCase().includes(q);
        return {
          ...g,
          talents: groupMatches
            ? g.talents
            : g.talents.filter((t) => t.talentNameJoin.toLowerCase().includes(q)),
        };
      })
      .filter((g) => g.talents.length > 0);
  }, [groups, searchQuery]);

  const filteredTalents = useMemo(() => {
    if (groups.length > 0) return [];
    return talents.filter((t) =>
      t.talentNameJoin.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups.length, talents, searchQuery]);

  const hasNoResults =
    groups.length > 0 ? filteredGroups.length === 0 : filteredTalents.length === 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderTalentCard = (talent: T, index: number) => {
    const isSelected = talent.id === selectedTalent?.id;

    return (
      <button
        key={`${talent.id}-${index}`}
        onClick={() => onTalentSelect(talent)}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center group cursor-pointer
          ${isSelected ? 'bg-red-50 ring-2 ring-red-400' : 'hover:bg-gray-50'}`}
      >
        <TalentAvatar
          id={talent.id}
          name={talent.talentName}
          iconImgUrl={talent.iconImgUrl}
          sizeClass="w-28 h-28"
          initialTextClass="text-2xl"
        />

        {/* 名前 */}
        <div className="w-full">
          <p className={`text-xs font-semibold leading-snug break-words ${isSelected ? 'text-red-600' : 'text-gray-800'}`}>
            {talent.talentName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 leading-snug break-words">
            {talent.talentNameEn}
          </p>
        </div>

        {/* 選択中バッジ */}
        {isSelected && (
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
            選択中
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* ヘッダー */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 検索コンボボックス */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="タレント名もしくはグループ名を入力して絞り込み..."
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 focus:border-red-400 focus:outline-none focus:bg-white rounded-xl text-gray-800 transition-all duration-200 text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* タレント一覧 */}
        <div className="overflow-y-auto flex-1 p-6">
          {hasNoResults ? (
            /* 検索結果なし */
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">該当するタレントが見つかりません</p>
            </div>
          ) : groups.length > 0 ? (
            /* グループ別表示 */
            <div className="space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.groupId}>
                  {/* グループヘッダー */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gray-700">{group.groupName}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                    {onGroupSelect && (
                      <button
                        onClick={() => onGroupSelect(group as G)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors whitespace-nowrap"
                      >
                        グループを選択
                      </button>
                    )}
                  </div>
                  {/* タレントグリッド */}
                  <div className="grid grid-cols-3 gap-3">
                    {group.talents.map((talent, index) => renderTalentCard(talent, index))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* フラット表示（groups が空のとき） */
            <div className="grid grid-cols-3 gap-3">
              {filteredTalents.map((talent, index) => renderTalentCard(talent, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
