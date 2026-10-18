import React, { useMemo } from 'react';
import SectionCard from 'components/atoms/SectionCard';
import { LyricsDisplayMode, LyricsFontSize, LyricsLine, LyricsSection } from '../types';

const LYRIC_TEXT_CLASS: Record<LyricsFontSize, string> = {
  sm: 'text-sm',
  md: 'text-base md:text-lg',
  lg: 'text-xl md:text-2xl',
};

const CALL_TEXT_CLASS: Record<LyricsFontSize, string> = {
  sm: 'text-xs',
  md: 'text-sm md:text-base',
  lg: 'text-lg md:text-xl',
};

interface LyricsViewProps {
  sections: LyricsSection[];
  mode: LyricsDisplayMode;
  fontSize: LyricsFontSize;
}

const hasCall = (line: LyricsLine) => !!line.call;
const hasLyric = (line: LyricsLine) => line.lyric.trim() !== '';

/** 表示モードに応じて行を絞り込む */
const filterLines = (lines: LyricsLine[], mode: LyricsDisplayMode): LyricsLine[] => {
  switch (mode) {
    case 'lyrics':
      // コールのみの行は除外。空行（区切り）は残す
      return lines.filter((l) => hasLyric(l) || !hasCall(l));
    case 'calls':
      return lines.filter(hasCall);
    default:
      return lines;
  }
};

/**
 * 歌詞とコールの表示
 * - 歌詞＋コール: 歌詞行の下にコールを色付きで表示
 * - 歌詞のみ: コールを非表示
 * - コールのみ: コールがある行だけを表示し、歌詞はタイミングの目安として小さく表示
 */
export const LyricsView: React.FC<LyricsViewProps> = ({ sections, mode, fontSize }) => {
  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({ ...section, lines: filterLines(section.lines, mode) }))
        .filter((section) => section.lines.some((l) => hasLyric(l) || hasCall(l))),
    [sections, mode]
  );

  if (visibleSections.length === 0) {
    return (
      <SectionCard className="p-8 text-center">
        <p className="text-gray-500 font-medium">
          {mode === 'calls' ? 'この楽曲にはコールが登録されていません' : '表示できる歌詞がありません'}
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="p-5 md:p-8">
      <div className="space-y-8">
        {visibleSections.map((section, sectionIndex) => (
          <section key={`${section.label ?? 'section'}-${sectionIndex}`}>
            {section.label && (
              <h3 className="inline-block mb-3 px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 tracking-wide">
                {section.label}
              </h3>
            )}
            <div className="space-y-3">
              {section.lines.map((line, lineIndex) => (
                <LyricsLineItem
                  key={lineIndex}
                  line={line}
                  mode={mode}
                  fontSize={fontSize}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </SectionCard>
  );
};

interface LyricsLineItemProps {
  line: LyricsLine;
  mode: LyricsDisplayMode;
  fontSize: LyricsFontSize;
}

const LyricsLineItem: React.FC<LyricsLineItemProps> = ({ line, mode, fontSize }) => {
  const lyricVisible = hasLyric(line);
  const callVisible = mode !== 'lyrics' && hasCall(line);

  // 空行（区切り）
  if (!lyricVisible && !callVisible) {
    return <div className="h-3" aria-hidden />;
  }

  const lyricClass =
    mode === 'calls'
      ? `${CALL_TEXT_CLASS[fontSize]} text-gray-400`
      : `${LYRIC_TEXT_CLASS[fontSize]} text-gray-800`;

  return (
    <div className="leading-relaxed">
      {lyricVisible && (
        <p className={`${lyricClass} whitespace-pre-wrap break-words`}>{line.lyric}</p>
      )}
      {callVisible && (
        <p
          className={`${mode === 'calls' ? LYRIC_TEXT_CLASS[fontSize] : CALL_TEXT_CLASS[fontSize]} font-bold text-pink-600 whitespace-pre-wrap break-words ${
            lyricVisible ? 'mt-0.5' : ''
          }`}
        >
          <span
            className="inline-block mr-2 px-1.5 py-0.5 rounded-md bg-pink-100 text-pink-600 text-[10px] font-bold align-middle"
            aria-label="コール"
          >
            CALL
          </span>
          {line.call}
        </p>
      )}
    </div>
  );
};
