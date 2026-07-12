import React from 'react';
import PageHeader from 'components/organisms/PageHeader';

const SearchBadgeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface EgoSearchHeaderProps {
  onBackToHome: () => void;
  onHelpClick: () => void;
}

const APP_TITLE = 'エゴサーチ サポート';

export const EgoSearchHeader: React.FC<EgoSearchHeaderProps> = ({
  onBackToHome,
  onHelpClick,
}) => {
  return (
    <PageHeader
      title={APP_TITLE}
      subtitle="高度な検索フィルタで、効率的にエゴサーチができます"
      icon={<SearchBadgeIcon />}
      iconGradientClass="from-[#1DA1F2] to-[#0d8bd9]"
      steps={[
        'タレントを選ぶ',
        'キーワードや除外条件を設定',
        'Xで検索',
      ]}
      onBackToHome={onBackToHome}
      onHelpClick={onHelpClick}
    />
  );
};
