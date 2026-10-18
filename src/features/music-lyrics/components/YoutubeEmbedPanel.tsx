import React from 'react';
import SectionCard from 'components/atoms/SectionCard';
import { isValidYoutubeVideoId } from 'features/talent-music/utils/youtubeVideoId';

interface YoutubeEmbedPanelProps {
  videoId: string;
  title: string;
  isVisible: boolean;
  onToggleVisible: () => void;
}

/**
 * 歌詞と並べて再生できる YouTube 埋め込みプレイヤー（表示/非表示切り替え可）
 */
export const YoutubeEmbedPanel: React.FC<YoutubeEmbedPanelProps> = ({
  videoId,
  title,
  isVisible,
  onToggleVisible,
}) => {
  if (!isValidYoutubeVideoId(videoId)) {
    return null;
  }

  const id = videoId.trim();

  return (
    <SectionCard className="p-3 md:p-4">
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <span className="text-sm font-semibold text-gray-700">動画プレイヤー</span>
        <div className="flex items-center gap-3">
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline underline-offset-2"
          >
            YouTubeで開く
          </a>
          <button
            type="button"
            onClick={onToggleVisible}
            aria-expanded={isVisible}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-2"
          >
            {isVisible ? '動画を隠す' : '動画を表示'}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </SectionCard>
  );
};
