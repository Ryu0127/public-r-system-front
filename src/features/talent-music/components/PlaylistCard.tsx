import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MusicPlaylist } from '../types';

/** マウスを乗せてから楽曲一覧を開くまでの待ち時間（楽曲カードと同じ。素早く横切った時のちらつき防止） */
const HOVER_OPEN_DELAY_MS = 250;

const PlaylistIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M3 6h12v2H3V6zm0 4h12v2H3v-2zm0 4h8v2H3v-2zm14-4v8l6-4-6-4z" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface PlaylistCardProps {
  playlist: MusicPlaylist;
}

/**
 * YouTube プレイリストカード
 * - 楽曲カードが3枚重なったような見た目。グレー背景の中央にプレイリスト名を表示
 * - クリックで YouTube のプレイリストを新しいタブで開く
 * - マウスホバー / キーボードフォーカスで紐付け楽曲の一覧をカードの下に表示
 * - タッチ操作: 1回目のタップで一覧を表示、表示中のタップで YouTube を開く
 */
export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  /** カード押下時のポインター種別と、その時点の表示状態（タッチの1タップ目判定用） */
  const pressRef = useRef<{ pointerType: string; wasOpen: boolean } | null>(null);
  const listId = `playlist-${playlist.id}-tracks`;

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  // 表示中: カード外のタップ / Escape キーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => setIsOpen(true), HOVER_OPEN_DELAY_MS);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearHoverTimer();
    setIsOpen(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    // キーボード操作時のみ表示（クリック/タップ由来のフォーカスはポインター側で制御）
    let isKeyboardFocus = false;
    try {
      isKeyboardFocus = e.target.matches(':focus-visible');
    } catch {
      // :focus-visible 非対応環境ではフォーカスで表示しない
    }
    if (isKeyboardFocus) setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false);
  };

  const handleCardPointerDown = (e: React.PointerEvent) => {
    pressRef.current = { pointerType: e.pointerType, wasOpen: isOpen };
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const press = pressRef.current;
    pressRef.current = null;
    // タッチ/ペンの1タップ目は遷移せず楽曲一覧を表示する
    if (press && press.pointerType !== 'mouse' && !press.wasOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${isOpen ? 'z-30' : 'z-0'}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <a
        href={playlist.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${playlist.name}（YouTubeでプレイリストを開く・${playlist.musicCount}曲）`}
        aria-describedby={isOpen ? listId : undefined}
        onPointerDown={handleCardPointerDown}
        onClick={handleCardClick}
        className="group relative block pt-4"
      >
        {/* 背面のカード（奥） */}
        <div
          className={`absolute inset-x-6 top-0 aspect-[11/6] rounded-2xl bg-gray-300/70 border border-gray-200 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none ${
            isOpen ? '-translate-y-1.5' : ''
          }`}
          aria-hidden
        />
        {/* 背面のカード（中間） */}
        <div
          className={`absolute inset-x-3 top-2 aspect-[11/6] rounded-2xl bg-gray-300 border border-gray-200 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none ${
            isOpen ? '-translate-y-1' : ''
          }`}
          aria-hidden
        />

        {/* 前面のカード */}
        <div className="relative aspect-[11/6] rounded-2xl bg-gray-200 border border-gray-300 shadow-md overflow-hidden transition-all duration-300 ease-out group-hover:shadow-xl group-hover:-translate-y-0.5 motion-reduce:transition-none">
          {/* ラベル */}
          <span className="absolute top-2 left-2 px-3 py-0.5 text-xs font-bold tracking-wider rounded-full shadow-md bg-gray-700 text-white">
            プレイリスト
          </span>

          {/* 曲数 */}
          <span className="absolute top-2 right-3 text-xs font-semibold tracking-wide text-gray-600">
            {playlist.musicCount}曲
          </span>

          {/* プレイリスト名（中央） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
            <PlaylistIcon className="w-7 h-7 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
            <span className="font-bold text-gray-700 text-lg leading-snug tracking-wider line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
              {playlist.name}
            </span>
          </div>

          {/* 外部リンク表示 */}
          <span className="absolute bottom-2 right-3 inline-flex items-center gap-1 text-sm font-medium tracking-wide text-gray-600 group-hover:text-red-600 transition-colors duration-200">
            YouTubeで開く
            <ExternalIcon />
          </span>
        </div>
      </a>

      {/* 紐付け楽曲の一覧（カードとの間に隙間を作らないよう padding で間隔をとる） */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full pt-2 animate-fade-in" style={{ animationDuration: '0.2s' }}>
          <div
            id={listId}
            className="rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700 tracking-wide">収録曲</span>
              <span className="text-xs text-gray-500">{playlist.musicCount}曲</span>
            </div>
            {playlist.musicList.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500 tracking-wide">楽曲はまだ登録されていません</p>
            ) : (
              <ol className="max-h-72 overflow-y-auto py-1">
                {playlist.musicList.map((track, index) => (
                  <li key={track.id} className="flex items-baseline gap-3 px-4 py-1.5">
                    <span className="w-6 flex-shrink-0 text-right text-xs font-semibold text-gray-400">{index + 1}</span>
                    <span className="min-w-0 truncate text-sm text-gray-800 tracking-wide" title={track.title}>
                      {track.title}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
