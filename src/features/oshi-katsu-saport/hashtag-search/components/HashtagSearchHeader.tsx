import React from 'react';
import PageHeader from 'components/PageHeader';

const HashBadgeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

interface HashtagSearchHeaderProps {
  onBackToHome: () => void;
  onHelpClick: () => void;
}

const APP_TITLE = 'タレント別 ハッシュタグ投稿/検索 サポート';

export const HashtagSearchHeader: React.FC<HashtagSearchHeaderProps> = ({
  onBackToHome,
  onHelpClick,
}) => {
  return (
    <PageHeader
      title={APP_TITLE}
      subtitle="各タレントごとの応援ハッシュタグを選択して投稿/検索のサポートができます"
      icon={<HashBadgeIcon />}
      iconGradientClass="from-[#1DA1F2] to-[#0d8bd9]"
      steps={[
        '投稿 or 検索モードを選ぶ',
        'タレントを選んでタグを選択',
        'Xで投稿・検索',
      ]}
      onBackToHome={onBackToHome}
      onHelpClick={onHelpClick}
    />
  );
};
