import React from 'react';
import PageHeader from 'components/organisms/PageHeader';

const LyricsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

interface MusicLyricsHeaderProps {
  onBackToHome: () => void;
}

export const MusicLyricsHeader: React.FC<MusicLyricsHeaderProps> = ({ onBackToHome }) => (
  <PageHeader
    title="歌詞・コール確認"
    subtitle="歌詞とライブで入れるコールを一緒に確認できます"
    icon={<LyricsIcon />}
    iconGradientClass="from-red-500 to-pink-600"
    steps={['表示モードを選ぶ', '動画を再生', 'コールを確認']}
    onBackToHome={onBackToHome}
  />
);
