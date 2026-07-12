import React, { useLayoutEffect, useRef, useState } from 'react';

const APP_TITLE = 'ホロリスの推し活サポート';

/** イントロ演出のフェーズ（ロード完了後に順番に進行） */
export type IntroPhase =
  | 'title-reveal' // タイトルが画面中央で左右に展開
  | 'title-slide'  // タイトルが定位置へスライド
  | 'subtitle'     // サブタイトルが左から右に展開
  | 'sections'     // 各セクションが下からせり上がり
  | 'done';

const PHASE_ORDER: IntroPhase[] = [
  'title-reveal',
  'title-slide',
  'subtitle',
  'sections',
  'done',
];

/** phase が target 以降まで進んでいるか */
export const isPhaseReached = (phase: IntroPhase, target: IntroPhase): boolean =>
  PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf(target);

interface HeroSectionProps {
  introPhase: IntroPhase;
}

const HeroSection: React.FC<HeroSectionProps> = ({ introPhase }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [centerOffsetY, setCenterOffsetY] = useState(0);

  // マウント時にタイトルの定位置を測り、画面中央までのオフセットを計算
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCenterOffsetY(window.innerHeight / 2 - (rect.top + rect.height / 2));
  }, []);

  const isTitleCentered = introPhase === 'title-reveal';
  const showSubtitle = isPhaseReached(introPhase, 'subtitle');

  return (
    <section className="relative text-center space-y-8">
      {/* タイトル周りのキラキラ（狭い画面ではタイトルと被るため非表示） */}
      <div className={showSubtitle ? 'animate-fade-in' : 'opacity-0'}>
        <span className="hidden lg:block absolute -top-6 left-[20%] text-amber-400 text-2xl animate-star-twinkle pointer-events-none">✦</span>
        <span
          className="hidden lg:block absolute top-16 right-[15%] text-sky-400 text-xl animate-star-twinkle pointer-events-none"
          style={{ animationDelay: '0.5s' }}
        >
          ✧
        </span>
        <span
          className="hidden lg:block absolute top-32 left-[10%] text-emerald-400 text-lg animate-star-twinkle pointer-events-none"
          style={{ animationDelay: '1s' }}
        >
          ✦
        </span>
      </div>

      {/* バッジ */}
      <div className={`flex justify-center ${showSubtitle ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-lg animate-float-soft">
          <span className="text-amber-600 text-2xl animate-star-twinkle inline-block">✦</span>
          <span className="text-amber-700 text-sm font-medium uppercase tracking-wider">
            R-SYSTEM
          </span>
          <span
            className="text-sky-600 text-2xl animate-star-twinkle inline-block"
            style={{ animationDelay: '0.8s' }}
          >
            ✦
          </span>
        </div>
      </div>

      {/* タイトル（中央で左右に展開 → 定位置へスライド） */}
      <h1
        ref={titleRef}
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent animate-gradient-text leading-relaxed py-2 animate-reveal-center-x"
        style={{
          fontFamily: "'Playfair Display', serif",
          transform: `translateY(${isTitleCentered ? centerOffsetY : 0}px)`,
          transition: isTitleCentered
            ? 'none'
            : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {APP_TITLE}
      </h1>

      {/* サブタイトル（左から右に展開） */}
      <p
        className={`text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto ${
          showSubtitle ? 'animate-reveal-ltr' : 'opacity-0'
        }`}
      >
        こちらのサイトは、推し活をサポートするためのファン作成サイトとなります。
      </p>

      {/* 装飾的な区切り線 */}
      <div className={showSubtitle ? 'animate-fade-in' : 'opacity-0'}>
        <div className="flex items-center justify-center gap-3 opacity-40 pt-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400" />
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
