import React from 'react';

interface EgoSearchHeaderProps {
  onBackToHome: () => void;
  onHelpClick: () => void;
}

const APP_TITLE = 'エゴサーチ サポート';

// ホームアイコンコンポーネント
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const EgoSearchHeader: React.FC<EgoSearchHeaderProps> = ({
  onBackToHome,
  onHelpClick,
}) => {
  return (
    <header className="text-center mb-12 animate-fade-in">
      {/* ホームに戻るボタンと使い方ボタン */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
        >
          <HomeIcon />
          <span className="text-sm font-medium">ホームに戻る</span>
        </button>
        <button
          onClick={onHelpClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">使い方</span>
        </button>
      </div>

      {/* タイトル */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-800"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ✦ {APP_TITLE}
        </h1>
      </div>

      {/* サブタイトル */}
      <p className="text-lg text-gray-600 font-light">
        高度な検索フィルタで、効率的にエゴサーチができます
      </p>
    </header>
  );
};
