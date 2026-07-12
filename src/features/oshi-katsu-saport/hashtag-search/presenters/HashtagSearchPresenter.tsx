import React, { useState } from 'react';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { HashtagSearchHeader } from '../components/HashtagSearchHeader';
import { ModeToggle } from '../components/ModeToggle';
import { TalentSelector } from '../components/TalentSelector';
import { EventHashtagsSection } from '../components/EventHashtagsSection';
import { HashtagPostMode } from '../components/HashtagPostMode';
import { HashtagSearchMode } from '../components/HashtagSearchMode';
import { HelpModal } from '../components/HelpModal';
import { HashtagSearchEmptyState } from '../components/HashtagSearchEmptyState';
import ConfirmModal from 'components/molecules/ConfirmModal';
import StickyActionBar from 'components/molecules/StickyActionBar';
import DecorativeBackground from 'components/molecules/DecorativeBackground';

interface HashtagSearchPresenterProps {
  state: HashtagSearchState;
  actions: HashtagSearchActions;
}

export const HashtagSearchPresenter: React.FC<HashtagSearchPresenterProps> = ({
  state,
  actions,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      actions.handleSearchOnTwitter();
    }
  };

  const isPostMode = state.config.mode === 'post';
  const canConfirm = isPostMode
    ? state.ui.selectedTags.length > 0
    : !!state.ui.searchQuery.trim();

  const handleExecute = () => {
    if (isPostMode) {
      actions.handlePostToTwitter();
    } else {
      actions.handleSearchOnTwitter();
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative pb-32">
      {/* 背景装飾 */}
      <DecorativeBackground topBorderClass="border-blue-200" bottomBorderClass="border-sky-200" />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* ヘッダー */}
        <HashtagSearchHeader
          onBackToHome={handleBackToHome}
          onHelpClick={() => actions.setIsHelpModalOpen(true)}
        />

        {/* モード切り替えタブ */}
        <ModeToggle
          mode={state.config.mode}
          onModeChange={actions.setMode}
        />

        {/* タレント選択（楽曲一覧と共通のモーダル選択） */}
        <TalentSelector
          talents={state.data.talents}
          selectedTalent={state.data.selectedTalent}
          searchQuery={state.ui.talentSearchQuery}
          isDropdownOpen={state.config.isDropdownOpen}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={actions.selectTalent}
          onDropdownOpenChange={actions.setIsDropdownOpen}
          onReset={actions.clearTalentSelection}
        />

        {/* タレント選択済み */}
        {state.data.selectedTalent && (
          <>
            {/* イベントハッシュタグエリア */}
            <EventHashtagsSection
              eventHashtags={state.data.eventHashtags}
              selectedTags={state.ui.selectedTags}
              mode={state.config.mode}
              includeEventUrl={state.config.includeEventUrl}
              onEventHashtagToggle={actions.toggleEventHashtag}
              onSearchQueryChange={actions.setSearchQuery}
              onIncludeEventUrlChange={actions.setIncludeEventUrl}
            />
            {/* メイン機能エリア */}
            <div className="max-w-2xl mx-auto">
              {/* ハッシュタグ選択・投稿機能 */}
              {state.config.mode === 'post' && (
                <HashtagPostMode
                  selectedTalent={state.data.selectedTalent}
                  hashtags={state.data.hashtags}
                  selectedTags={state.ui.selectedTags}
                  onToggleTag={actions.toggleTag}
                />
              )}

              {/* タグ検索機能 */}
              {state.config.mode === 'search' && (
                <HashtagSearchMode
                  selectedTalent={state.data.selectedTalent}
                  hashtags={state.data.hashtags}
                  searchQuery={state.ui.searchQuery}
                  onSearchQueryChange={actions.setSearchQuery}
                  onQuickSearch={actions.handleQuickSearch}
                  onKeyPress={handleKeyPress}
                />
              )}
            </div>
          </>
        )}

        {/* タレント未選択 */}
        {!state.data.selectedTalent && (
          <HashtagSearchEmptyState />
        )}
      </div>

      {!state.config.isDropdownOpen && (
        <StickyActionBar
          label={isPostMode ? '投稿確認' : '検索確認'}
          disabled={!canConfirm}
          onClick={() => setIsConfirmModalOpen(true)}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={isPostMode ? '投稿内容の確認' : '検索内容の確認'}
        confirmLabel={isPostMode ? 'Xを開いて投稿する' : 'Xを開いて検索する'}
        onConfirm={handleExecute}
        onCancel={() => setIsConfirmModalOpen(false)}
      >
        {isPostMode ? (
          <>
            <p className="mb-2">以下のハッシュタグで投稿画面を開きます。</p>
            <div className="flex flex-wrap gap-2">
              {state.ui.selectedTags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-1">以下のハッシュタグで検索画面を開きます。</p>
            <p className="font-semibold text-gray-800">#{state.ui.searchQuery.trim()}</p>
          </>
        )}
      </ConfirmModal>

      {/* 使い方モーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default HashtagSearchPresenter;
