import React, { useState } from 'react';
import { Music } from '../types';

interface MusicCardProps {
  music: Music;
}

const YOUTUBE_THUMBNAIL_URL = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const YOUTUBE_VIDEO_URL = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;

export const MusicCard: React.FC<MusicCardProps> = ({ music }) => {
  const [thumbnailError, setThumbnailError] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <a
      href={YOUTUBE_VIDEO_URL(music.youtubeVideoId)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* サムネイル */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!thumbnailError ? (
          <img
            src={YOUTUBE_THUMBNAIL_URL(music.youtubeVideoId)}
            alt={music.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setThumbnailError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
            <svg className="w-12 h-12 text-red-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
            </svg>
            <span className="text-xs text-red-400">YouTube</span>
          </div>
        )}

        {/* 再生ボタンオーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* カード情報 */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
          {music.title}
        </h3>
        {music.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{music.description}</p>
        )}
        <p className="text-xs text-gray-400">{formatDate(music.releaseDate)}</p>
      </div>
    </a>
  );
};
