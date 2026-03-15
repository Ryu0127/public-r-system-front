import React, { useMemo } from 'react';
import { TalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { TalentMusicHeader } from '../components/TalentMusicHeader';
import { TalentSelector } from '../components/TalentSelector';
import { MusicFilterTabs } from '../components/MusicFilterTabs';
import { MusicCard } from '../components/MusicCard';
import { EmptyState } from '../components/EmptyState';

interface TalentMusicPresenterProps {
  state: TalentMusicState;
  actions: TalentMusicActions;
}

const TalentMusicPresenter: React.FC<TalentMusicPresenterProps> = ({ state, actions }) => {
  const { config, data, ui } = state;

  // 選択中タレントの楽曲を絞り込む
  const talentMusicList = useMemo(() => {
    if (!data.selectedTalent) return [];
    return data.musicList.filter((m) => m.talentId === data.selectedTalent!.id);
  }, [data.musicList, data.selectedTalent]);

  // フィルター適用
  const filteredMusicList = useMemo(() => {
    if (config.activeFilter === 'all') return talentMusicList;
    return talentMusicList.filter((m) => m.type === config.activeFilter);
  }, [talentMusicList, config.activeFilter]);

  const originalCount = talentMusicList.filter((m) => m.type === 'original').length;
  const coverCount = talentMusicList.filter((m) => m.type === 'cover').length;

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

        {/* タレント選択 */}
        <TalentSelector
          talents={data.talents}
          selectedTalent={data.selectedTalent}
          searchQuery={ui.talentSearchQuery}
          isDropdownOpen={config.isDropdownOpen}
          onSearchQueryChange={actions.setTalentSearchQuery}
          onTalentSelect={actions.selectTalent}
          onDropdownOpenChange={actions.setIsDropdownOpen}
        />

        {/* ローディング */}
        {config.isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-400 border-t-transparent" />
          </div>
        )}

        {/* タレント選択済み: 楽曲一覧 */}
        {!config.isLoading && data.selectedTalent && (
          <>
            {/* フィルタータブ */}
            <MusicFilterTabs
              activeFilter={config.activeFilter}
              totalCount={talentMusicList.length}
              originalCount={originalCount}
              coverCount={coverCount}
              onFilterChange={actions.setActiveFilter}
            />

            {/* 楽曲グリッド */}
            {filteredMusicList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                {filteredMusicList.map((music) => (
                  <MusicCard key={music.id} music={music} />
                ))}
              </div>
            ) : (
              <EmptyState hasSelectedTalent={true} />
            )}
          </>
        )}

        {/* タレント未選択 */}
        {!config.isLoading && !data.selectedTalent && (
          <EmptyState hasSelectedTalent={false} />
        )}
      </div>
    </div>
  );
};

export default TalentMusicPresenter;
