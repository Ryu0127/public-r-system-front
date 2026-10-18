import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { TalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { TalentMusicHeader } from '../components/TalentMusicHeader';
import { TalentMusicTopBar } from '../components/TalentMusicTopBar';
import { TalentSelectionModal } from 'components/organisms/TalentSelectionModal';
import { MusicFilterTabs } from '../components/MusicFilterTabs';
import { MusicCard } from '../components/MusicCard';
import { PlaylistCard } from '../components/PlaylistCard';
import {
  MusicSelectionFooter,
  MUSIC_SELECTION_FOOTER_OFFSET_CLASS,
} from '../components/MusicSelectionFooter';
import { TEMPORARY_PLAYLIST_MAX_VIDEOS } from '../utils/temporaryPlaylist';
import { EmptyState } from '../components/EmptyState';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import Spinner from 'components/atoms/Spinner';
import DecorativeBackground from 'components/molecules/DecorativeBackground';
import SelectionModeFloatingBadge from 'components/molecules/SelectionModeFloatingBadge';

/** カード一覧のグリッド（330px 固定幅カードを中央揃えで並べる） */
const CARD_GRID_CLASS =
  'grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),330px))] justify-center gap-6';

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

  // 複数選択（一時プレイリスト）: 楽曲ID → 選択順（1始まり）
  const playlistSelection = data.playlistSelection;
  const selectionOrderById = useMemo(() => {
    const map = new Map<number, number>();
    playlistSelection.forEach((m, index) => map.set(m.id, index + 1));
    return map;
  }, [playlistSelection]);
  const isSelectionMaxReached = playlistSelection.length >= TEMPORARY_PLAYLIST_MAX_VIDEOS;
  const hasSelectionBadge = !!selectedTalent || !!selectedGroup;

  // 画面下部の固定要素の位置（常時表示のフッターの上に配置）
  const badgePositionClass = `${MUSIC_SELECTION_FOOTER_OFFSET_CLASS} right-4 md:right-6`;
  const scrollTopPositionClass = hasSelectionBadge
    ? 'bottom-44 right-6'
    : `${MUSIC_SELECTION_FOOTER_OFFSET_CLASS} right-6`;
  const showInitialMusicLoading = !config.isLoading && config.isMusicLoading;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-x-clip pb-36"
    >
      {/* 上部固定ヘッダー（タレント・グループ選択） */}
      <TalentMusicTopBar
        selectedTalent={selectedTalent}
        selectedGroup={selectedGroup}
        onOpenModal={() => actions.setIsDropdownOpen(true)}
        onReset={actions.clearSelection}
      />

      <DecorativeBackground topBorderClass="border-red-200" bottomBorderClass="border-pink-200" />

      <div className="relative z-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <TalentMusicHeader />

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
        </div>

        {/* プレイリスト・楽曲カード一覧（画面幅いっぱいに中央揃えで表示。左右の余白はホバー拡大分を確保） */}
        {showMusicSection && (
          <div className="px-4 md:px-8">
            {data.playlists.length > 0 && (
              <section className="mb-10 animate-fade-in" aria-labelledby="music-playlists-heading">
                <h2
                  id="music-playlists-heading"
                  className="mb-3 text-center text-base font-bold tracking-widest text-gray-700"
                >
                  プレイリスト
                </h2>
                <div className={CARD_GRID_CLASS}>
                  {data.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}

            <MusicFilterTabs
              activeFilter={config.activeFilter}
              totalCount={totalCount}
              originalCount={originalCount}
              coverCount={coverCount}
              onFilterChange={actions.setActiveFilter}
            />

            {filteredMusicList.length > 0 && (
              <div className={`${CARD_GRID_CLASS} animate-fade-in`}>
                {filteredMusicList.map((music) => (
                  <MusicCard
                    key={`${selectedTalent?.id ?? selectedGroup?.groupId ?? 'all'}-${music.id}`}
                    music={music}
                    selectionMode={config.isMultiSelectMode}
                    isSelected={selectionOrderById.has(music.id)}
                    selectionOrder={selectionOrderById.get(music.id)}
                    isSelectionDisabled={isSelectionMaxReached && !selectionOrderById.has(music.id)}
                    onToggleSelect={actions.toggleMusicSelection}
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
          </div>
        )}
      </div>

      {/* ページ上部へ戻るボタン（選択モードバッジ・フッターの上に表示） */}
      <ScrollToTopButton positionClass={scrollTopPositionClass} />

      {/* 楽曲の複数選択フッター（常時表示） */}
      <MusicSelectionFooter
        isMultiSelectMode={config.isMultiSelectMode}
        selectedMusic={playlistSelection}
        isStartDisabled={!showMusicSection || filteredMusicList.length === 0}
        onStart={actions.startMultiSelect}
        onCancel={actions.cancelMultiSelect}
      />

      {/* 選択中タレント（タレント選択モード） */}
      {selectedTalent && (
        <SelectionModeFloatingBadge
          talent={selectedTalent}
          onClear={actions.clearSelection}
          positionClass={badgePositionClass}
        />
      )}

      {/* 選択中グループ（グループ選択モード。アイコンなし） */}
      {!selectedTalent && selectedGroup && (
        <SelectionModeFloatingBadge
          modeLabel="グループ選択モード"
          name={selectedGroup.groupName}
          onClear={actions.clearSelection}
          positionClass={badgePositionClass}
        />
      )}
    </div>
  );
};

export default TalentMusicPresenter;
