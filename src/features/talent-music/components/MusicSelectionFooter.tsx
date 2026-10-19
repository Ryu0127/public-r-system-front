import React, { useMemo } from 'react';
import { Music } from '../types';
import { buildTemporaryPlaylistUrl, TEMPORARY_PLAYLIST_MAX_VIDEOS } from '../utils/temporaryPlaylist';

const CheckListIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlaylistPlayIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M3 6h12v2H3V6zm0 4h12v2H3v-2zm0 4h8v2H3v-2zm14-4v8l6-4-6-4z" />
  </svg>
);

/** フッターの高さ分、他の画面下部固定要素を退避させる位置 */
export const MUSIC_SELECTION_FOOTER_OFFSET_CLASS = 'bottom-24';

interface MusicSelectionFooterProps {
  isMultiSelectMode: boolean;
  /** 選択した楽曲（選択順 = 再生順） */
  selectedMusic: Music[];
  /** 選択できる楽曲がない（一覧が空・読み込み中）場合 true */
  isStartDisabled?: boolean;
  /** true の間は画面下へスライドして隠す（タレント・グループ選択モーダル表示中など） */
  isHidden?: boolean;
  onStart: () => void;
  onCancel: () => void;
}

/**
 * 楽曲一覧の画面下部固定フッター
 * - 通常時: 「楽曲を複数選択」ボタン
 * - 複数選択モード: 「選択をキャンセル」ボタン + 選択数 + 「一時的なプレイリストで再生」ボタン
 */
export const MusicSelectionFooter: React.FC<MusicSelectionFooterProps> = ({
  isMultiSelectMode,
  selectedMusic,
  isStartDisabled = false,
  isHidden = false,
  onStart,
  onCancel,
}) => {
  const selectedCount = selectedMusic.length;
  const isMaxReached = selectedCount >= TEMPORARY_PLAYLIST_MAX_VIDEOS;
  const playlistUrl = useMemo(
    () => buildTemporaryPlaylistUrl(selectedMusic.map((m) => m.youtubeVideoId)),
    [selectedMusic]
  );

  return (
    <footer
      aria-hidden={isHidden || undefined}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
        // 上方向の影まで見えなくなるよう、高さ + 影の分だけ下げる
        isHidden ? 'translate-y-[calc(100%+3rem)] pointer-events-none' : 'translate-y-0'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 h-20 flex items-center gap-3 sm:gap-4">
        {isMultiSelectMode ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-bold tracking-wider shadow-sm hover:border-gray-400 hover:text-gray-900 active:scale-95 transition-all duration-200 whitespace-nowrap"
          >
            <CloseIcon />
            選択をキャンセル
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            disabled={isStartDisabled}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-white border border-pink-300 text-pink-600 text-sm sm:text-base font-bold tracking-wider shadow-sm hover:bg-pink-50 hover:border-pink-400 active:scale-95 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100"
          >
            <CheckListIcon />
            楽曲を複数選択
          </button>
        )}

        {!isMultiSelectMode && (
          <p className="hidden sm:block text-sm md:text-base text-gray-600 tracking-wide leading-relaxed">
            選んだ楽曲をYouTubeの一時的なプレイリストで続けて再生できます
          </p>
        )}

        {isMultiSelectMode && selectedCount === 0 && (
          <p className="text-sm md:text-base text-gray-600 tracking-wide leading-relaxed" role="status" aria-live="polite">
            再生したい楽曲を選択してください
            <span className="hidden sm:inline">（選択した順に再生・最大{TEMPORARY_PLAYLIST_MAX_VIDEOS}曲）</span>
          </p>
        )}

        {isMultiSelectMode && selectedCount > 0 && (
          <>
            <p className="text-sm sm:text-base text-gray-700 tracking-wide whitespace-nowrap" role="status" aria-live="polite">
              <span className="text-2xl font-bold text-pink-600">{selectedCount}</span>
              <span className="ml-1">曲</span>
              <span className="hidden sm:inline">を選択中</span>
              {isMaxReached && (
                <span className="ml-2 text-sm text-amber-600">（上限{TEMPORARY_PLAYLIST_MAX_VIDEOS}曲）</span>
              )}
            </p>

            {playlistUrl ? (
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-red-600 text-white text-sm sm:text-base font-bold tracking-wider shadow-md hover:bg-red-700 hover:shadow-lg active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                <PlaylistPlayIcon />
                <span className="sm:hidden">再生</span>
                <span className="hidden sm:inline">一時的なプレイリストで再生</span>
              </a>
            ) : (
              <span className="ml-auto text-sm text-gray-500 tracking-wide">再生できる動画がありません</span>
            )}
          </>
        )}
      </div>
    </footer>
  );
};
