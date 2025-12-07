import React from 'react';
import { CollabVideo } from '../types';
import CardYoutubeVideo, { Video } from 'components/molecules/cards/CardYoutubeVideo';

interface VideoListProps {
  videos: CollabVideo[];
  isLoading: boolean;
  baseTalentName?: string;
  collaboratorName?: string;
}

export const VideoList: React.FC<VideoListProps> = ({
  videos,
  isLoading,
  baseTalentName,
  collaboratorName,
}) => {
  // CollabVideoをCardYoutubeVideoのVideo型に変換
  const convertToCardVideo = (collabVideo: CollabVideo, index: number): Video => {
    return {
      index,
      id: collabVideo.id,
      videoCode: collabVideo.videoCode,
      videoTitle: collabVideo.videoTitle,
      videoUrl: collabVideo.videoUrl,
      videoTime: collabVideo.videoTime,
      videoImgPath: collabVideo.videoImgPath,
      favoriteFlag: collabVideo.favoriteFlag || false,
    };
  };

  // 配信日時を日本語表記に変換
  const formatPublishedAt = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!baseTalentName || !collaboratorName) {
    return (
      <div className="text-center py-20">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg">メインタレントとコラボタレントを選択してください</p>
        <p className="text-gray-400 text-sm mt-2">
          選択すると、該当するコラボ配信のアーカイブが表示されます
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 text-lg">コラボ配信が見つかりませんでした</p>
        <p className="text-gray-400 text-sm mt-2">
          {baseTalentName} × {collaboratorName} のコラボ動画はまだ登録されていません
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          コラボ配信アーカイブ
        </h2>
        <p className="text-gray-600">
          {baseTalentName} × {collaboratorName} のコラボ配信（全{videos.length}件）
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:scale-105 transition-transform duration-200"
          >
            <div className="relative">
              <CardYoutubeVideo object={convertToCardVideo(video, index)} />
              <div className="mt-2 px-2">
                <p className="text-xs text-gray-500">
                  配信日: {formatPublishedAt(video.publishedAt)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
