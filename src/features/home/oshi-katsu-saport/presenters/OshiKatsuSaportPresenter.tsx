import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import LimitedTimeTopicModal from 'components/LimitedTimeTopicModal';
import HeroSection, { IntroPhase, isPhaseReached } from '../components/HeroSection';
import TalentShowcaseSection from '../components/TalentShowcaseSection';
import SelectedTalentFloatingBadge from 'components/molecules/SelectedTalentFloatingBadge';
import MusicShowcaseSection from '../components/MusicShowcaseSection';
import FeaturesSection from '../components/FeaturesSection';
import ChangeLogsSection from '../components/ChangeLogsSection';
import { OshiKatsuSaportState, OshiKatsuSaportActions } from '../hooks/useOshiKatsuSaportState';
import { consumeSkipHomeLoading } from 'utils/homeTransition';
import DecorativeBackground from 'components/molecules/DecorativeBackground';

interface OshiKatsuSaportPresenterProps {
  state: OshiKatsuSaportState;
  actions: OshiKatsuSaportActions;
}

/** イントロ演出の各フェーズの継続時間（ミリ秒） */
const INTRO_TIMELINE: Partial<Record<IntroPhase, { next: IntroPhase; delay: number }>> = {
  'title-reveal': { next: 'title-slide', delay: 1000 },
  'title-slide': { next: 'subtitle', delay: 800 },
  subtitle: { next: 'sections', delay: 700 },
  sections: { next: 'done', delay: 1600 },
};

const OshiKatsuSaportPresenter: React.FC<OshiKatsuSaportPresenterProps> = ({
  state,
  actions,
}) => {
  // サイト内の「ホームに戻る」からの遷移時はロード画面・イントロ演出をスキップ
  const [introPhase, setIntroPhase] = useState<'loading' | IntroPhase>(() =>
    consumeSkipHomeLoading() ? 'done' : 'loading'
  );

  // イントロ演出のフェーズを順番に進める
  useEffect(() => {
    if (introPhase === 'loading') return;
    const step = INTRO_TIMELINE[introPhase];
    if (!step) return;
    const timer = window.setTimeout(() => setIntroPhase(step.next), step.delay);
    return () => window.clearTimeout(timer);
  }, [introPhase]);

  const handleLoadingComplete = () => {
    setIntroPhase('title-reveal');
  };

  if (introPhase === 'loading') {
    return <LoadingScreen duration={3000} onLoadingComplete={handleLoadingComplete} />;
  }

  const sectionsVisible = isPhaseReached(introPhase, 'sections');

  // 各セクションを下からせり上げるためのラッパークラス
  const sectionClass = sectionsVisible ? 'animate-slide-up-fade-in' : 'opacity-0';
  const sectionStyle = (delay: string) => (sectionsVisible ? { animationDelay: delay } : undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <DecorativeBackground topBorderClass="border-amber-200" bottomBorderClass="border-sky-200" />
      {/* ふんわり光るカラーブロブ */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      {/* 漂うキラキラ（狭い画面ではタイトルと被るため非表示） */}
      <span className="hidden xl:block absolute top-32 left-[15%] text-amber-400 text-2xl opacity-40 animate-star-twinkle pointer-events-none">✦</span>
      <span className="hidden xl:block absolute top-64 right-[12%] text-sky-400 text-xl opacity-40 animate-star-twinkle pointer-events-none" style={{ animationDelay: '0.6s' }}>✧</span>
      <span className="hidden xl:block absolute top-[30rem] left-[8%] text-emerald-400 text-lg opacity-30 animate-star-twinkle pointer-events-none" style={{ animationDelay: '1.1s' }}>✦</span>

      {/* 期間限定トピックモーダル（イントロ演出が終わってから表示） */}
      {introPhase === 'done' && state.data.limitedTimeTopic && (
        <LimitedTimeTopicModal topic={state.data.limitedTimeTopic} />
      )}

      {/* 選択中タレント（画面右下からスライドイン） */}
      {sectionsVisible && state.data.selectedTalent && (
        <SelectedTalentFloatingBadge
          talent={state.data.selectedTalent}
          onClear={actions.clearTalentSelection}
        />
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-32">
        {/* ヒーローセクション */}
        <HeroSection introPhase={introPhase} />

        {/* Talentエリア: 全幅のスカイブルー帯でエリアを区切る */}
        {state.data.talentGroups.length > 0 && (
          <div className={sectionClass} style={sectionStyle('0s')}>
            <div className="relative left-1/2 -ml-[50vw] w-screen bg-sky-100/50 border-y border-sky-200/60 py-14">
              <div className="max-w-6xl mx-auto px-4">
                <TalentShowcaseSection
                  talentGroups={state.data.talentGroups}
                  selectedTalent={state.data.selectedTalent}
                  selectedGroupId={state.data.selectedGroupId}
                  onSelectTalent={actions.selectTalent}
                  onClearSelection={actions.clearTalentSelection}
                  onSelectGroup={actions.selectGroup}
                />
              </div>
            </div>
          </div>
        )}

        {/* 楽曲ピックアップ（通常背景。タレント選択時はそのタレントの楽曲） */}
        {state.data.musicList.length > 0 && (
          <div className={sectionClass} style={sectionStyle('0.15s')}>
            <MusicShowcaseSection
              musicList={state.data.musicList}
              selectedTalentName={state.data.selectedTalent?.talentName ?? null}
              listUrl={
                state.data.selectedTalent?.talentSlug
                  ? `/music?talent=${encodeURIComponent(state.data.selectedTalent.talentSlug)}`
                  : '/music'
              }
            />
          </div>
        )}

        {/* 主な機能セクション: 全幅のアンバー帯でエリアを区切る（選択中タレントを遷移先へ引き継ぐ） */}
        <div className={sectionClass} style={sectionStyle('0.3s')}>
          <div className="relative left-1/2 -ml-[50vw] w-screen bg-amber-100/40 border-y border-amber-200/60 py-14">
            <div className="max-w-6xl mx-auto px-4">
              <FeaturesSection
                features={state.data.features}
                selectedTalentSlug={state.data.selectedTalent?.talentSlug ?? null}
              />
            </div>
          </div>
        </div>

        {/* 更新履歴セクション（通常背景） */}
        <div className={sectionClass} style={sectionStyle('0.45s')}>
          <ChangeLogsSection changeLogs={state.data.changeLogs} />
        </div>

        {/* 装飾的なアイコン列 */}
        <div className={sectionClass} style={sectionStyle('0.6s')}>
          <div className="flex justify-center gap-6 text-5xl opacity-20">
            <span className="text-amber-500">✦</span>
            <span className="text-sky-500">◆</span>
            <span className="text-emerald-500">✧</span>
            <span className="text-amber-500">◆</span>
            <span className="text-sky-500">✦</span>
          </div>
        </div>

        {/* フッター */}
        <footer
          className={`text-center pt-10 border-t border-gray-200 ${sectionClass}`}
          style={sectionStyle('0.7s')}
        >
          <p className="text-gray-500 text-sm font-light tracking-wide">
            © 2025 ホロリスの推し活サポート. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 italic">
            Built with React 19 + Tailwind CSS 4
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OshiKatsuSaportPresenter;
