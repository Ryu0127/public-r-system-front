import React from 'react';

const APP_TITLE = '推し活サポート';

const HeroSection: React.FC = () => {
  return (
    <section className="text-center space-y-8 animate-fade-in">
      {/* バッジ */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-lg">
          <span className="text-amber-600 text-2xl">✦</span>
          <span className="text-amber-700 text-sm font-medium uppercase tracking-wider">
            R-SYSTEM
          </span>
          <span className="text-sky-600 text-2xl">✦</span>
        </div>
      </div>

      {/* タイトル */}
      <h1
        className="text-5xl md:text-6xl font-bold text-gray-800"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {APP_TITLE}
      </h1>

      {/* サブタイトル */}
      <p className="text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto">
        こちらのサイトは、推し活をサポートするためのファン作成サイトとなります。
      </p>

      {/* 装飾的な区切り線 */}
      <div className="flex items-center justify-center gap-3 opacity-40 pt-8">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400" />
        <div className="w-2 h-2 bg-amber-400 rounded-full" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400" />
      </div>
    </section>
  );
};

export default HeroSection;
