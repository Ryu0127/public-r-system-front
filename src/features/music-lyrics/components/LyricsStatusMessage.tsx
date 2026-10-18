import React from 'react';
import { Link } from 'react-router-dom';

interface LyricsStatusMessageProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

/**
 * 未登録・取得失敗などの状態表示
 */
export const LyricsStatusMessage: React.FC<LyricsStatusMessageProps> = ({
  title,
  description,
  onRetry,
}) => (
  <div className="text-center py-16 animate-fade-in">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    </div>
    <p className="text-gray-500 font-medium">{title}</p>
    <p className="text-gray-400 text-sm mt-1">{description}</p>
    <div className="mt-6 flex items-center justify-center gap-3">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-md"
        >
          再読み込み
        </button>
      )}
      <Link
        to="/music"
        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:border-gray-400 transition-all duration-200 shadow-sm"
      >
        楽曲一覧へ
      </Link>
    </div>
  </div>
);
