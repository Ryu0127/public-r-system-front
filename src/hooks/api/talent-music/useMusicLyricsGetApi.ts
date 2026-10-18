import { useCallback } from 'react';
import type { MusicType } from 'features/talent-music/types';
import type {
  LyricsLine,
  LyricsMusic,
  LyricsSection,
  MusicLyrics,
  MusicLyricsApiResponse,
} from 'features/music-lyrics/types';

export type { MusicLyricsApiResponse } from 'features/music-lyrics/types';

/** 取得失敗の種別（画面の出し分けに使用） */
export type MusicLyricsErrorKind = 'notFound' | 'network' | 'invalid';

export interface MusicLyricsGetResult {
  apiResponse: MusicLyricsApiResponse | null;
  errorKind: MusicLyricsErrorKind | null;
}

/**
 * モックデータ（API URL 未設定時のみ使用）
 * ※ 画面確認用のオリジナルのサンプル文であり、実在する楽曲の歌詞ではありません
 */
const buildMockResponse = (musicId: number): MusicLyricsApiResponse => ({
  status: true,
  data: {
    isDemo: true,
    music: {
      id: musicId,
      title: 'デモ楽曲（歌詞・コール表示サンプル）',
      youtubeVideoId: '',
      type: 'original',
      releaseDate: '',
    },
    lyrics: {
      note: '表示確認用のサンプルデータです。実際の歌詞・コールは楽曲データ登録後に表示されます。',
      updatedAt: '',
      sections: [
        {
          label: 'イントロ',
          lines: [
            { lyric: '', call: '（クラップ ×4）' },
            { lyric: '', call: 'せーの！ ハイ！ハイ！ハイ！ハイ！' },
          ],
        },
        {
          label: 'Aメロ',
          lines: [
            { lyric: 'サンプルの歌詞 一行目' },
            { lyric: 'サンプルの歌詞 二行目', call: 'ハイ！' },
            { lyric: 'サンプルの歌詞 三行目' },
            { lyric: 'サンプルの歌詞 四行目', call: 'ハイ！ハイ！' },
          ],
        },
        {
          label: 'Bメロ',
          lines: [
            { lyric: 'サンプルの歌詞 五行目', call: '（クラップ ×2）' },
            { lyric: 'サンプルの歌詞 六行目', call: '（クラップ ×2）' },
            { lyric: '', call: '（推しの名前）ー！' },
          ],
        },
        {
          label: 'サビ',
          lines: [
            { lyric: 'サンプルの歌詞 七行目', call: 'Fu！Fu！' },
            { lyric: 'サンプルの歌詞 八行目' },
            { lyric: 'サンプルの歌詞 九行目', call: 'Fu！Fu！' },
            { lyric: 'サンプルの歌詞 十行目', call: 'ハイ！ハイ！ハイ！ハイ！' },
          ],
        },
      ],
    },
  },
});

function coerceFiniteNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function optionalString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v);
  return s.trim() !== '' ? s : undefined;
}

function normalizeMusicType(raw: unknown): MusicType {
  return raw === 'cover' ? 'cover' : 'original';
}

function normalizeLine(raw: unknown): LyricsLine | null {
  if (typeof raw === 'string') {
    return { lyric: raw };
  }
  if (!raw || typeof raw !== 'object') return null;
  const l = raw as Record<string, unknown>;
  const lyric = l.lyric ?? l.text ?? '';
  const call = optionalString(l.call);
  const line: LyricsLine = { lyric: String(lyric ?? '') };
  if (call) line.call = call;
  if (line.lyric.trim() === '' && !line.call) {
    // 空行は区切りとして保持
    return { lyric: '' };
  }
  return line;
}

function normalizeSection(raw: unknown): LyricsSection | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  const linesRaw = Array.isArray(s.lines) ? s.lines : [];
  const lines = linesRaw
    .map(normalizeLine)
    .filter((l): l is LyricsLine => l !== null);
  if (lines.length === 0) return null;
  const section: LyricsSection = { lines };
  const label = optionalString(s.label);
  if (label) section.label = label;
  return section;
}

function normalizeLyrics(raw: unknown): MusicLyrics | null {
  if (!raw || typeof raw !== 'object') return null;
  const l = raw as Record<string, unknown>;
  const sectionsRaw = Array.isArray(l.sections) ? l.sections : [];
  const sections = sectionsRaw
    .map(normalizeSection)
    .filter((s): s is LyricsSection => s !== null);
  if (sections.length === 0) return null;
  const lyrics: MusicLyrics = { sections };
  const note = optionalString(l.note);
  if (note) lyrics.note = note;
  const updatedAt = optionalString(l.updatedAt ?? l.updated_at);
  if (updatedAt) lyrics.updatedAt = updatedAt;
  return lyrics;
}

function normalizeMusic(raw: unknown, fallbackId: number): LyricsMusic | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  return {
    id: coerceFiniteNumber(m.id) ?? fallbackId,
    title: String(m.title ?? ''),
    youtubeVideoId: String(m.youtubeVideoId ?? m.youtube_video_id ?? m.youtube_video_code ?? ''),
    type: normalizeMusicType(m.type),
    releaseDate: String(m.releaseDate ?? m.public_date ?? ''),
  };
}

function normalizeResponse(raw: unknown, musicId: number): MusicLyricsApiResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const statusOk = r.status === true || r.status === 1;
  if (!statusOk || !r.data || typeof r.data !== 'object') return null;
  const d = r.data as Record<string, unknown>;
  const music = normalizeMusic(d.music, musicId);
  if (!music) return null;
  return {
    status: true,
    data: {
      music,
      lyrics: normalizeLyrics(d.lyrics),
    },
  };
}

function resolveLyricsApiUrl(musicId: number): string | null {
  const base = process.env.REACT_APP_API_DOMAIN?.trim();
  const path = `/oshi-katsu-saport/talent-music/${encodeURIComponent(String(musicId))}/lyrics`;
  if (base) {
    return `${base.replace(/\/$/, '')}${path}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return `/api${path}`;
  }
  return null;
}

/**
 * GET …/oshi-katsu-saport/talent-music/{id}/lyrics
 *
 * 想定レスポンス:
 * {
 *   status: true,
 *   data: {
 *     music: { id, title, youtubeVideoId, type, releaseDate },
 *     lyrics: { sections: [{ label?, lines: [{ lyric, call? }] }], note?, updatedAt? } | null
 *   }
 * }
 */
export const useMusicLyricsGetApi = () => {
  const executeMusicLyricsGet = useCallback(async (musicId: number): Promise<MusicLyricsGetResult> => {
    const url = resolveLyricsApiUrl(musicId);
    if (!url) {
      return { apiResponse: buildMockResponse(musicId), errorKind: null };
    }

    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (res.status === 404) {
        return { apiResponse: null, errorKind: 'notFound' };
      }
      if (!res.ok) {
        console.error('Music lyrics API HTTP error:', res.status, res.statusText);
        return { apiResponse: null, errorKind: 'network' };
      }

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        console.error('Music lyrics API: response is not JSON');
        return { apiResponse: null, errorKind: 'invalid' };
      }

      const apiResponse = normalizeResponse(json, musicId);
      if (!apiResponse) {
        return { apiResponse: null, errorKind: 'invalid' };
      }
      return { apiResponse, errorKind: null };
    } catch (error) {
      console.error('Music lyrics API Error:', error);
      return { apiResponse: null, errorKind: 'network' };
    }
  }, []);

  return { executeMusicLyricsGet };
};
