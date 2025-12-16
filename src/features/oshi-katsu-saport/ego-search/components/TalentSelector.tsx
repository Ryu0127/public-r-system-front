import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EgoSearchState, EgoSearchActions } from '../hooks/useEgoSearchState';
import { TalentAccount } from '../types';

interface TalentSelectorProps {
  state: EgoSearchState;
  actions: EgoSearchActions;
}

/**
 * タレント選択コンポーネント
 * グループセレクトボックスとタレントコンボボックスで1人のタレントを選択
 */
export const TalentSelector: React.FC<TalentSelectorProps> = ({ state, actions }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  // グループ一覧を取得
  const groups = useMemo(() => {
    const groupMap = new Map<number, { id: number; name: string }>();
    state.data.talents.forEach(talent => {
      if (!groupMap.has(talent.groupId)) {
        groupMap.set(talent.groupId, {
          id: talent.groupId,
          name: talent.groupName,
        });
      }
    });
    return Array.from(groupMap.values()).sort((a, b) => a.id - b.id);
  }, [state.data.talents]);

  // 選択されたグループでフィルタリングされたタレント一覧
  const filteredTalents = useMemo(() => {
    let talents = state.data.talents;

    // グループでフィルタ
    if (selectedGroupId !== null) {
      talents = talents.filter(t => t.groupId === selectedGroupId);
    }

    // 検索クエリでフィルタ
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      talents = talents.filter(t =>
        t.talentName.toLowerCase().includes(query) ||
        t.talentNameEn.toLowerCase().includes(query)
      );
    }

    return talents;
  }, [state.data.talents, selectedGroupId, searchQuery]);

  // 現在選択されているタレント
  const selectedTalent = useMemo(() => {
    if (state.filters.talentAccounts.selectedAccounts.length === 0) {
      return null;
    }
    const selectedAccount = state.filters.talentAccounts.selectedAccounts[0];
    return state.data.talents.find(t => t.id === selectedAccount.talentId) || null;
  }, [state.filters.talentAccounts.selectedAccounts, state.data.talents]);

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // タレント選択
  const handleSelectTalent = (talent: typeof state.data.talents[0]) => {
    const talentAccount: TalentAccount = {
      talentId: talent.id,
      talentName: talent.talentName,
      accounts: talent.twitterAccounts,
    };

    // 既に選択されている場合は選択解除、そうでなければ選択
    if (selectedTalent?.id === talent.id) {
      actions.toggleTalentAccount(talentAccount);
    } else {
      // 既存の選択を解除してから新しいタレントを選択
      if (state.filters.talentAccounts.selectedAccounts.length > 0) {
        actions.toggleTalentAccount(state.filters.talentAccounts.selectedAccounts[0]);
      }
      actions.toggleTalentAccount(talentAccount);
    }

    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  // グループ変更時の処理
  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = e.target.value === '' ? null : parseInt(e.target.value);
    setSelectedGroupId(groupId);
    setSearchQuery('');
  };

  if (state.config.isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">タレント情報を読み込み中...</span>
        </div>
      </div>
    );
  }

  if (state.data.talents.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-center py-8 text-gray-500">
          タレント情報が見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-sky-400 rounded-full" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          タレント選択
        </h2>
      </div>

      {/* 説明 */}
      <p className="text-sm text-gray-600">
        タレントを選択すると、そのタレントのTwitterアカウント投稿のみを検索対象にできます。
      </p>

      {/* グループとタレント選択 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* グループセレクトボックス */}
        <div>
          <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-2">
            グループ
          </label>
          <select
            id="group-select"
            value={selectedGroupId === null ? '' : selectedGroupId}
            onChange={handleGroupChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
          >
            <option value="">すべてのグループ</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* タレントコンボボックス */}
        <div>
          <label htmlFor="talent-combobox" className="block text-sm font-medium text-gray-700 mb-2">
            タレント
          </label>
          <div className="relative" ref={comboboxRef}>
            <input
              id="talent-combobox"
              type="text"
              value={searchQuery || (selectedTalent ? selectedTalent.talentNameJoin : '')}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="タレント名を入力または選択..."
              className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
            />
            {/* ドロップダウンアイコン */}
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* ドロップダウンリスト */}
            {isDropdownOpen && filteredTalents.length > 0 && (
              <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredTalents.map((talent) => {
                  const isSelected = selectedTalent?.id === talent.id;

                  return (
                    <div
                      key={talent.id}
                      onClick={() => handleSelectTalent(talent)}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{talent.talentName}</div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {talent.talentNameEn}
                      </div>
                      {/* Twitterアカウント */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {talent.twitterAccounts.map((account, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              isSelected
                                ? 'bg-blue-400 text-white'
                                : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            @{account}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 結果が見つからない場合 */}
            {isDropdownOpen && searchQuery && filteredTalents.length === 0 && (
              <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500">
                該当するタレントが見つかりません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 絞り込み有効化チェックボックス */}
      {selectedTalent && (
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            id="enable-talent-filter"
            checked={state.filters.talentAccounts.enabled}
            onChange={(e) => actions.setTalentAccountsEnabled(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
          />
          <div className="flex-1">
            <label htmlFor="enable-talent-filter" className="text-sm font-semibold text-gray-800 cursor-pointer">
              選択したタレントで絞り込む
            </label>
            <p className="text-xs text-gray-600 mt-1">
              {selectedTalent.talentName}のTwitter投稿（
              {selectedTalent.twitterAccounts.map(acc => `@${acc}`).join('、')}
              ）のみを検索します
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentSelector;
