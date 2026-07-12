import React from 'react';
import { Music } from 'features/talent-music/types';
import SectionTitle from 'components/molecules/SectionTitle';

const YOUTUBE_THUMBNAIL_URL = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const YOUTUBE_VIDEO_URL = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;

const MUSIC_LIST_PATH = '/music';

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
  if (musicList.length === 0) {
    return null;
  }

  return (
    <section className="space-y-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* セクションタイトル */}
      <SectionTitle en="Music" ja="楽曲ピックアップ" />

      {/* 自動横スクロールマーキー */}
      <div className="marquee-container relative overflow-hidden py-2">
        {/* 左右のフェード */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />

        {/* トラック（2セット並べて半分だけ移動し、無限ループに見せる） */}
        <div className="animate-marquee flex gap-6 w-max">
          {musicList.map((music) => (
            <ShowcaseCard key={`first-${music.id}`} music={music} />
          ))}
          {musicList.map((music) => (
            <ShowcaseCard key={`second-${music.id}`} music={music} ariaHidden />
          ))}
        </div>
      </div>

      {/* 楽曲一覧への導線 */}
      <div className="text-center">
        <button
          onClick={() => { window.location.href = MUSIC_LIST_PATH; }}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all duration-300"
        >
          <span className="text-xl">♪</span>
          <span>楽曲一覧をもっと見る</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>
    </section>
  );
};

export default MusicShowcaseSection;
