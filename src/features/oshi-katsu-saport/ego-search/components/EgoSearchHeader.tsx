import React from 'react';

interface EgoSearchHeaderProps {
  onBackToHome: () => void;
  onHelpClick: () => void;
}

export const EgoSearchHeader: React.FC<EgoSearchHeaderProps> = ({
  onBackToHome,
  onHelpClick,
}) => {
  return (
    <header className="text-center space-y-6 animate-fade-in">
      {/* ホームに戻るボタン */}
      <div className="flex justify-start mb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 text-gray-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>ホームに戻る</span>
        </button>
      </div>

      {/* タイトル */}
      <div>
        <h1
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ✦ エゴサーチ サポート
        </h1>
        <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
          高度な検索フィルタで、効率的にエゴサーチができます
        </p>
      </div>

      {/* 使い方ボタン */}
      <div className="flex justify-center">
        <button
          onClick={onHelpClick}
          className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>使い方を見る</span>
        </button>
      </div>
    </header>
  );
};
