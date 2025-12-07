import React from 'react';
import { CollabSearchState } from '../types';
import { CollabSearchActions } from '../hooks/useCollabSearchState';
import { BaseTalentSelector } from '../components/BaseTalentSelector';
import { CollaboratorSelector } from '../components/CollaboratorSelector';
import { VideoList } from '../components/VideoList';
import { HomeIcon } from '../../hashtag-search/components/Icons';

interface CollabSearchPresenterProps {
  state: CollabSearchState;
  actions: CollabSearchActions;
}

const APP_TITLE = 'タレントコラボ配信検索';

export const CollabSearchPresenter: React.FC<CollabSearchPresenterProps> = ({
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
        <header className="text-center mb-12 animate-fade-in">
          {/* ホームに戻るボタン */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
            >
              <HomeIcon />
              <span className="text-sm font-medium">ホームに戻る</span>
            </button>
            <div></div>
          </div>

          {/* タイトル */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {APP_TITLE}
            </h1>
          </div>

          {/* サブタイトル */}
          <p className="text-lg text-gray-600 font-light">
            タレント同士のコラボ配信アーカイブを検索できます
          </p>
        </header>

        {/* セレクターセクション */}
        <section className="max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                検索条件
              </h2>
              <p className="text-sm text-gray-600 text-center">
                メインタレントを選択すると、過去にコラボしたタレントがプルダウンに表示されます
              </p>
            </div>

            {/* メインタレント選択 */}
            <BaseTalentSelector
              talents={state.data.talents}
              selectedTalent={state.data.selectedBaseTalent}
              searchQuery={state.ui.baseTalentSearchQuery}
              isDropdownOpen={state.config.isBaseTalentDropdownOpen}
              onSearchQueryChange={actions.setBaseTalentSearchQuery}
              onTalentSelect={actions.selectBaseTalent}
              onDropdownOpenChange={actions.setIsBaseTalentDropdownOpen}
            />

            {/* コラボタレント選択 */}
            <CollaboratorSelector
              collaborators={state.data.collaborators}
              selectedCollaborator={state.data.selectedCollaborator}
              searchQuery={state.ui.collaboratorSearchQuery}
              isDropdownOpen={state.config.isCollaboratorDropdownOpen}
              isDisabled={!state.data.selectedBaseTalent}
              onSearchQueryChange={actions.setCollaboratorSearchQuery}
              onCollaboratorSelect={actions.selectCollaborator}
              onDropdownOpenChange={actions.setIsCollaboratorDropdownOpen}
            />
          </div>
        </section>

        {/* 動画一覧セクション */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <VideoList
            videos={state.data.videos}
            isLoading={state.config.isLoading}
            baseTalentName={state.data.selectedBaseTalent?.talentName}
            collaboratorName={state.data.selectedCollaborator?.talentName}
          />
        </section>
      </div>
    </div>
  );
};
