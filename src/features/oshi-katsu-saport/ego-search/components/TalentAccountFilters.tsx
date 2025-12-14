import React, { useState, useRef, useEffect } from 'react';
import { EgoSearchState, EgoSearchActions, Talent } from '../hooks/useEgoSearchState';
import { TalentAccount } from '../types';
import { getTalentAccount } from '../utils/talentAccountsStorage';

interface TalentAccountFiltersProps {
  state: EgoSearchState;
  actions: EgoSearchActions;
}

export const TalentAccountFilters: React.FC<TalentAccountFiltersProps> = ({ state, actions }) => {
  const [showAccountInput, setShowAccountInput] = useState(false);
  const [editingTalentId, setEditingTalentId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>(['robocosan', 'maybe_robochan']);
  const [newAccountInput, setNewAccountInput] = useState('');
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const { filters, data } = state;

  // フィルタリングされたタレントリスト
  const filteredTalents = data.talents.filter((talent: Talent) =>
    talent.talentNameJoin.toLowerCase().includes(talentSearchQuery.toLowerCase())
  );

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // アカウントを追加
  const handleAddAccount = () => {
    const trimmedAccount = newAccountInput.replace('@', '').trim();
    if (trimmedAccount && !accounts.includes(trimmedAccount)) {
      setAccounts([...accounts, trimmedAccount]);
      setNewAccountInput('');
    }
  };

  // アカウントを削除
  const handleRemoveAccount = (accountToRemove: string) => {
    setAccounts(accounts.filter(acc => acc !== accountToRemove));
  };

  // タレントアカウント設定を保存
  const handleSaveTalentAccount = (talentId: string, talentName: string) => {
    if (accounts.length === 0) {
      alert('最低1つのアカウントを入力してください');
      return;
    }

    actions.saveTalentAccountInfo(talentId, talentName, accounts);

    setEditingTalentId(null);
    setAccounts(['robocosan', 'maybe_robochan']);
    setNewAccountInput('');
    setShowAccountInput(false);
  };

  // タレント選択時にアカウント情報を取得
  const handleToggleTalent = (talent: Talent) => {
    const savedAccount = getTalentAccount(talent.id);
    if (!savedAccount || savedAccount.accounts.length === 0) {
      // アカウント情報が未設定の場合、入力を促す
      setEditingTalentId(talent.id);
      setShowAccountInput(true);
      const existingAccount = getTalentAccount(talent.id);
      // デフォルトアカウントを設定
      setAccounts(existingAccount && existingAccount.accounts.length > 0 ? existingAccount.accounts : ['robocosan', 'maybe_robochan']);
      setNewAccountInput('');
      return;
    }

    actions.toggleTalentAccount(savedAccount);
    setTalentSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8 animate-fade-in overflow-visible relative z-[10000]" style={{ animationDelay: '0.3s' }}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg overflow-visible">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">タレント選択</h3>
          <p className="text-xs text-gray-500">
            タレントを選択してアカウント情報を設定できます
          </p>
        </div>

        {/* タレント選択コンボボックス */}
        <div className="mb-3">
          <label htmlFor="talent-combobox" className="block text-sm font-semibold text-gray-700 mb-3">
            タレントを選択
          </label>
          <div className="relative" ref={comboboxRef}>
            <input
              id="talent-combobox"
              type="text"
              value={talentSearchQuery}
              onChange={(e) => {
                setTalentSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="タレント名を入力して検索..."
              className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 focus:border-[#1DA1F2] focus:outline-none rounded-xl text-gray-800 transition-all duration-200"
            />
            {/* 検索アイコン */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* ドロップダウンリスト */}
            {isDropdownOpen && filteredTalents.length > 0 && (
              <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredTalents.slice(0, 10).map((talent) => {
                  const savedAccount = getTalentAccount(talent.id);
                  const isSelected = filters.talentAccounts.selectedAccounts.some(
                    (acc) => acc.talentId === talent.id
                  );

                  return (
                    <div
                      key={talent.id}
                      onClick={() => handleToggleTalent(talent)}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#1DA1F2] text-white'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{talent.talentNameJoin}</div>
                          {savedAccount && savedAccount.accounts.length > 0 && (
                            <div className={`text-xs mt-1 ${isSelected ? 'opacity-90' : 'text-gray-500'}`}>
                              {savedAccount.accounts.map(acc => `@${acc}`).join(', ')}
                            </div>
                          )}
                        </div>
                        {(!savedAccount || savedAccount.accounts.length === 0) && (
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">
                            未設定
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 結果が見つからない場合 */}
            {isDropdownOpen && talentSearchQuery && filteredTalents.length === 0 && (
              <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500">
                該当するタレントが見つかりません
              </div>
            )}
          </div>
        </div>

        {/* アカウント設定入力 */}
        {showAccountInput && editingTalentId && (
          <div className="mb-3 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 font-semibold mb-3">
              {data.talents.find((t) => t.id === editingTalentId)?.talentName} のTwitterアカウント名
            </p>

            {/* 登録済みアカウント一覧 */}
            {accounts.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-600 block mb-2">登録済みアカウント</label>
                <div className="space-y-1">
                  {accounts.map((account, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-300">
                      <span className="text-gray-500">@</span>
                      <span className="flex-1 text-sm text-gray-800">{account}</span>
                      <button
                        onClick={() => handleRemoveAccount(account)}
                        className="text-red-600 hover:text-red-700 text-xs px-2 py-1"
                        title="削除"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新しいアカウント追加 */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">アカウントを追加</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                  <span className="px-2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={newAccountInput}
                    onChange={(e) => setNewAccountInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAccount();
                      }
                    }}
                    placeholder="アカウント名"
                    className="flex-1 px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleAddAccount}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  追加
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  const talent = data.talents.find((t) => t.id === editingTalentId);
                  if (talent) {
                    handleSaveTalentAccount(talent.id, talent.talentName);
                  }
                }}
                className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setShowAccountInput(false);
                  setEditingTalentId(null);
                  setAccounts(['robocosan', 'maybe_robochan']);
                  setNewAccountInput('');
                }}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* 選択中のアカウント */}
        {filters.talentAccounts.selectedAccounts.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold">選択中のタレント:</p>
            <div className="flex flex-wrap gap-2">
              {filters.talentAccounts.selectedAccounts.map((account) => (
                <div
                  key={account.talentId}
                  className="inline-flex items-center px-3 py-2 text-sm bg-white border border-blue-300 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{account.talentName}</div>
                    <div className="text-xs text-gray-600">
                      {account.accounts.map(acc => `@${acc}`).join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => actions.toggleTalentAccount(account)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タレントアカウントで絞り込みチェックボックス */}
        {filters.talentAccounts.selectedAccounts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.talentAccounts.enabled}
                onChange={(e) => actions.setTalentAccountsEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">選択したタレントアカウントで絞り込む</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              チェックすると、選択したタレントの投稿のみを検索します（メイン・サブアカウント両方）
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
