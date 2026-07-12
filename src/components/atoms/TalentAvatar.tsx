import React from 'react';

const AVATAR_COLORS = [
  'from-red-400 to-pink-500',
  'from-purple-400 to-indigo-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-teal-500',
  'from-yellow-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-violet-500',
  'from-teal-400 to-emerald-500',
  'from-orange-400 to-amber-500',
  'from-cyan-400 to-sky-500',
];

const getAvatarColor = (id: string): string => {
  const num = parseInt(id, 10);
  const idx = isNaN(num) ? 0 : num % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

interface TalentAvatarProps {
  /** ID（グラデーション色の決定に使用） */
  id: string;
  name: string;
  iconImgUrl?: string;
  /** サイズ（Tailwind の w-/h- クラス） */
  sizeClass?: string;
  /** イニシャル表示時のフォントサイズ */
  initialTextClass?: string;
}

/**
 * タレントアバター
 * iconImgUrl があれば画像、なければグラデーション＋イニシャルで表示
 */
const TalentAvatar: React.FC<TalentAvatarProps> = ({
  id,
  name,
  iconImgUrl,
  sizeClass = 'w-20 h-20',
  initialTextClass = 'text-xl',
}) => {
  if (iconImgUrl) {
    return (
      <img
        src={iconImgUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${getAvatarColor(id)} flex items-center justify-center text-white font-bold ${initialTextClass} shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}
    >
      {name.charAt(0)}
    </div>
  );
};

export default TalentAvatar;
