import React, { useEffect, useRef, useState } from 'react';
import { Music } from 'features/talent-music/types';
import SectionTitle from 'components/molecules/SectionTitle';

const YOUTUBE_THUMBNAIL_URL = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const YOUTUBE_VIDEO_URL = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;

const MUSIC_LIST_PATH = '/music';

/** 1枚分のスライド量: カード幅 w-64 (256px) + gap-6 (24px) */
const CARD_STEP = 280;
/** 自動スクロール速度 (px/秒) */
const AUTO_SCROLL_SPEED = 70;

// 楽曲タイプバッジのスタイル
const typeBadgeClasses: { [key: string]: string } = {
  original: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
  cover: 'bg-gradient-to-r from-sky-400 to-sky-500 text-white',
};

const typeBadgeLabels: { [key: string]: string } = {
  original: 'オリジナル',
  cover: 'カバー',
};

// マーキー内の楽曲カード
const ShowcaseCard: React.FC<{ music: Music; ariaHidden?: boolean }> = ({
  music,
  ariaHidden = false,
}) => (
  <a
    href={YOUTUBE_VIDEO_URL(music.youtubeVideoId)}
    target="_blank"
    rel="noopener noreferrer"
    aria-hidden={ariaHidden}
    tabIndex={ariaHidden ? -1 : 0}
    className="group flex-shrink-0 w-64 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    {/* サムネイル */}
    <div className="relative aspect-video bg-gray-100 overflow-hidden">
      <img
        src={YOUTUBE_THUMBNAIL_URL(music.youtubeVideoId)}
        alt={ariaHidden ? '' : music.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* タイプバッジ */}
      <span
        className={`absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full shadow-md ${
          typeBadgeClasses[music.type] ?? typeBadgeClasses.original
        }`}
      >
        {typeBadgeLabels[music.type] ?? typeBadgeLabels.original}
      </span>
      {/* 再生ボタンオーバーレイ */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>

    {/* カード情報 */}
    <div className="p-3">
      <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
        {music.title}
      </h3>
    </div>
  </a>
);

interface MusicShowcaseSectionProps {
  musicList: Music[];
}

const MusicShowcaseSection: React.FC<MusicShowcaseSectionProps> = ({ musicList }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  /** 現在のスクロール位置 (px) */
  const positionRef = useRef(0);
  /** ボタン押下によるスライドの残り移動量 (px) */
  const tweenRemainingRef = useRef(0);
  /** ホバー中は自動スクロールを一時停止 */
  const isHoveredRef = useRef(false);
  /** スライドボタンの表示制御（カード側の group-hover と干渉しないよう state で管理） */
  const [isHovered, setIsHovered] = useState(false);
  /**
   * リストの複製数。曲数が少なくても「画面幅 + 1セット分」を覆えるように
   * 画面幅から計算する（足りないとループの巻き戻しで空白が見えてしまう）
   */
  const [repeatCount, setRepeatCount] = useState(2);
  const repeatCountRef = useRef(repeatCount);
  repeatCountRef.current = repeatCount;

  // 1セット分の幅を測り、必要な複製数を計算（リサイズ時も再計算）
  useEffect(() => {
    if (musicList.length === 0) return;

    const compute = () => {
      const track = trackRef.current;
      if (!track || track.children.length <= musicList.length) return;
      const first = track.children[0] as HTMLElement;
      const secondSetStart = track.children[musicList.length] as HTMLElement;
      const setWidth = secondSetStart.offsetLeft - first.offsetLeft;
      if (setWidth <= 0) return;
      const needed = Math.max(2, Math.ceil(window.innerWidth / setWidth) + 1);
      setRepeatCount((prev) => (prev === needed ? prev : needed));
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [musicList.length]);

  // 自動スクロール + ボタンスライドを requestAnimationFrame で駆動
  // （リストを複数セット並べ、1セット分を超えたら巻き戻して無限ループに見せる）
  useEffect(() => {
    if (musicList.length === 0) return;

    let rafId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const track = trackRef.current;
      if (track) {
        const setWidth = track.scrollWidth / repeatCountRef.current;
        if (setWidth > 0) {
          if (tweenRemainingRef.current !== 0) {
            // ボタン押下分をイージングしながら消化
            let delta = tweenRemainingRef.current * Math.min(1, dt * 8);
            if (Math.abs(tweenRemainingRef.current) < 1) {
              delta = tweenRemainingRef.current;
            }
            positionRef.current += delta;
            tweenRemainingRef.current -= delta;
          } else if (!isHoveredRef.current) {
            positionRef.current += AUTO_SCROLL_SPEED * dt;
          }

          // 1セット分でループ（負方向へのスライドにも対応）
          positionRef.current =
            ((positionRef.current % setWidth) + setWidth) % setWidth;
          track.style.transform = `translateX(${-positionRef.current}px)`;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [musicList.length]);

  if (musicList.length === 0) {
    return null;
  }

  const slide = (direction: 1 | -1) => {
    tweenRemainingRef.current += direction * CARD_STEP;
  };

  return (
    <section className="space-y-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* セクションタイトル */}
      <SectionTitle en="Music" ja="楽曲ピックアップ" />

      {/* 自動横スクロールカルーセル（画面幅いっぱいに表示） */}
      <div
        className="relative left-1/2 -ml-[50vw] w-screen"
        onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
        onMouseLeave={() => { isHoveredRef.current = false; setIsHovered(false); }}
      >
        <div className="relative overflow-hidden py-2">
          {/* 左右のフェード（スカイブルー帯の背景に合わせる） */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sky-50/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sky-50/90 to-transparent z-10 pointer-events-none" />

          {/* トラック（必要セット数だけ複製して無限ループに見せる） */}
          <div ref={trackRef} className="flex gap-6 w-max will-change-transform">
            {Array.from({ length: repeatCount }, (_, setIndex) =>
              musicList.map((music) => (
                <ShowcaseCard
                  key={`${setIndex}-${music.id}`}
                  music={music}
                  ariaHidden={setIndex > 0}
                />
              ))
            )}
          </div>
        </div>

        {/* 左右スライドボタン（ホバー時に表示。タッチ端末では常時表示） */}
        <button
          type="button"
          aria-label="前の楽曲へスライド"
          onClick={() => slide(-1)}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 hover:scale-110 active:scale-95 transition-all duration-200 opacity-100 md:focus-visible:opacity-100 ${
            isHovered ? 'md:opacity-100' : 'md:opacity-0'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="次の楽曲へスライド"
          onClick={() => slide(1)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 hover:scale-110 active:scale-95 transition-all duration-200 opacity-100 md:focus-visible:opacity-100 ${
            isHovered ? 'md:opacity-100' : 'md:opacity-0'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 楽曲一覧への導線 */}
      <div className="text-center">
        <a
          href={MUSIC_LIST_PATH}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all duration-300"
        >
          <span className="text-xl">♪</span>
          <span>楽曲一覧をもっと見る</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </a>
      </div>
    </section>
  );
};

export default MusicShowcaseSection;
