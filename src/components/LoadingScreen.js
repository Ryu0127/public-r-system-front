import React, { useState, useEffect } from 'react';

// ライブ会場のペンライトをイメージしたカラー
const PENLIGHTS = [
  { tube: 'from-amber-300 to-amber-500', glow: 'shadow-amber-400/60', delay: '0s' },
  { tube: 'from-sky-300 to-sky-500', glow: 'shadow-sky-400/60', delay: '0.15s' },
  { tube: 'from-emerald-300 to-emerald-500', glow: 'shadow-emerald-400/60', delay: '0.3s' },
  { tube: 'from-pink-300 to-pink-500', glow: 'shadow-pink-400/60', delay: '0.45s' },
  { tube: 'from-violet-300 to-violet-500', glow: 'shadow-violet-400/60', delay: '0.6s' },
];

// 舞い上がるキラキラ（位置・サイズ・タイミングは固定値でチカチカを抑える）
const SPARKLES = [
  { left: '12%', bottom: '20%', size: 'text-xl', color: 'text-amber-400', duration: '3.2s', delay: '0s', char: '✦' },
  { left: '25%', bottom: '35%', size: 'text-sm', color: 'text-sky-400', duration: '4s', delay: '0.8s', char: '✧' },
  { left: '40%', bottom: '15%', size: 'text-lg', color: 'text-emerald-400', duration: '3.6s', delay: '1.5s', char: '✦' },
  { left: '60%', bottom: '30%', size: 'text-sm', color: 'text-pink-400', duration: '4.2s', delay: '0.4s', char: '✧' },
  { left: '75%', bottom: '18%', size: 'text-xl', color: 'text-sky-400', duration: '3.4s', delay: '1.2s', char: '✦' },
  { left: '88%', bottom: '32%', size: 'text-base', color: 'text-amber-400', duration: '3.8s', delay: '2s', char: '✧' },
];

// 進捗に合わせて切り替わるメッセージ
const MESSAGES = [
  { threshold: 0, text: 'ステージの準備をしています…' },
  { threshold: 35, text: 'ペンライトを充電中…' },
  { threshold: 65, text: '推しの最新情報を集めています…' },
  { threshold: 90, text: 'まもなく開演！' },
];

const getMessage = (progress) => {
  let message = MESSAGES[0].text;
  for (const m of MESSAGES) {
    if (progress >= m.threshold) message = m.text;
  }
  return message;
};

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

  const message = getMessage(progress);
  const isReady = progress >= 100;

  // 背景クリックを無効化
  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    // 何もしない（ローディング中はクリック無効）
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-amber-50 overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* 舞い上がるキラキラ */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`absolute animate-sparkle-rise ${s.size} ${s.color} pointer-events-none`}
          style={{
            left: s.left,
            bottom: s.bottom,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        >
          {s.char}
        </span>
      ))}

      {/* ペンライトの列（ライブ会場風） */}
      <div className="flex items-end gap-5 mb-14 h-32">
        {PENLIGHTS.map((p, i) => (
          <div
            key={i}
            className="animate-penlight-wave"
            style={{ animationDelay: p.delay }}
          >
            {/* 発光チューブ */}
            <div
              className={`w-4 h-20 rounded-full bg-gradient-to-t ${p.tube} shadow-lg ${p.glow}`}
            />
            {/* 持ち手 */}
            <div className="w-3 h-6 mx-auto mt-0.5 rounded-b-md bg-gray-700" />
          </div>
        ))}
      </div>

      {/* タイトル */}
      <div className="text-center space-y-4 mb-10">
        <h2
          className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-amber-500 text-2xl animate-star-twinkle inline-block">✦</span>
          {isReady ? 'Ready!' : 'Loading'}
          <span
            className="text-sky-500 text-2xl animate-star-twinkle inline-block"
            style={{ animationDelay: '0.8s' }}
          >
            ✦
          </span>
        </h2>
        {/* 進捗メッセージ（切り替わるたびに弾んで登場） */}
        <p
          key={message}
          className="text-gray-600 tracking-wide text-sm animate-bounce-in"
        >
          {message}
        </p>
      </div>

      {/* プログレスバー */}
      <div className="w-80 max-w-md">
        <div className="relative h-3 bg-white/70 border border-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* プログレスバー本体 */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* バー内を走る光 */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
            </div>
          </div>
          {/* バー先端の星 */}
          <span
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-amber-500 text-sm animate-star-twinkle pointer-events-none"
            style={{ left: `${progress}%` }}
          >
            ★
          </span>
        </div>

        {/* パーセンテージ表示 */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-400 text-xs uppercase tracking-widest">
            {isReady ? "Let's go!" : 'Now loading'}
          </span>
          <span className="text-amber-600 font-semibold text-sm">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
