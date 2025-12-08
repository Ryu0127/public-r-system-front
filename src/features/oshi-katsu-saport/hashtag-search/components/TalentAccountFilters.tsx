import React, { useState } from 'react';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { TalentAccount } from '../types/advancedSearchFilters';
import { saveTalentAccount, getTalentAccount } from '../utils/talentAccountsStorage';

interface TalentAccountFiltersProps {
  state: HashtagSearchState;
  actions: HashtagSearchActions;
}

/**
 * タレントアカウントフィルタコンポーネント
 */
const TalentAccountFilters: React.FC<TalentAccountFiltersProps> = ({ state, actions }) => {
  const [showAccountInput, setShowAccountInput] = useState(false);
  const [editingTalentId, setEditingTalentId] = useState<string | null>(null);
  const [twitterHandle, setTwitterHandle] = useState('');

  const { advancedFilters, data } = state;

  // タレントアカウント設定
  const handleSaveTalentAccount = (talentId: string, talentName: string) => {
    if (!twitterHandle.trim()) {
      alert('Twitterアカウント名を入力してください');
      return;
    }

    const account: TalentAccount = {
      talentId,
      talentName,
      twitterHandle: twitterHandle.replace('@', '').trim(),
    };

    saveTalentAccount(account);
    setEditingTalentId(null);
    setTwitterHandle('');
    setShowAccountInput(false);
  };

  // タレント選択時にアカウント情報を取得
  const handleToggleTalent = (talent: any) => {
    const savedAccount = getTalentAccount(talent.id);
    if (!savedAccount) {
      // アカウント情報が未設定の場合、入力を促す
      setEditingTalentId(talent.id);
      setShowAccountInput(true);
      return;
    }

    actions.toggleTalentAccount(savedAccount);
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={advancedFilters.talentAccounts.enabled}
            onChange={(e) => actions.setTalentAccountsEnabled(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">タレントアカウント検索</span>
        </label>
      </div>

      {advancedFilters.talentAccounts.enabled && (
        <>
          {/* 検索タイプ選択 */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-2">検索タイプ</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => actions.setTalentAccountSearchType('from')}
                className={`px-3 py-2 text-sm rounded border ${
                  advancedFilters.talentAccounts.searchType === 'from'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="このアカウントからの投稿を検索"
              >
                投稿
              </button>
              <button
                onClick={() => actions.setTalentAccountSearchType('to')}
                className={`px-3 py-2 text-sm rounded border ${
                  advancedFilters.talentAccounts.searchType === 'to'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="このアカウントへのリプライを検索"
              >
                リプライ
              </button>
              <button
                onClick={() => actions.setTalentAccountSearchType('mentions')}
                className={`px-3 py-2 text-sm rounded border ${
                  advancedFilters.talentAccounts.searchType === 'mentions'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title="選択したアカウント同士のやりとりを検索"
              >
                やりとり
              </button>
            </div>
          </div>

          {/* タレント選択 */}
          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-2">
              タレント選択
              {advancedFilters.talentAccounts.searchType === 'mentions' && (
                <span className="ml-1 text-blue-600">(複数選択可)</span>
              )}
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded bg-white">
              {data.talents.map((talent) => {
                const savedAccount = getTalentAccount(talent.id);
                const isSelected = advancedFilters.talentAccounts.selectedAccounts.some(
                  (acc) => acc.talentId === talent.id
                );

                return (
                  <div
                    key={talent.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <label className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTalent(talent)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{talent.talentName}</span>
                      {savedAccount && (
                        <span className="text-xs text-gray-500">@{savedAccount.twitterHandle}</span>
                      )}
                    </label>
                    {!savedAccount && (
                      <button
                        onClick={() => {
                          setEditingTalentId(talent.id);
                          setShowAccountInput(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        設定
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* アカウント設定入力 */}
          {showAccountInput && editingTalentId && (
            <div className="mb-3 p-3 bg-white rounded border border-blue-300">
              <p className="text-sm text-gray-700 mb-2">
                {data.talents.find((t) => t.id === editingTalentId)?.talentName} のTwitterアカウント名
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="アカウント名"
                    className="flex-1 px-2 py-2 text-sm focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const talent = data.talents.find((t) => t.id === editingTalentId);
                        if (talent) {
                          handleSaveTalentAccount(talent.id, talent.talentName);
                        }
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    const talent = data.talents.find((t) => t.id === editingTalentId);
                    if (talent) {
                      handleSaveTalentAccount(talent.id, talent.talentName);
                    }
                  }}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowAccountInput(false);
                    setEditingTalentId(null);
                    setTwitterHandle('');
                  }}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 選択中のアカウント */}
          {advancedFilters.talentAccounts.selectedAccounts.length > 0 && (
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <p className="text-xs text-gray-600 mb-1">選択中:</p>
              <div className="flex flex-wrap gap-1">
                {advancedFilters.talentAccounts.selectedAccounts.map((account) => (
                  <span
                    key={account.talentId}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    @{account.twitterHandle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TalentAccountFilters;
