import React, { useMemo, useCallback } from 'react';
import { TalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { TalentMusicHeader } from '../components/TalentMusicHeader';
import { TalentSelector } from '../components/TalentSelector';
import { TalentSelectionModal } from '../components/TalentSelectionModal';
import { MusicFilterTabs } from '../components/MusicFilterTabs';
import { MusicCard } from '../components/MusicCard';
import { EmptyState } from '../components/EmptyState';

interface TalentMusicPresenterProps {
  state: TalentMusicState;
  actions: TalentMusicActions;
}

const TalentMusicPresenter: React.FC<TalentMusicPresenterProps> = ({ state, actions }) => {
  const { config, data, ui } = state;
  const selectedTalent = data.selectedTalent;

  /** API が返す楽曲（複数タレント指定時は混在しうる。現状は単一選択のため実質1タレント分） */
  const talentMusicList = useMemo(() => {
    if (!selectedTalent) return [];
    return data.musicList;
  }, [data.musicList, selectedTalent]);

  // フィルター適用
  const filteredMusicList = useMemo(() => {
    if (config.activeFilter === 'all') return talentMusicList;
    return talentMusicList.filter((m) => m.type === config.activeFilter);
  }, [talentMusicList, config.activeFilter]);

  const originalCount = talentMusicList.filter((m) => m.type === 'original').length;
  const coverCount = talentMusicList.filter((m) => m.type === 'cover').length;

  // モーダルを閉じる際に検索クエリもクリア
  const handleModalClose = useCallback(() => {
    actions.setIsDropdownOpen(false);
    actions.setTalentSearchQuery('');
  }, [actions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative pb-16">
      {/* 背景装飾 */}
      <div className="absolute top-16 right-16 w-40 h-40 border-4 border-red-200 rounded-full opacity-15 animate-spin-slow" />
      <div
        className="absolute bottom-32 left-16 w-28 h-28 border-4 border-pink-200 rounded-full opacity-15 animate-spin"
        style={{ animationDuration: '20s' }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* ヘッダー */}
        <TalentMusicHeader onBackToHome={() => { window.location.href = '/'; }} />

        {/* タレント選択ボタン */}
        <TalentSelector
          selectedTalent={selectedTalent}
          onOpenModal={() => actions.setIsDropdownOpen(true)}
        />

        {/* タレント選択モーダル */}
        <TalentSelectionModal
          isOpen={config.isDropdownOpen}
          talents={data.talents}
          groups={data.groups}
          selectedTalent={selectedTalent}
          searchQuery={ui.talentSearchQuery}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={actions.selectTalent}
          onClose={handleModalClose}
        />

        {/* タレント一覧取得中 */}
        {config.isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {/* タレント選択済み: 楽曲取得中 */}
        {!config.isLoading && selectedTalent && config.isMusicLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {/* タレント選択済み: 楽曲一覧 */}
        {!config.isLoading && selectedTalent && !config.isMusicLoading && (
          <>
            <MusicFilterTabs
              activeFilter={config.activeFilter}
              totalCount={talentMusicList.length}
              originalCount={originalCount}
              coverCount={coverCount}
              onFilterChange={actions.setActiveFilter}
            />

            {filteredMusicList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                {filteredMusicList.map((music) => (
                  <MusicCard
                    key={`${selectedTalent.id}-${music.id}`}
                    music={music}
                  />
                ))}
              </div>
            ) : (
              <EmptyState hasSelectedTalent={true} />
            )}
          </>
        )}

        {/* タレント未選択 */}
        {!config.isLoading && !selectedTalent && (
          <EmptyState hasSelectedTalent={false} />
        )}
      </div>
    </div>
  );
};

export default TalentMusicPresenter;
