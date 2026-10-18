import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music } from '../types';

interface MusicCardProps {
  music: Music;
  /** 複数選択モード中か（カードのクリックで選択/解除。ホバー展開・リンクは無効） */
  selectionMode?: boolean;
  isSelected?: boolean;
  /** 選択順（1始まり。再生順として表示） */
  selectionOrder?: number;
  /** 選択上限到達などで選択できない */
  isSelectionDisabled?: boolean;
  onToggleSelect?: (music: Music) => void;
}

/** マウスを乗せてから情報パネルを展開するまでの待ち時間（素早く横切った時のちらつき防止） */
const HOVER_EXPAND_DELAY_MS = 250;

/** 通常時カード本文（タイトル欄）の余白 */
const CARD_BODY_CLASS = 'p-3';
/** タイトル: 2行分の高さを確保してカードの高さを揃える */
const TITLE_CLASS = 'text-base leading-snug tracking-wide line-clamp-2 min-h-[2.75rem]';

// 楽曲タイプバッジ（TOP 楽曲ピックアップと同じスタイル）
const TYPE_BADGE_CLASSES: Record<string, string> = {
  original: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
  cover: 'bg-gradient-to-r from-sky-400 to-sky-500 text-white',
};

const TYPE_BADGE_LABELS: Record<string, string> = {
  original: 'オリジナル',
  cover: 'カバー',
};

/**
 * サムネイル画像（330×180 表示 + ホバー拡大に耐える解像度として hqdefault 480×360 を使用）
 * hqdefault は 16:9 動画の上下に黒帯を含むが、11:6 で object-cover 表示すると黒帯は表示範囲外になる
 */
const YOUTUBE_THUMBNAIL_URL = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const YOUTUBE_VIDEO_URL = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;

const formatDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const PlayIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
  </svg>
);

const LyricsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

/**
 * 楽曲カード（動画配信サービス風）
 * - 通常時: サムネイル画像のみ
 * - マウスホバー / キーボードフォーカス: カードを拡大し、下に楽曲情報パネルを展開
 * - タッチ操作: 1回目のタップで情報を展開、展開中のタップで YouTube を開く
 * - 複数選択モード: カードのクリックで選択/解除（選択順の番号を表示）
 */
