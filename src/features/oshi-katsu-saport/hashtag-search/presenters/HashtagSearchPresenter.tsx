import React, { useState } from 'react';
import { HashtagSearchState, HashtagSearchActions } from '../hooks/useHashtagSearchState';
import { HashtagSearchHeader } from '../components/HashtagSearchHeader';
import { ModeToggle } from '../components/ModeToggle';
import { TalentSelector } from '../components/TalentSelector';
import { EventHashtagsSection } from '../components/EventHashtagsSection';
import { HashtagPostMode } from '../components/HashtagPostMode';
import { HashtagSearchMode } from '../components/HashtagSearchMode';
import { HelpModal } from '../components/HelpModal';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

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
            talentSlug: (talent as any).talentSlug,
            talentNameJoin: talent.talentName + '（' + talent.talentNameEn + '）',
            groupName: talent.groupName,
            groupId: talent.groupId,
            twitterAccounts: talent.twitterAccounts,
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

      {!state.config.isDropdownOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={!canConfirm}
                className={`w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                  canConfirm
                    ? 'bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] hover:from-[#0d8bd9] hover:to-[#1DA1F2] text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPostMode ? '投稿確認' : '検索確認'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isPostMode ? '投稿内容の確認' : '検索内容の確認'}
            </h3>
            <div className="text-sm text-gray-600 mb-5">
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
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleExecute}
                className="flex-1 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#0d8bd9]"
              >
                {isPostMode ? 'Xを開いて投稿する' : 'Xを開いて検索する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 使い方モーダル */}
      <HelpModal
        isOpen={state.config.isHelpModalOpen}
        onClose={() => actions.setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default HashtagSearchPresenter;
