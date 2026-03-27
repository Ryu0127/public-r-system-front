import React from 'react';

interface TalentMusicHeaderProps {
  onBackToHome: () => void;
}

export const TalentMusicHeader: React.FC<TalentMusicHeaderProps> = ({ onBackToHome }) => {
  return (
    <div className="mb-8 animate-fade-in">
      {/* 戻るボタン */}
      <button
        onClick={onBackToHome}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-6 group"
      >
        <svg
          className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">ホームへ戻る</span>
      </button>

      {/* タイトル */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          楽曲一覧
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          オリジナル曲・カバー曲をYouTubeサムネイルで確認できます
        </p>
      </div>
    </div>
  );
};
