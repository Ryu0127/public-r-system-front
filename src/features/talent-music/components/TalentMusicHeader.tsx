import React from 'react';
import PageHeader from 'components/organisms/PageHeader';

const MusicIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

interface TalentMusicHeaderProps {
  onBackToHome: () => void;
}

export const TalentMusicHeader: React.FC<TalentMusicHeaderProps> = ({ onBackToHome }) => {
  return (
    <PageHeader
      title="楽曲一覧"
      subtitle="タレントごとのオリジナル曲・カバー曲をYouTubeサムネイルで一覧できます"
      icon={<MusicIcon />}
      iconGradientClass="from-red-500 to-pink-600"
      steps={[]}
      onBackToHome={onBackToHome}
    />
  );
};
