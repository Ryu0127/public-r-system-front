import React, { useEffect, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import LimitedTimeTopicModal from 'components/LimitedTimeTopicModal';
import HeroSection, { IntroPhase, isPhaseReached } from '../components/HeroSection';
import MusicShowcaseSection from '../components/MusicShowcaseSection';
import FeaturesSection from '../components/FeaturesSection';
import ChangeLogsSection from '../components/ChangeLogsSection';
import { OshiKatsuSaportState, OshiKatsuSaportActions } from '../hooks/useOshiKatsuSaportState';
import { consumeSkipHomeLoading } from 'utils/homeTransition';

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
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />
      {/* ふんわり光るカラーブロブ */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      {/* 漂うキラキラ */}
      <span className="absolute top-32 left-[15%] text-amber-400 text-2xl opacity-40 animate-star-twinkle pointer-events-none">✦</span>
      <span className="absolute top-64 right-[12%] text-sky-400 text-xl opacity-40 animate-star-twinkle pointer-events-none" style={{ animationDelay: '0.6s' }}>✧</span>
      <span className="absolute top-[30rem] left-[8%] text-emerald-400 text-lg opacity-30 animate-star-twinkle pointer-events-none" style={{ animationDelay: '1.1s' }}>✦</span>

      {/* 期間限定トピックモーダル（イントロ演出が終わってから表示） */}
      {introPhase === 'done' && state.data.limitedTimeTopic && (
        <LimitedTimeTopicModal topic={state.data.limitedTimeTopic} />
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-32">
        {/* ヒーローセクション */}
        <HeroSection introPhase={introPhase} />

        {/* 楽曲ピックアップ（自動横スクロール） */}
        <div className={sectionClass} style={sectionStyle('0s')}>
          <MusicShowcaseSection musicList={state.data.musicList} />
        </div>

        {/* 主な機能セクション */}
        <div className={sectionClass} style={sectionStyle('0.2s')}>
          <FeaturesSection features={state.data.features} />
        </div>

        {/* 更新履歴セクション */}
        <div className={sectionClass} style={sectionStyle('0.4s')}>
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
