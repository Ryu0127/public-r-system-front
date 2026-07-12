import React, { useState } from 'react';
import { EgoSearchState, EgoSearchActions } from '../hooks/useEgoSearchState';
import { EgoSearchHeader } from '../components/EgoSearchHeader';
import { SearchKeywordInput } from '../components/SearchKeywordInput';
import { KeywordPresetsSelector } from '../components/KeywordPresetsSelector';
import { TalentSelector } from '../components/TalentSelector';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { HelpModal } from '../components/HelpModal';
import { buildSearchQueryPreview } from '../utils/buildTwitterSearchUrl';
import ConfirmModal from 'components/molecules/ConfirmModal';
import StickyActionBar from 'components/molecules/StickyActionBar';
import DecorativeBackground from 'components/molecules/DecorativeBackground';
import SelectionModeFloatingBadge from 'components/molecules/SelectionModeFloatingBadge';

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
  // 選択中タレント（selectedAccounts の先頭タレント）
  const selectedTalent =
    state.filters.talentAccounts.selectedAccounts.length > 0
      ? state.data.talents.find(
          (t) => t.id === state.filters.talentAccounts.selectedAccounts[0].talentId
        ) ?? null
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative pb-32">
      {/* 背景装飾 */}
      <DecorativeBackground topBorderClass="border-blue-200" bottomBorderClass="border-sky-200" />

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
          selectedTalent={selectedTalent}
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
        <StickyActionBar
          label="検索内容を確認"
          onClick={() => setIsConfirmModalOpen(true)}
        />
      )}

      {/* 選択中タレント（タレント選択モード。下部固定バーの上に表示） */}
      {selectedTalent && (
        <SelectionModeFloatingBadge
          talent={selectedTalent}
          onClear={actions.resetTalentSelection}
          positionClass="bottom-24 right-4 md:right-6"
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="検索内容の確認"
        confirmLabel="Xで検索する"
        onConfirm={() => {
          actions.handleSearchOnTwitter();
          setIsConfirmModalOpen(false);
        }}
        onCancel={() => setIsConfirmModalOpen(false)}
      >
        <p className="mb-3 text-gray-700">以下の検索クエリでXの検索画面を開きます。</p>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-1">検索クエリ</p>
          <p className="text-sm text-gray-800 font-mono break-all whitespace-pre-wrap">
            {searchQueryPreview || '—'}
          </p>
        </div>
      </ConfirmModal>

      {/* ヘルプモーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default EgoSearchPresenter;
