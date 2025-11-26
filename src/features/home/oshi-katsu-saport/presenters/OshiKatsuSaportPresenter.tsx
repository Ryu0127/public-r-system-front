import React, { useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import LimitedTimeTopicModal from 'components/LimitedTimeTopicModal';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import ChangeLogsSection from '../components/ChangeLogsSection';
import { OshiKatsuSaportState, OshiKatsuSaportActions } from '../hooks/useOshiKatsuSaportState';

interface OshiKatsuSaportPresenterProps {
  state: OshiKatsuSaportState;
  actions: OshiKatsuSaportActions;
}

const OshiKatsuSaportPresenter: React.FC<OshiKatsuSaportPresenterProps> = ({
  state,
  actions,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen duration={3000} onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* 期間限定トピックモーダル */}
      {state.data.limitedTimeTopic && (
        <LimitedTimeTopicModal topic={state.data.limitedTimeTopic} />
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-32">
        {/* ヒーローセクション */}
        <HeroSection />

        {/* 主な機能セクション */}
        <FeaturesSection features={state.data.features} />

        {/* 更新履歴セクション */}
        <ChangeLogsSection changeLogs={state.data.changeLogs} />

        {/* 装飾的なアイコン列 */}
        <div className="flex justify-center gap-6 text-5xl opacity-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <span className="text-amber-500">✦</span>
          <span className="text-sky-500">◆</span>
          <span className="text-emerald-500">✧</span>
          <span className="text-amber-500">◆</span>
          <span className="text-sky-500">✦</span>
        </div>

        {/* フッター */}
        <footer className="text-center pt-10 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
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
