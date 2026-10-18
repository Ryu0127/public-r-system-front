import React, { useState } from 'react';

interface MusicThumbProps {
  youtubeVideoId: string;
}

/** 管理画面用の小さな YouTube サムネイル（取得失敗時はプレースホルダ） */
const MusicThumb: React.FC<MusicThumbProps> = ({ youtubeVideoId }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-16 h-9 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
      {youtubeVideoId && !hasError ? (
        <img
          src={`https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10px] text-red-400 bg-red-50">
          YouTube
        </div>
      )}
    </div>
  );
};

export default MusicThumb;
