import React, { useState } from 'react';
import { EgoSearchState, EgoSearchActions } from '../hooks/useEgoSearchState';
import { EgoSearchHeader } from '../components/EgoSearchHeader';
import { SearchKeywordInput } from '../components/SearchKeywordInput';
import { KeywordPresetsSelector } from '../components/KeywordPresetsSelector';
import { TalentSelector } from '../components/TalentSelector';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { HelpModal } from '../components/HelpModal';
import { buildSearchQueryPreview } from '../utils/buildTwitterSearchUrl';

interface EgoSearchPresenterProps {
  state: EgoSearchState;
  actions: EgoSearchActions;
}

export const EgoSearchPresenter: React.FC<EgoSearchPresenterProps> = ({
  state,
  actions,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleBackToHome = () => {
    window.location.href = '/';
  };
  // 検索プレビューテキスト
  const searchQueryPreview = buildSearchQueryPreview(state.filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative pb-32">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-blue-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* ヘッダー */}
        <EgoSearchHeader
          onBackToHome={handleBackToHome}
          onHelpClick={() => actions.setIsHelpModalOpen(true)}
        />

        {/* タレント選択 */}
        <TalentSelector
          talents={state.data.talents}
          selectedTalent={state.filters.talentAccounts.selectedAccounts.length > 0
            ? state.data.talents.find(t => t.id === state.filters.talentAccounts.selectedAccounts[0].talentId) || null
            : null
          }
          searchQuery={state.ui.talentSearchQuery}
          isDropdownOpen={state.ui.isDropdownOpen}
          enabled={state.filters.talentAccounts.enabled}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={(talent) => {
            actions.selectTalent(talent);
          }}
          onDropdownOpenChange={actions.setIsDropdownOpen}
          onEnabledChange={actions.setTalentAccountsEnabled}
          onReset={() => {
            actions.resetTalentSelection();
          }}
        />

        {/* 検索プリセット */}
        {state.filters.talentAccounts.selectedAccounts.length > 0 && (
          <KeywordPresetsSelector
            onPresetsSelect={actions.appendKeywordsFromPresets}
            onTalentKeywordsChange={actions.setTalentKeywordsByCategory}
            selectedTalent={state.data.talents.find(t => t.id === state.filters.talentAccounts.selectedAccounts[0].talentId) || null}
          />
        )}

        {/* 検索キーワード入力 */}
        <SearchKeywordInput
          values={state.filters.searchKeywords}
          onChange={actions.setSearchKeywords}
          onSearch={actions.handleSearchOnTwitter}
        />

        {/* 高度な検索フィルタ */}
        <AdvancedFilters
          state={state}
          actions={actions}
        />
      </div>

      {!state.ui.isDropdownOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className={`w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-lg hover:shadow-xl`}
              >
                検索内容を確認
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">検索内容の確認</h3>
            <div className="text-sm text-gray-600 mb-5">
              <p className="mb-3 text-gray-700">以下の検索クエリでXの検索画面を開きます。</p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-1">検索クエリ</p>
                <p className="text-sm text-gray-800 font-mono break-all whitespace-pre-wrap">
                  {searchQueryPreview || '—'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  actions.handleSearchOnTwitter();
                  setIsConfirmModalOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#0d8bd9]"
              >
                Xで検索する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ヘルプモーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default EgoSearchPresenter;
