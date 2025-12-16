import React, { useMemo } from 'react';
import { EgoSearchState, EgoSearchActions } from '../hooks/useEgoSearchState';
import { TalentAccount } from '../types';

interface TalentSelectorProps {
  state: EgoSearchState;
  actions: EgoSearchActions;
}

/**
 * タレント選択コンポーネント
 * タレント一覧をグループごとに表示し、選択したタレントをフィルタに追加する
 */
export const TalentSelector: React.FC<TalentSelectorProps> = ({ state, actions }) => {
  // グループごとにタレントを分類
  const talentsByGroup = useMemo(() => {
    const grouped = new Map<string, typeof state.data.talents>();

    state.data.talents.forEach(talent => {
      const groupName = talent.groupName;
      if (!grouped.has(groupName)) {
        grouped.set(groupName, []);
      }
      grouped.get(groupName)?.push(talent);
    });

    return grouped;
  }, [state.data.talents]);

  // タレントが選択されているかチェック
  const isTalentSelected = (talentId: string) => {
    return state.filters.talentAccounts.selectedAccounts.some(
      account => account.talentId === talentId
    );
  };

  // タレント選択の切り替え
  const handleTalentToggle = (talent: typeof state.data.talents[0]) => {
    const talentAccount: TalentAccount = {
      talentId: talent.id,
      talentName: talent.talentName,
      accounts: talent.twitterAccounts,
    };
    actions.toggleTalentAccount(talentAccount);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-sky-400 rounded-full" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            タレント選択
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {state.filters.talentAccounts.selectedAccounts.length}件選択中
        </span>
      </div>

      {/* 説明 */}
      <p className="text-sm text-gray-600">
        検索対象のタレントを選択してください。選択したタレントのTwitterアカウント投稿のみが検索対象となります。
      </p>

      {/* グループ別タレント一覧 */}
      <div className="space-y-6">
        {Array.from(talentsByGroup.entries()).map(([groupName, talents]) => (
          <div key={groupName} className="space-y-3">
            {/* グループ名 */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {groupName.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-700">{groupName}</h3>
              <span className="text-xs text-gray-400">
                ({talents.length}名)
              </span>
            </div>

            {/* タレント一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
              {talents.map(talent => (
                <div
                  key={talent.id}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all cursor-pointer
                    hover:shadow-md
                    ${
                      isTalentSelected(talent.id)
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }
                  `}
                  onClick={() => handleTalentToggle(talent)}
                >
                  <div className="flex items-start gap-3">
                    {/* チェックボックス */}
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={isTalentSelected(talent.id)}
                        onChange={() => handleTalentToggle(talent)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* タレント情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {talent.talentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {talent.talentNameEn}
                      </div>

                      {/* Twitterアカウント */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {talent.twitterAccounts.map((account, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-sky-100 text-sky-700 text-xs font-medium"
                          >
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            @{account}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 選択状況 */}
      {state.filters.talentAccounts.selectedAccounts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">選択中のタレント:</div>
          <div className="flex flex-wrap gap-2">
            {state.filters.talentAccounts.selectedAccounts.map(account => (
              <div
                key={account.talentId}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-sm"
              >
                <span className="font-medium">{account.talentName}</span>
                <button
                  onClick={() => actions.toggleTalentAccount(account)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`${account.talentName}の選択を解除`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentSelector;
