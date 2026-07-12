import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { TalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { TalentMusicHeader } from '../components/TalentMusicHeader';
import { TalentSelector } from '../components/TalentSelector';
import { TalentSelectionModal } from 'components/organisms/TalentSelectionModal';
import { MusicFilterTabs } from '../components/MusicFilterTabs';
import { MusicCard } from '../components/MusicCard';
import { EmptyState } from '../components/EmptyState';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import Spinner from 'components/atoms/Spinner';
import DecorativeBackground from 'components/molecules/DecorativeBackground';
import SelectedTalentFloatingBadge from 'components/molecules/SelectedTalentFloatingBadge';

interface TalentMusicPresenterProps {
  state: TalentMusicState;
  actions: TalentMusicActions;
}

const TalentMusicPresenter: React.FC<TalentMusicPresenterProps> = ({ state, actions }) => {
  const { config, data, ui } = state;
  const selectedTalent = data.selectedTalent;
  const selectedGroup = data.selectedGroup;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const talentMusicList = data.musicList;

  const filteredMusicList = useMemo(() => {
    if (config.activeFilter === 'all') return talentMusicList;
    return talentMusicList.filter((m) => m.type === config.activeFilter);
  }, [talentMusicList, config.activeFilter]);

  const originalCount = data.musicCounts?.original ?? 0;
  const coverCount = data.musicCounts?.cover ?? 0;
  const totalCount = data.musicCounts?.all ?? 0;

  const handleModalClose = useCallback(() => {
    actions.setIsDropdownOpen(false);
    actions.setTalentSearchQuery('');
  }, [actions]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    if (config.isLoading || config.isMusicLoading || !config.hasMoreMusic) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          actions.loadMoreMusic();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    actions,
    config.hasMoreMusic,
    config.isLoading,
    config.isMusicLoading,
    config.isMusicLoadingMore,
    filteredMusicList.length,
  ]);

  // フィルタ適用後に表示件数が少ない場合、追加読み込みを促す
  useEffect(() => {
    if (config.isLoading || config.isMusicLoading || config.isMusicLoadingMore) return;
    if (!config.hasMoreMusic) return;
    if (filteredMusicList.length >= 10) return;
    actions.loadMoreMusic();
  }, [
    actions,
    config.hasMoreMusic,
    config.isLoading,
    config.isMusicLoading,
    config.isMusicLoadingMore,
    filteredMusicList.length,
    config.activeFilter,
  ]);

  const showMusicSection = !config.isLoading && !config.isMusicLoading;
  const showInitialMusicLoading = !config.isLoading && config.isMusicLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative pb-16">
      <DecorativeBackground topBorderClass="border-red-200" bottomBorderClass="border-pink-200" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        <TalentMusicHeader onBackToHome={() => { window.location.href = '/'; }} />

        <TalentSelector
          selectedTalent={selectedTalent}
          selectedGroup={selectedGroup}
          onOpenModal={() => actions.setIsDropdownOpen(true)}
          onReset={actions.clearSelection}
        />

        <TalentSelectionModal
          isOpen={config.isDropdownOpen}
          talents={data.talents}
          groups={data.groups}
          selectedTalent={selectedTalent}
          searchQuery={ui.talentSearchQuery}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={actions.selectTalent}
          onGroupSelect={actions.selectGroup}
          onClose={handleModalClose}
        />

        {config.isLoading && (
          <div className="flex justify-center items-center py-16">
            <Spinner sizeClass="h-10 w-10" borderClass="border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {showInitialMusicLoading && (
          <div className="flex justify-center items-center py-16">
            <Spinner sizeClass="h-10 w-10" borderClass="border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {showMusicSection && (
          <>
            <MusicFilterTabs
              activeFilter={config.activeFilter}
              totalCount={totalCount}
              originalCount={originalCount}
              coverCount={coverCount}
              onFilterChange={actions.setActiveFilter}
            />

            {filteredMusicList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                {filteredMusicList.map((music) => (
                  <MusicCard
                    key={`${selectedTalent?.id ?? selectedGroup?.groupId ?? 'all'}-${music.id}`}
                    music={music}
                  />
                ))}
              </div>
            )}

            {filteredMusicList.length === 0 && !config.hasMoreMusic && !config.isMusicLoadingMore && (
              <EmptyState />
            )}

            {(config.hasMoreMusic || config.isMusicLoadingMore) && (
              <>
                <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />
                {config.isMusicLoadingMore && (
                  <div className="flex justify-center items-center py-8">
                    <Spinner sizeClass="h-8 w-8" borderClass="border-4 border-red-400 border-t-transparent" />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ページ上部へ戻るボタン（タレント選択モードバッジの上に表示） */}
      <ScrollToTopButton
        positionClass={selectedTalent ? 'bottom-28 right-6' : 'bottom-6 right-6'}
      />

      {/* 選択中タレント（タレント選択モード） */}
      {selectedTalent && (
        <SelectedTalentFloatingBadge
          talent={selectedTalent}
          onClear={actions.clearSelection}
        />
      )}
    </div>
  );
};

export default TalentMusicPresenter;
