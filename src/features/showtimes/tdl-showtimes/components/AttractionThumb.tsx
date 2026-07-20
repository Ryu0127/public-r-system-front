import React from 'react';

interface AttractionThumbProps {
  rank: 'S' | 'A' | 'B' | 'C' | null;
  thumbUrl?: string | null;
}

const RANK_COLOR: Record<string, string> = {
  S: '#B79BF2',
  A: '#FF9A6B',
  B: '#F5C86B',
  C: '#8ED07A',
};

/**
 * アトラクション用サムネイル（公式画像。無い場合はランク色のプレースホルダ）
 */
const AttractionThumb: React.FC<AttractionThumbProps> = ({ rank, thumbUrl }) => {
  const color = (rank && RANK_COLOR[rank]) || '#9AA3C7';

  return (
    <div className="athumb" aria-hidden="true">
      <div className="athumb-fallback" style={{ background: color }} />
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.remove();
          }}
        />
      ) : null}
    </div>
  );
};

export default AttractionThumb;
