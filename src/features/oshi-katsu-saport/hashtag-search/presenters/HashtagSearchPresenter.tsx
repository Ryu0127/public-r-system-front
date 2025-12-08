import React from 'react';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { HashtagSearchHeader } from '../components/HashtagSearchHeader';
import { ModeToggle } from '../components/ModeToggle';
import { TalentSelector } from '../components/TalentSelector';
import { EventHashtagsSection } from '../components/EventHashtagsSection';
import { HashtagPostMode } from '../components/HashtagPostMode';
import { HashtagSearchMode } from '../components/HashtagSearchMode';
import { HelpModal } from '../components/HelpModal';
import { StickyFooter } from '../components/StickyFooter';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

interface HashtagSearchPresenterProps {
  state: HashtagSearchState;
  actions: HashtagSearchActions;
}

export const HashtagSearchPresenter: React.FC<HashtagSearchPresenterProps> = ({
  state,
  actions,
}) => {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      actions.handleSearchOnTwitter();
    }
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
        <HashtagSearchHeader
          onBackToHome={handleBackToHome}
          onHelpClick={() => actions.setIsHelpModalOpen(true)}
        />

        {/* モード切り替えタブ */}
        <ModeToggle
          mode={state.config.mode}
          onModeChange={actions.setMode}
        />

        {/* タレント選択コンボボックス */}
        <TalentSelector
          talents={state.data.talents}
          selectedTalent={state.data.selectedTalent}
          searchQuery={state.ui.talentSearchQuery}
          isDropdownOpen={state.config.isDropdownOpen}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={(talent: Talent) => actions.selectTalent({
            id: talent.id,
            talentName: talent.talentName,
            talentNameEn: talent.talentNameEn,
            talentNameJoin: talent.talentName + '（' + talent.talentNameEn + '）',
          })}
          onDropdownOpenChange={actions.setIsDropdownOpen}
        />

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
              state={state}
              actions={actions}
              selectedTalent={state.data.selectedTalent}
              hashtags={state.data.hashtags}
              searchQuery={state.ui.searchQuery}
              onSearchQueryChange={actions.setSearchQuery}
              onQuickSearch={actions.handleQuickSearch}
              onKeyPress={handleKeyPress}
            />
          )}
        </div>
      </div>

      {/* 固定フッター */}
      <StickyFooter
        mode={state.config.mode}
        selectedTags={state.ui.selectedTags}
        selectedEventHashtags={state.ui.selectedEventHashtags}
        includeEventUrl={state.config.includeEventUrl}
        showSelectedTags={state.config.showSelectedTags}
        onPostToTwitter={actions.handlePostToTwitter}
        onClearTags={actions.clearSelectedTags}
        onIncludeEventUrlChange={actions.setIncludeEventUrl}
        onShowSelectedTagsChange={actions.setShowSelectedTags}
        searchQuery={state.ui.searchQuery}
        showSearchPreview={state.config.showSearchPreview}
        onSearchOnTwitter={actions.handleSearchOnTwitter}
        onSearchQueryChange={actions.setSearchQuery}
        onShowSearchPreviewChange={actions.setShowSearchPreview}
      />

      {/* 使い方モーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default HashtagSearchPresenter;
