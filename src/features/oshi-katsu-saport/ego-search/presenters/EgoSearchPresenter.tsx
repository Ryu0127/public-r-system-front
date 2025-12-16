import React from 'react';
import { EgoSearchState, EgoSearchActions } from '../hooks/useEgoSearchState';
import { EgoSearchHeader } from '../components/EgoSearchHeader';
import { SearchKeywordInput } from '../components/SearchKeywordInput';
import { KeywordPresetsSelector } from '../components/KeywordPresetsSelector';
import { TalentSelector } from '../components/TalentSelector';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { HelpModal } from '../components/HelpModal';
import { StickyFooter } from '../components/StickyFooter';

interface EgoSearchPresenterProps {
  state: EgoSearchState;
  actions: EgoSearchActions;
}

export const EgoSearchPresenter: React.FC<EgoSearchPresenterProps> = ({
  state,
  actions,
}) => {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

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

        {/* 検索キーワード入力 */}
        <SearchKeywordInput
          values={state.filters.searchKeywords}
          onChange={actions.setSearchKeywords}
          onSearch={actions.handleSearchOnTwitter}
        />

        {/* 検索プリセット */}
        <KeywordPresetsSelector
          onPresetsSelect={actions.appendKeywordsFromPresets}
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
            // 既存の選択を解除してから新しいタレントを選択
            if (state.filters.talentAccounts.selectedAccounts.length > 0) {
              actions.toggleTalentAccount(state.filters.talentAccounts.selectedAccounts[0]);
            }
            actions.toggleTalentAccount({
              talentId: talent.id,
              talentName: talent.talentName,
              accounts: talent.twitterAccounts,
            });
            // 検索クエリをクリアしてドロップダウンを閉じる
            actions.setTalentSearchQuery('');
            actions.setIsDropdownOpen(false);
          }}
          onDropdownOpenChange={actions.setIsDropdownOpen}
          onEnabledChange={actions.setTalentAccountsEnabled}
          onReset={() => {
            // 選択を解除
            if (state.filters.talentAccounts.selectedAccounts.length > 0) {
              actions.toggleTalentAccount(state.filters.talentAccounts.selectedAccounts[0]);
            }
            // チェックボックスをオフに
            actions.setTalentAccountsEnabled(false);
            // 検索クエリをクリア
            actions.setTalentSearchQuery('');
            // ドロップダウンを閉じる
            actions.setIsDropdownOpen(false);
          }}
        />

        {/* 高度な検索フィルタ */}
        <AdvancedFilters
          state={state}
          actions={actions}
        />
      </div>

      {/* 固定フッター */}
      <StickyFooter
        filters={state.filters}
        showSearchPreview={state.config.showSearchPreview}
        onSearchOnTwitter={actions.handleSearchOnTwitter}
        onClearKeyword={() => actions.setSearchKeywords([''])}
        onShowSearchPreviewChange={actions.setShowSearchPreview}
      />

      {/* ヘルプモーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default EgoSearchPresenter;
