import React from 'react';

interface FoodThumbProps {
  icon: string;
  thumbUrl?: string | null;
}

const C = '#F5C86B';
const A = '#5FD8D2';
const R = '#FF7E6B';
const BG = '#141B3C';

/**
 * フードメニュー用サムネイル
 * APIの thumbUrl を優先表示し、失敗時は SVG アイコンにフォールバック
 */
const FoodThumb: React.FC<FoodThumbProps> = ({ icon, thumbUrl }) => {
  const src = thumbUrl?.trim() ? thumbUrl : null;

  return (
    <div className="fthumb" aria-hidden="true">
      <svg viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg">
        <rect width="76" height="76" fill={BG} />
        {renderMotif(icon)}
      </svg>
      {src ? (
        <img
          src={src}
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

const renderMotif = (icon: string): React.ReactNode => {
  switch (icon) {
    case 'curry':
      return (
        <>
          <ellipse cx="38" cy="48" rx="26" ry="9" fill={C} opacity=".35" />
          <path d="M16 44 a22 12 0 0 1 44 0 Z" fill={C} />
          <path
            d="M40 22 q4 -6 0 -10 M48 24 q4 -6 0 -10"
            stroke={A}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case 'plate':
      return (
        <>
          <circle
            cx="38"
            cy="42"
            r="24"
            fill="none"
            stroke={C}
            strokeWidth="3"
          />
          <circle cx="38" cy="42" r="15" fill={C} opacity=".55" />
          <circle cx="33" cy="39" r="2.4" fill={BG} />
          <circle cx="43" cy="39" r="2.4" fill={BG} />
          <path d="M33 39 h10" stroke={BG} strokeWidth="1.6" />
        </>
      );
    case 'steak':
      return (
        <>
          <path
            d="M18 40 q-4 -14 12 -16 q22 -3 28 10 q5 12 -8 16 q-24 7 -32 -10 Z"
            fill={R}
            opacity=".85"
          />
          <path
            d="M26 36 q10 -6 22 0"
            stroke={BG}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="58" cy="58" r="2.4" fill={A} />
          <circle cx="18" cy="58" r="2.4" fill={C} />
        </>
      );
    case 'parfait':
      return (
        <>
          <path d="M24 20 h28 l-6 26 h-16 Z" fill={A} opacity=".5" />
          <path d="M24 20 h28 l-2 9 h-24 Z" fill={R} opacity=".8" />
          <circle cx="38" cy="16" r="5" fill={C} />
          <rect x="35" y="46" width="6" height="10" fill={C} />
          <rect x="28" y="56" width="20" height="4" rx="2" fill={C} />
        </>
      );
    case 'ice':
      return (
        <>
          <circle cx="38" cy="34" r="17" fill="#EDEFFA" opacity=".9" />
          <circle cx="32" cy="33" r="2.6" fill={BG} />
          <circle cx="44" cy="33" r="2.6" fill={BG} />
          <path d="M32 33 h12" stroke={BG} strokeWidth="1.8" />
          <path d="M28 52 h20 l-4 12 h-12 Z" fill={A} />
        </>
      );
    case 'drink':
      return (
        <>
          <path d="M28 18 h20 l-4 38 h-12 Z" fill={A} opacity=".55" />
          <path d="M29 26 h18 l-1 8 h-16 Z" fill={C} opacity=".8" />
          <circle cx="34" cy="44" r="2" fill="#EDEFFA" />
          <circle cx="41" cy="38" r="1.6" fill="#EDEFFA" />
          <path
            d="M46 20 l8 -8"
            stroke={R}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      );
    case 'waffle':
      return (
        <>
          <circle cx="38" cy="44" r="16" fill={C} />
          <circle cx="24" cy="30" r="8" fill={C} />
          <circle cx="52" cy="30" r="8" fill={C} />
          <path
            d="M30 40 l16 8 M30 48 l16 -8 M38 36 v16"
            stroke={BG}
            strokeWidth="1.6"
          />
        </>
      );
    case 'bun':
      return (
        <>
          <path
            d="M18 48 a20 16 0 0 1 40 0 Z"
            fill="#8ED07A"
            opacity=".85"
          />
          <ellipse
            cx="38"
            cy="48"
            rx="20"
            ry="4"
            fill="#8ED07A"
            opacity=".5"
          />
          <circle cx="30" cy="38" r="1.8" fill={BG} />
          <circle cx="46" cy="38" r="1.8" fill={BG} />
          <path
            d="M34 43 q4 3 8 0"
            stroke={BG}
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M36 26 l2 -6 l2 6"
            stroke="#8ED07A"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case 'churro':
      return (
        <>
          <path
            d="M24 58 L52 18"
            stroke={C}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M24 58 L52 18"
            stroke={BG}
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
          <circle cx="20" cy="24" r="1.8" fill={C} />
          <circle cx="56" cy="52" r="1.8" fill={C} />
        </>
      );
    case 'popcorn':
      return (
        <>
          <path d="M26 34 h24 l-3 24 h-18 Z" fill={R} opacity=".8" />
          <path
            d="M30 34 v24 M38 34 v24 M46 34 v24"
            stroke={BG}
            strokeWidth="1.4"
          />
          <circle cx="30" cy="28" r="5" fill="#EDEFFA" />
          <circle cx="39" cy="24" r="6" fill="#EDEFFA" />
          <circle cx="47" cy="29" r="5" fill="#EDEFFA" />
        </>
      );
    default:
      return renderMotif('plate');
  }
};

export default FoodThumb;
