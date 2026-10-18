import React from 'react';
import { LyricsDisplayMode, LyricsFontSize } from '../types';

const MODE_OPTIONS: { key: LyricsDisplayMode; label: string }[] = [
  { key: 'both', label: '歌詞＋コール' },
  { key: 'lyrics', label: '歌詞のみ' },
  { key: 'calls', label: 'コールのみ' },
];

const FONT_SIZE_OPTIONS: { key: LyricsFontSize; label: string; ariaLabel: string }[] = [
  { key: 'sm', label: '小', ariaLabel: '文字サイズ 小' },
  { key: 'md', label: '中', ariaLabel: '文字サイズ 中' },
  { key: 'lg', label: '大', ariaLabel: '文字サイズ 大' },
];

interface LyricsDisplayControlsProps {
  mode: LyricsDisplayMode;
  fontSize: LyricsFontSize;
  onModeChange: (mode: LyricsDisplayMode) => void;
  onFontSizeChange: (fontSize: LyricsFontSize) => void;
}

/**
 * 表示モード（歌詞＋コール / 歌詞のみ / コールのみ）と文字サイズの切り替え
 */
export const LyricsDisplayControls: React.FC<LyricsDisplayControlsProps> = ({
  mode,
  fontSize,
  onModeChange,
  onFontSizeChange,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
    <div
      role="radiogroup"
      aria-label="表示モード"
      className="flex flex-1 gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-md"
    >
      {MODE_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={mode === option.key}
          onClick={() => onModeChange(option.key)}
          className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            mode === option.key
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>

    <div
      role="radiogroup"
      aria-label="文字サイズ"
      className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 shadow-md self-end sm:self-auto"
    >
      <span className="text-xs text-gray-500 px-2">文字</span>
      {FONT_SIZE_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={fontSize === option.key}
          aria-label={option.ariaLabel}
          onClick={() => onFontSizeChange(option.key)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
            fontSize === option.key
              ? 'bg-gray-800 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);