export const MusicCard: React.FC<MusicCardProps> = ({
  music,
  selectionMode = false,
  isSelected = false,
  selectionOrder,
  isSelectionDisabled = false,
  onToggleSelect,
}) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  /** サムネイル押下時のポインター種別と、その時点の展開状態（タッチの1タップ目判定用） */
  const pressRef = useRef<{ pointerType: string; wasExpanded: boolean } | null>(null);

  const releaseDateLabel = formatDate(music.releaseDate);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  // 複数選択モードに入ったら情報パネルを閉じる
  useEffect(() => {
    if (!selectionMode) return;
    clearHoverTimer();
    setIsExpanded(false);
  }, [selectionMode, clearHoverTimer]);

  // 展開中: カード外のタップ / Escape キーで閉じる
  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (selectionMode || e.pointerType !== 'mouse') return;
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => setIsExpanded(true), HOVER_EXPAND_DELAY_MS);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearHoverTimer();
    setIsExpanded(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (selectionMode) return;
    // キーボード操作時のみ展開（クリック/タップ由来のフォーカスはポインター側で制御）
    let isKeyboardFocus = false;
    try {
      isKeyboardFocus = e.target.matches(':focus-visible');
    } catch {
      // :focus-visible 非対応環境ではフォーカスで展開しない（ホバー/タップで展開可能）
    }
    if (isKeyboardFocus) {
      setIsExpanded(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsExpanded(false);
    }
  };

  const handleThumbnailPointerDown = (e: React.PointerEvent) => {
    pressRef.current = { pointerType: e.pointerType, wasExpanded: isExpanded };
  };

  const handleThumbnailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const press = pressRef.current;
    pressRef.current = null;
    // タッチ/ペンの1タップ目は遷移せず情報を展開する
    if (press && press.pointerType !== 'mouse' && !press.wasExpanded) {
      e.preventDefault();
      setIsExpanded(true);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${isExpanded ? 'z-30' : 'z-0'}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* グリッド上の占有サイズ（通常時のカードと同じ高さ）。展開時はカード本体だけが下に伸びて重なる */}
      <div className="invisible" aria-hidden>
        <div className="aspect-[11/6]" />
        <div className={CARD_BODY_CLASS}>
          <div className={TITLE_CLASS}>&nbsp;</div>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 top-0 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-out motion-reduce:transition-none ${
          isExpanded
            ? 'bg-white scale-105 md:scale-110 shadow-2xl'
            : 'bg-white/80 scale-100 shadow-md'
        } ${selectionMode && isSelected ? 'ring-4 ring-pink-500' : ''} ${
          selectionMode && isSelectionDisabled ? 'opacity-50' : ''
        }`}
      >
        {/* 複数選択モード: カード全体を選択ボタンで覆う */}
        {selectionMode && (
          <button
            type="button"
            onClick={() => onToggleSelect?.(music)}
            disabled={isSelectionDisabled}
            aria-pressed={isSelected}
            aria-label={`${music.title}を${isSelected ? '選択解除' : '選択'}`}
            className={`absolute inset-0 z-10 rounded-2xl transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 disabled:cursor-not-allowed ${
              isSelected ? 'bg-pink-500/10' : 'hover:bg-black/5'
            }`}
          >
            <span
              className={`absolute top-2 right-2 flex items-center justify-center w-9 h-9 rounded-full border-2 border-white shadow-md text-base font-bold transition-all duration-200 ${
                isSelected ? 'bg-pink-500 text-white scale-110' : 'bg-white/70'
              }`}
              aria-hidden
            >
              {isSelected ? selectionOrder ?? '✓' : ''}
            </span>
          </button>
        )}

        {/* サムネイル（クリックで YouTube 再生） */}
        <a
          href={YOUTUBE_VIDEO_URL(music.youtubeVideoId)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${music.title}（YouTubeで再生）`}
          tabIndex={selectionMode ? -1 : undefined}
          aria-hidden={selectionMode || undefined}
          onPointerDown={handleThumbnailPointerDown}
          onClick={handleThumbnailClick}
          className="relative block aspect-[11/6] bg-gray-100 overflow-hidden"
        >
          {!thumbnailError ? (
            <img
              src={YOUTUBE_THUMBNAIL_URL(music.youtubeVideoId)}
              alt=""
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover select-none"
              onError={() => setThumbnailError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
              <YoutubeIcon className="w-10 h-10 text-red-400 mb-1" />
              <span className="text-xs text-red-400">YouTube</span>
            </div>
          )}

          {/* タイプバッジ（TOP 楽曲ピックアップと同じ表示） */}
          <span
            className={`absolute top-2 left-2 px-3 py-0.5 text-xs font-bold tracking-wider rounded-full shadow-md ${
              TYPE_BADGE_CLASSES[music.type] ?? TYPE_BADGE_CLASSES.original
            }`}
          >
            {TYPE_BADGE_LABELS[music.type] ?? TYPE_BADGE_LABELS.original}
          </span>

          {/* 展開時の再生ボタンオーバーレイ */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
              isExpanded ? 'bg-black/20' : 'bg-black/0'
            }`}
            aria-hidden
          >
            <div
              className={`w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <PlayIcon className="w-5 h-5 ml-0.5" />
            </div>
          </div>
        </a>

        {isExpanded ? (
          /* 楽曲情報パネル（展開時） */
          <div className="p-3 space-y-2 animate-fade-in" style={{ animationDuration: '0.2s' }}>
            <div className="flex items-center gap-2">
              <a
                href={YOUTUBE_VIDEO_URL(music.youtubeVideoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold tracking-wide hover:bg-red-700 transition-colors"
              >
                <PlayIcon className="w-3.5 h-3.5" />
                再生
              </a>
              <Link
                to={`/music/${music.id}/lyrics`}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-pink-200 text-pink-600 text-sm font-bold tracking-wide hover:bg-pink-50 transition-colors"
              >
                <LyricsIcon />
                歌詞・コール
              </Link>
            </div>

            <h3 className="font-bold text-gray-900 text-base leading-snug tracking-wide line-clamp-2">
              {music.title}
            </h3>

            {releaseDateLabel && (
              <p className="text-sm text-gray-500 tracking-wide">{releaseDateLabel}</p>
            )}

            {music.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide line-clamp-2">{music.description}</p>
            )}
          </div>
        ) : (
          /* 通常時: タイトルのみ（TOP 楽曲ピックアップと同じ表示） */
          <div className={CARD_BODY_CLASS}>
            <h3 className={`font-bold text-gray-900 ${TITLE_CLASS}`}>{music.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
};
