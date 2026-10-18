import { LyricsDisplayMode, LyricsDisplaySettings, LyricsFontSize } from '../types';

const STORAGE_KEY = 'musicLyricsDisplaySettings';

export const DEFAULT_LYRICS_DISPLAY_SETTINGS: LyricsDisplaySettings = {
  mode: 'both',
  fontSize: 'md',
  isVideoVisible: true,
};

const MODES: LyricsDisplayMode[] = ['both', 'lyrics', 'calls'];
const FONT_SIZES: LyricsFontSize[] = ['sm', 'md', 'lg'];

/** 表示設定を localStorage から読み込む（不正値はデフォルトに置換） */
export const loadLyricsDisplaySettings = (): LyricsDisplaySettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LYRICS_DISPLAY_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<LyricsDisplaySettings>;
    return {
      mode: MODES.includes(parsed.mode as LyricsDisplayMode)
        ? (parsed.mode as LyricsDisplayMode)
        : DEFAULT_LYRICS_DISPLAY_SETTINGS.mode,
      fontSize: FONT_SIZES.includes(parsed.fontSize as LyricsFontSize)
        ? (parsed.fontSize as LyricsFontSize)
        : DEFAULT_LYRICS_DISPLAY_SETTINGS.fontSize,
      isVideoVisible:
        typeof parsed.isVideoVisible === 'boolean'
          ? parsed.isVideoVisible
          : DEFAULT_LYRICS_DISPLAY_SETTINGS.isVideoVisible,
    };
  } catch {
    return DEFAULT_LYRICS_DISPLAY_SETTINGS;
  }
};

/** 表示設定を localStorage に保存 */
export const saveLyricsDisplaySettings = (settings: LyricsDisplaySettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ストレージ不可（プライベートモード等）の場合は保存しない
  }
};
