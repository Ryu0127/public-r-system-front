import React from 'react';
import PageHeader from 'components/organisms/PageHeader';
import DecorativeBackground from 'components/molecules/DecorativeBackground';
import { SimplePage } from '../data/simplePages';

const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface SimplePageViewerPresenterProps {
  page: SimplePage | undefined;
}

const SimplePageViewerPresenter: React.FC<SimplePageViewerPresenterProps> = ({ page }) => {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (!page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative">
        <DecorativeBackground topBorderClass="border-rose-200" bottomBorderClass="border-pink-200" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
          <PageHeader
            title="ページが見つかりません"
            subtitle="指定されたページは存在しません"
            icon={<CalendarIcon />}
            iconGradientClass="from-rose-400 to-pink-600"
            onBackToHome={handleBackToHome}
          />
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={page.title}
      src={page.htmlPath}
      className="fixed inset-0 block w-full h-full border-0 bg-[#fffefb]"
    />
  );
};

export default SimplePageViewerPresenter;
