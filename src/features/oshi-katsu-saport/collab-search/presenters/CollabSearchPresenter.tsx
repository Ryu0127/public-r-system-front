import React from 'react';
import { CollabSearchState } from '../types';
import { CollabSearchActions } from '../hooks/useCollabSearchState';
import { BaseTalentSelector } from '../components/BaseTalentSelector';
import { CollaboratorSelector } from '../components/CollaboratorSelector';
import { VideoList } from '../components/VideoList';

interface CollabSearchPresenterProps {
  state: CollabSearchState;
  actions: CollabSearchActions;
}

export const CollabSearchPresenter: React.FC<CollabSearchPresenterProps> = ({
  state,
  actions,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                タレントコラボ配信検索
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                タレント同士のコラボ配信アーカイブを検索できます
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* セレクターセクション */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
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
              <p className="text-sm text-gray-600">
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
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <VideoList
            videos={state.data.videos}
            isLoading={state.config.isLoading}
            baseTalentName={state.data.selectedBaseTalent?.talentName}
            collaboratorName={state.data.selectedCollaborator?.talentName}
          />
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            タレントコラボ配信検索 - あなたの推し活をサポート
          </p>
        </div>
      </footer>
    </div>
  );
};
