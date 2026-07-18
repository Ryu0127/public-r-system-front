import React from 'react';

export type AttractionThumbIcon =
  | 'castle'
  | 'robot'
  | 'splash'
  | 'coaster'
  | 'ghost'
  | 'space'
  | 'ship'
  | 'boat'
  | 'spin'
  | 'teacup'
  | 'train'
  | 'bird'
  | 'ufo'
  | 'music';

interface AttractionThumbProps {
  icon: AttractionThumbIcon | string;
  rank: 'S' | 'A' | 'B' | 'C';
  thumbUrl?: string | null;
}

const RANK_COLOR: Record<string, string> = {
  S: '#B79BF2',
  A: '#FF9A6B',
  B: '#F5C86B',
  C: '#8ED07A',
};

const BG = '#141B3C';

/**
 * アトラクション用サムネイル
 * APIから渡された公式画像 + 読めない環境用のランク色SVGフォールバック
 */
const AttractionThumb: React.FC<AttractionThumbProps> = ({
  icon,
  rank,
  thumbUrl,
}) => {
  const color = RANK_COLOR[rank] ?? '#F5C86B';

  return (
    <div className="athumb" aria-hidden="true">
      <svg viewBox="0 0 84 63" xmlns="http://www.w3.org/2000/svg">
        <rect width="84" height="63" fill={BG} />
        {renderMotif(icon, color)}
      </svg>
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

const renderMotif = (icon: string, c: string): React.ReactNode => {
  switch (icon) {
    case 'castle':
      return (
        <>
          <path
            d="M18 63 V45 h7 V36 h5 V45 h7 V30 h5 v-8 l4-7 4 7 v8 h5 v15 h7 V36 h5 V45 h7 V63 Z"
            fill={c}
            opacity=".85"
          />
          <circle cx="14" cy="12" r="2" fill={c} />
          <circle cx="70" cy="9" r="2.4" fill={c} />
        </>
      );
    case 'robot':
      return (
        <>
          <circle cx="42" cy="30" r="16" fill="none" stroke={c} strokeWidth="3" />
          <circle cx="35" cy="30" r="2.6" fill={c} />
          <circle cx="49" cy="30" r="2.6" fill={c} />
          <path d="M35 30 h14" stroke={c} strokeWidth="2" />
          <path
            d="M18 55 q12-8 24 0 t24 0"
            stroke={c}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'splash':
      return (
        <>
          <path d="M-2 52 Q20 42 42 52 T88 52 V63 H-2 Z" fill={c} opacity=".5" />
          <path
            d="M22 44 Q30 18 38 44"
            stroke={c}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M46 40 Q56 12 66 40"
            stroke={c}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="28" cy="14" r="2.6" fill={c} />
          <circle cx="60" cy="8" r="2.2" fill={c} />
          <circle cx="72" cy="22" r="3" fill={c} />
        </>
      );
    case 'coaster':
      return (
        <>
          <path
            d="M0 55 L20 28 L34 44 L50 18 L66 40 L84 24"
            stroke={c}
            strokeWidth="3"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M0 63 L20 36 L34 52 L50 26 L66 48 L84 32 V63 Z"
            fill={c}
            opacity=".3"
          />
        </>
      );
    case 'ghost':
      return (
        <>
          <rect x="24" y="26" width="36" height="30" fill={c} opacity=".7" />
          <path d="M24 26 L42 12 L60 26 Z" fill={c} />
          <rect x="38" y="40" width="8" height="16" fill={BG} />
          <circle cx="68" cy="12" r="6" fill={c} opacity=".9" />
        </>
      );
    case 'space':
      return (
        <>
          <path d="M14 46 L70 20" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <path d="M62 14 l14 6 -12 8 Z" fill={c} />
          <circle cx="18" cy="14" r="2" fill={c} />
          <circle cx="36" cy="52" r="2.4" fill={c} />
          <circle cx="70" cy="46" r="1.8" fill={c} />
          <circle cx="50" cy="8" r="1.6" fill={c} />
        </>
      );
    case 'ship':
      return (
        <>
          <circle cx="62" cy="14" r="8" fill={c} opacity=".55" />
          <path d="M22 44 h34 l-6 9 H27 Z" fill={c} />
          <path d="M39 44 V20 l14 18 h-14" fill={c} opacity=".8" />
          <path d="M39 24 l-11 15 h11" fill={c} opacity=".55" />
        </>
      );
    case 'boat':
      return (
        <>
          <path d="M-2 52 Q20 46 42 52 T88 52 V63 H-2 Z" fill={c} opacity=".4" />
          <path d="M22 46 h40 l-7 10 H28 Z" fill={c} />
          <rect x="40" y="30" width="4" height="16" fill={c} />
          <path d="M44 30 l12 10 h-12" fill={c} opacity=".7" />
        </>
      );
    case 'spin':
      return (
        <>
          <path
            d="M42 32 m0 -16 a16 16 0 1 1 -12 27"
            stroke={c}
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M26 40 l6 6 -9 2 Z" fill={c} />
          <circle cx="42" cy="32" r="4" fill={c} />
        </>
      );
    case 'teacup':
      return (
        <>
          <path
            d="M24 26 h32 v10 a16 12 0 0 1 -32 0 Z"
            fill={c}
            opacity=".85"
          />
          <path
            d="M56 28 h7 a6 6 0 0 1 0 12 h-5"
            stroke={c}
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="40" cy="54" rx="20" ry="3.4" fill={c} opacity=".35" />
          <path
            d="M34 18 q2-5 0-9 M44 18 q2-5 0-9"
            stroke={c}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'train':
      return (
        <>
          <rect x="16" y="28" width="30" height="16" rx="3" fill={c} />
          <rect x="46" y="20" width="16" height="24" rx="3" fill={c} opacity=".85" />
          <circle cx="24" cy="50" r="4.4" fill={c} />
          <circle cx="38" cy="50" r="4.4" fill={c} />
          <circle cx="56" cy="50" r="4.4" fill={c} />
          <circle cx="16" cy="16" r="3.4" fill={c} opacity=".5" />
          <circle cx="10" cy="9" r="2.4" fill={c} opacity=".35" />
        </>
      );
    case 'bird':
      return (
        <>
          <path
            d="M34 40 a10 12 0 1 1 20 0 q0 10 -10 14 q-10 -4 -10 -14 Z"
            fill={c}
            opacity=".85"
          />
          <circle cx="44" cy="30" r="7" fill={c} />
          <path d="M51 30 l7 3 -7 3 Z" fill={c} opacity=".9" />
          <path
            d="M24 44 q-8 2 -12 8 M60 44 q8 2 12 8"
            stroke={c}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'ufo':
      return (
        <>
          <ellipse cx="42" cy="34" rx="22" ry="8" fill={c} opacity=".8" />
          <path d="M30 30 a12 10 0 0 1 24 0" fill={c} opacity=".55" />
          <circle cx="30" cy="34" r="2" fill={BG} />
          <circle cx="42" cy="36" r="2" fill={BG} />
          <circle cx="54" cy="34" r="2" fill={BG} />
          <path
            d="M34 46 l-4 8 M50 46 l4 8"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case 'music':
      return (
        <>
          <path
            d="M34 46 V22 l22 -5 v24"
            stroke={c}
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="29" cy="46" r="5.4" fill={c} />
          <circle cx="51" cy="41" r="5.4" fill={c} />
          <circle cx="16" cy="16" r="2" fill={c} opacity=".6" />
          <circle cx="68" cy="14" r="2.4" fill={c} opacity=".6" />
        </>
      );
    default:
      return <circle cx="42" cy="32" r="12" fill={c} opacity=".5" />;
  }
};

export default AttractionThumb;
