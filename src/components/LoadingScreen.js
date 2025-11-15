import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ duration = 3000, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [duration, onLoadingComplete]);

  // フローティングパーティクルを削除（背景のチカチカを抑えるため）

  // 背景クリックを無効化
  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    // 何もしない（ローディング中はクリック無効）
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-amber-50"
      onClick={handleBackgroundClick}
    >
      {/* 中央の円形ローダー */}
      <div className="relative mb-16">
        {/* 外側リング（ゴールド） */}
        <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-amber-500 border-r-amber-400 rounded-full animate-spin shadow-lg shadow-amber-500/30" />

        {/* 中間リング（スカイブルー） */}
        <div
          className="absolute inset-0 w-32 h-32 border-4 border-transparent border-b-sky-500 border-l-sky-400 rounded-full animate-spin-slow shadow-md shadow-sky-500/20"
          style={{ animationDirection: 'reverse' }}
        />

        {/* 内側の円（グラデーション） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-sky-400 to-emerald-400 rounded-full shadow-xl shadow-sky-500/40">
            {/* 中心アイコン */}
            <div className="flex items-center justify-center w-full h-full text-white text-3xl">
              ✦
            </div>
          </div>
        </div>

        {/* 実際のコンテナサイズ */}
        <div className="w-32 h-32" />
      </div>

      {/* テキスト */}
      <div className="text-center space-y-3 mb-12">
        <h2
          className="text-4xl font-bold text-gray-800"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Loading
        </h2>
        <p className="text-gray-600 uppercase tracking-widest font-light text-sm">
          Please wait a moment
        </p>
      </div>

      {/* プログレスバー */}
      <div className="w-80 max-w-md">
        <div className="relative h-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full overflow-hidden">
          {/* プログレスバー本体 */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* パーセンテージ表示 */}
        <div className="flex justify-end mt-3">
          <span className="text-amber-600 font-semibold text-sm">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
