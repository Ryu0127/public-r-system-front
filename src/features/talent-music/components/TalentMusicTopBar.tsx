import React from 'react';
import TalentAvatar from 'components/atoms/TalentAvatar';
import { markSkipHomeLoading } from 'utils/homeTransition';
import { MusicTalent, MusicTalentGroup } from '../types';

/**
 * サイトアイコン（ブラウザのタブに表示している favicon と同じ絵柄）
 * favicon.ico は小さいサイズ向けのため、高解像度画面でも粗くならない logo192.png を使用
 */
const SITE_ICON_SRC = `${process.env.PUBLIC_URL}/logo192.png`;

/**
 * ヘッダーの高さ（64px）と、ヘッダー直下に要素を配置する場合の top 位置
 * ※ Tailwind はクラス名を静的に検出するため、値を変える場合は両方をそろえて書き換えること
 */
const TOP_BAR_HEIGHT_CLASS = 'h-16';
export const TALENT_MUSIC_TOP_BAR_OFFSET_CLASS = 'top-16';

const UsersIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface TalentMusicTopBarProps {
  selectedTalent: MusicTalent | null;
  selectedGroup: MusicTalentGroup | null;
  onOpenModal: () => void;
  onReset: () => void;
}

/**
 * 楽曲一覧画面の上部固定ヘッダー
 * 左: ホームへのリンク / 右: タレント・グループ選択
 */
export const TalentMusicTopBar: React.FC<TalentMusicTopBarProps> = ({
  selectedTalent,
  selectedGroup,
  onOpenModal,
  onReset,
}) => {
  const hasSelection = !!selectedTalent || !!selectedGroup;
  const selectionLabel = selectedTalent
    ? selectedTalent.talentName || selectedTalent.talentNameJoin
    : selectedGroup
    ? selectedGroup.groupName
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className={`flex items-center gap-3 ${TOP_BAR_HEIGHT_CLASS} px-4 md:px-8`}>
        {/* ホームへ */}
        <a
          href="/"
          onClick={markSkipHomeLoading}
          className="flex items-center gap-2 min-w-0 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="ホームへ戻る"
        >
          <img
            src={SITE_ICON_SRC}
            alt=""
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg shadow-sm flex-shrink-0"
          />
          <span
            className="hidden sm:inline text-base font-bold truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ホロリスの推し活サポート
          </span>
        </a>

        {/* タレント・グループ選択 */}
        <div className="ml-auto flex items-center gap-2 min-w-0">
          <span className="hidden lg:inline text-xs font-semibold text-gray-500 whitespace-nowrap">
            タレント・グループ
          </span>

          <button
            type="button"
            onClick={onOpenModal}
            aria-haspopup="dialog"
            aria-label={
              selectionLabel
                ? `タレント・グループを選択（選択中: ${selectionLabel}）`
                : 'タレント・グループを選択'
            }
            className={`flex items-center gap-2 min-w-0 max-w-[14rem] sm:max-w-xs h-10 pl-1.5 pr-3 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 ${
              hasSelection
                ? 'bg-white border-pink-300 text-gray-800 hover:border-pink-400 shadow-sm'
                : 'bg-gradient-to-r from-red-500 to-pink-600 border-transparent text-white hover:from-red-600 hover:to-pink-700 shadow-md pl-3'
            }`}
          >
            {selectedTalent ? (
              <TalentAvatar
                id={selectedTalent.id}
                name={selectedTalent.talentName || selectedTalent.talentNameJoin}
                iconImgUrl={selectedTalent.iconImgUrl}
                sizeClass="w-7 h-7"
                initialTextClass="text-xs"
              />
            ) : selectedGroup ? (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex-shrink-0">
                <UsersIcon />
              </span>
            ) : (
              <UsersIcon className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="truncate">{selectionLabel ?? 'タレント・グループ選択'}</span>
            <ChevronDownIcon />
          </button>

          {hasSelection && (
            <button
              type="button"
              onClick={onReset}
              aria-label="選択を解除"
              title="選択を解除"
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
