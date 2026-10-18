import type { MusicType } from 'features/talent-music/types';

/**
 * 歌詞1行
 * - lyric のみ: 通常の歌詞行
 * - lyric + call: 歌詞に合わせて入れるコール
 * - call のみ（lyric が空）: 間奏・イントロ等のコール/MIX
 */
export interface LyricsLine {
  lyric: string;
  call?: string;
}

/** 歌詞のブロック（Aメロ / サビ 等） */
export interface LyricsSection {
  label?: string;
  lines: LyricsLine[];
}

export interface MusicLyrics {
  sections: LyricsSection[];
  /** コールに関する補足（例: 「サビ前はクラップ推奨」） */
  note?: string;
  /** 最終更新日（YYYY-MM-DD 等） */
  updatedAt?: string;
}

/** 歌詞画面で表示する楽曲情報 */
export interface LyricsMusic {
  id: number;
  title: string;
  youtubeVideoId: string;
  type: MusicType;
  releaseDate: string;
}

/** GET …/oshi-katsu-saport/talent-music/{id}/lyrics のレスポンス（正規化後） */
export interface MusicLyricsApiResponse {
  status: boolean;
  data: {
    music: LyricsMusic;
    /** 未登録の場合は null */
    lyrics: MusicLyrics | null;
    /** モックデータで表示している場合 true */
    isDemo?: boolean;
  };
}

/** 表示モード */
export type LyricsDisplayMode = 'both' | 'lyrics' | 'calls';

/** 文字サイズ */
export type LyricsFontSize = 'sm' | 'md' | 'lg';

export interface LyricsDisplaySettings {
  mode: LyricsDisplayMode;
  fontSize: LyricsFontSize;
  isVideoVisible: boolean;
}
