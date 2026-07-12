import React from 'react';
import TalentAvatar from 'components/atoms/TalentAvatar';

/** アイコン付き表示に必要な最小限のタレント情報 */
interface BadgeTalent {
  id: string;
  talentName: string;
  iconImgUrl?: string;
}

interface SelectionModeFloatingBadgeProps {
  /** アイコン付きで表示するタレント（グループ等アイコンなしの場合は省略して name を指定） */
  talent?: BadgeTalent;
  /** talent 未指定時に表示する名前（例: グループ名） */
  name?: string;
  /** モード名（例: タレント選択モード / グループ選択モード） */
  modeLabel?: string;
  onClear: () => void;
  /** 表示位置（画面下部の固定ボタン等と重なる画面ではオフセットを指定） */
  positionClass?: string;
}

/**
 * 選択モードの固定表示（画面右下からスライドイン）
 * タレント/グループ選択モード中であることを画面をまたいで示す共通バッジ
 */
const SelectionModeFloatingBadge: React.FC<SelectionModeFloatingBadgeProps> = ({
  talent,
  name,
  modeLabel = 'タレント選択モード',
  onClear,
  positionClass = 'bottom-6 right-4 md:right-6',
}) => {
  const displayName = talent?.talentName ?? name ?? '';

  return (
    // key で選択切り替え時にもスライドインし直す
    <div
      key={talent?.id ?? displayName}
      className={`fixed ${positionClass} z-40 animate-slide-in-corner`}
    >
      <div className="flex items-center gap-3 pl-3 pr-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-amber-300 rounded-2xl shadow-2xl">
        {talent && (
          <TalentAvatar
            id={talent.id}
            name={talent.talentName}
            iconImgUrl={talent.iconImgUrl}
            sizeClass="w-12 h-12"
            initialTextClass="text-lg"
          />
        )}
        <div className="text-left min-w-0">
          <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
            <span className="animate-star-twinkle inline-block">✦</span>
            {modeLabel}
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate max-w-[9rem]">
            {displayName}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="選択を解除"
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelectionModeFloatingBadge;
