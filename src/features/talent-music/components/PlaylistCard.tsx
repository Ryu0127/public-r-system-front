import React from 'react';
import { MusicPlaylist } from '../types';

const PlaylistIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M3 6h12v2H3V6zm0 4h12v2H3v-2zm0 4h8v2H3v-2zm14-4v8l6-4-6-4z" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface PlaylistCardProps {
  playlist: MusicPlaylist;
}

/**
 * YouTube プレイリストカード
 * 楽曲カードが3枚重なったような見た目。グレー背景の中央にプレイリスト名を表示
 * クリックで YouTube のプレイリストを新しいタブで開く
 */
export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => (
  <a
    href={playlist.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${playlist.name}（YouTubeでプレイリストを開く）`}
    className="group relative block pt-4"
  >
    {/* 背面のカード（奥） */}
    <div
      className="absolute inset-x-6 top-0 aspect-[11/6] rounded-2xl bg-gray-300/70 border border-gray-200 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none"
      aria-hidden
    />
    {/* 背面のカード（中間） */}
    <div
      className="absolute inset-x-3 top-2 aspect-[11/6] rounded-2xl bg-gray-300 border border-gray-200 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none"
      aria-hidden
    />

    {/* 前面のカード */}
    <div className="relative aspect-[11/6] rounded-2xl bg-gray-200 border border-gray-300 shadow-md overflow-hidden transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-0.5 motion-reduce:transition-none">
      {/* ラベル */}
      <span className="absolute top-2 left-2 px-3 py-0.5 text-xs font-bold tracking-wider rounded-full shadow-md bg-gray-700 text-white">
        プレイリスト
      </span>

      {/* プレイリスト名（中央） */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
        <PlaylistIcon className="w-7 h-7 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
        <span className="font-bold text-gray-700 text-lg leading-snug tracking-wider line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
          {playlist.name}
        </span>
      </div>

      {/* 外部リンク表示 */}
      <span className="absolute bottom-2 right-3 inline-flex items-center gap-1 text-sm font-medium tracking-wide text-gray-600 group-hover:text-red-600 transition-colors duration-200">
        YouTubeで開く
        <ExternalIcon />
      </span>
    </div>
  </a>
);
