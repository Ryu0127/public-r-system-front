import { useCallback } from 'react';
import type { Music, MusicType, TalentMusicApiResponse } from 'features/talent-music/types';

export type { TalentMusicApiResponse } from 'features/talent-music/types';

// モックデータ: 楽曲一覧（API URL 未設定時のみ）
// ※ YouTubeのビデオIDはサンプルです。実際のAPIが実装されたら差し替えてください。
const mockMusicList: Music[] = [
  // ときのそら
  {
    id: 101,
    title: 'Watashi wa Idol!!!',
    talentIds: [1],
    youtubeVideoId: 'oO2tcADzMz0',
    type: 'original',
    releaseDate: '2020-03-01',
    description: 'ときのそら 1stシングル',
  },
  {
    id: 102,
    title: 'Say! Fanfare!',
    talentIds: [1],
    youtubeVideoId: 'QFnRAbp-tKI',
    type: 'original',
    releaseDate: '2021-03-15',
    description: 'ときのそら オリジナル曲',
  },
  {
    id: 103,
    title: 'いのちの食べ方 (Cover)',
    talentIds: [1],
    youtubeVideoId: 'n5RxmhDMhMo',
    type: 'cover',
    releaseDate: '2022-09-10',
    description: 'カバー曲',
  },
  {
    id: 104,
    title: 'Dreaming!',
    talentIds: [1],
    youtubeVideoId: 'lXMskKTw3Bc',
    type: 'original',
    releaseDate: '2021-10-01',
    description: 'ときのそら 1stフルアルバム収録曲',
  },
  {
    id: 199,
    title: 'モック: コラボ例',
    talentIds: [1, 2],
    youtubeVideoId: 'QFnRAbp-tKI',
    type: 'cover',
    releaseDate: '2025-01-01',
    description: '複数 talentIds のサンプル',
  },
  // ロボ子さん
  {
    id: 201,
    title: 'ロボ子さんのうた',
    talentIds: [2],
    youtubeVideoId: 'xSXpNpqOJ-s',
    type: 'original',
    releaseDate: '2021-05-01',
    description: 'ロボ子さん オリジナル曲',
  },
  {
    id: 202,
    title: 'LOVE DRAMATIC (Cover)',
    talentIds: [2],
    youtubeVideoId: 'Zu_5UtXAJo0',
    type: 'cover',
    releaseDate: '2022-02-14',
    description: 'カバー曲',
  },
  // さくらみこ
  {
    id: 301,
    title: 'だいすき！ (オリジナル曲)',
    talentIds: [3],
    youtubeVideoId: 'p3iFDFDMb8Y',
    type: 'original',
    releaseDate: '2022-01-25',
    description: 'さくらみこ オリジナル曲',
  },
  {
    id: 302,
    title: '恋愛サーキュレーション (Cover)',
    talentIds: [3],
    youtubeVideoId: 'wiy8pSf1tdk',
    type: 'cover',
    releaseDate: '2021-08-12',
    description: 'カバー曲',
  },
  {
    id: 303,
    title: 'さくらみこオリジナル曲2',
    talentIds: [3],
    youtubeVideoId: 'gSVvxOchT3w',
    type: 'original',
    releaseDate: '2023-04-01',
    description: 'さくらみこ 2ndオリジナル曲',
  },
  // 白上フブキ
  {
    id: 401,
    title: 'Say！ダーリン！！',
    talentIds: [4],
    youtubeVideoId: 'Fwc6S1KaTS8',
    type: 'original',
    releaseDate: '2021-09-17',
    description: '白上フブキ オリジナル曲',
  },
  {
    id: 402,
    title: '心做し (Cover)',
    talentIds: [4],
    youtubeVideoId: 'NPKH3iiNNKk',
    type: 'cover',
    releaseDate: '2020-12-25',
    description: 'カバー曲',
  },
  {
    id: 403,
    title: 'Say！ダーリン！！ (ショートver)',
    talentIds: [4],
    youtubeVideoId: 'XpTHOoJsS9Q',
    type: 'original',
    releaseDate: '2022-06-10',
    description: '白上フブキ オリジナル曲',
  },
  // 湊あくあ
  {
    id: 501,
    title: 'Dreamy Night',
    talentIds: [5],
    youtubeVideoId: 'ZPTvkKLME60',
    type: 'original',
    releaseDate: '2022-08-01',
    description: '湊あくあ オリジナル曲',
  },
  {
    id: 502,
    title: 'なんでもないや (Cover)',
    talentIds: [5],
    youtubeVideoId: 'g_RK2NQFKYE',
    type: 'cover',
    releaseDate: '2021-11-20',
    description: 'カバー曲',
  },
  // 宝鐘マリン
  {
    id: 601,
    title: 'AHOY!! 我ら宝鐘海賊団☆',
    talentIds: [6],
    youtubeVideoId: 'Sj3Gi7cIPyA',
    type: 'original',
    releaseDate: '2020-12-26',
    description: '宝鐘マリン オリジナル曲',
  },
  {
    id: 602,
    title: 'KING (Cover)',
    talentIds: [6],
    youtubeVideoId: 'xf3AntRuPNw',
    type: 'cover',
    releaseDate: '2021-04-05',
    description: 'カバー曲',
  },
  {
    id: 603,
    title: '恋のLesson初級編！ (Cover)',
    talentIds: [6],
    youtubeVideoId: '3-3AJuRBo5Q',
    type: 'cover',
    releaseDate: '2022-02-10',
    description: 'カバー曲',
  },
];

function coerceFiniteNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return null;
}

/** クエリ talent_ids 用。有限数のみ・重複除去 */
export function normalizeTalentIdsForMusicApi(talentIds: (number | string)[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const v of talentIds) {
    const n = coerceFiniteNumber(v);
    if (n !== null && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

const buildMockResponse = (talentIds: number[]): TalentMusicApiResponse => {
  const idSet = new Set(normalizeTalentIdsForMusicApi(talentIds));
  const musicList = mockMusicList
    .filter((m) => m.talentIds.some((tid) => idSet.has(tid)))
    .slice()
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  return {
    status: true,
    data: { musicList },
  };
};

/** 本番・明示設定: REACT_APP_API_DOMAIN（例: https://example.com/api）。開発: package.json の proxy 経由で相対パス */
function resolveTalentMusicApiUrl(talentIds: number[]): string | null {
  const ids = normalizeTalentIdsForMusicApi(talentIds);
  if (!ids.length) {
    return null;
  }
  const query = `talent_ids=${encodeURIComponent(ids.map(String).join(','))}`;
  const base = process.env.REACT_APP_API_DOMAIN?.trim();
  if (base) {
    return `${base.replace(/\/$/, '')}/oshi-katsu-saport/talent-music?${query}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return `/api/oshi-katsu-saport/talent-music?${query}`;
  }
  return null;
}

function normalizeMusicType(raw: unknown): MusicType {
  return raw === 'cover' ? 'cover' : 'original';
}

/** API の talentIds（数値配列）。旧文字列・単一 talentId も解釈 */
function parseTalentIdsFromMusicRow(m: Record<string, unknown>): number[] {
  const raw = m.talentIds ?? m.talent_ids;
  if (Array.isArray(raw)) {
    const out: number[] = [];
    for (const x of raw) {
      const n = coerceFiniteNumber(x);
      if (n !== null) {
        out.push(n);
      }
    }
    return Array.from(new Set(out));
  }
  const legacy = m.talentId;
  const single = coerceFiniteNumber(legacy);
  return single !== null ? [single] : [];
}

function parseMusicId(m: Record<string, unknown>): number {
  return coerceFiniteNumber(m.id) ?? 0;
}

function asMusicListArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === 'object') {
    return Object.values(raw as Record<string, unknown>);
  }
  return [];
}

function normalizeTalentMusicResponse(raw: unknown): TalentMusicApiResponse | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = raw as Record<string, unknown>;
  const statusOk = r.status === true || r.status === 1;
  if (!statusOk || !r.data || typeof r.data !== 'object') {
    return null;
  }
  const d = r.data as Record<string, unknown>;
  const musicListRaw = asMusicListArray(d.musicList);

  const musicList: Music[] = musicListRaw.map((item) => {
    const m = item as Record<string, unknown>;
    const yt =
      m.youtubeVideoId ?? m.youtube_video_id ?? m.youtube_video_code ?? '';
    const row: Music = {
      id: parseMusicId(m),
      title: String(m.title ?? ''),
      talentIds: parseTalentIdsFromMusicRow(m),
      youtubeVideoId: String(yt),
      type: normalizeMusicType(m.type),
      releaseDate: String(m.releaseDate ?? m.public_date ?? ''),
    };
    if (m.description != null && String(m.description).trim() !== '') {
      row.description = String(m.description);
    }
    return row;
  });

  return { status: true, data: { musicList } };
}

async function requestTalentMusic(url: string): Promise<TalentMusicApiResponse | null> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
  if (!res.ok) {
    console.error('Talent music API HTTP error:', res.status, res.statusText);
    return null;
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    console.error('Talent music API: response is not JSON');
    return null;
  }

  return normalizeTalentMusicResponse(json);
}

/**
 * GET …/oshi-katsu-saport/talent-music?talent_ids=1,2,…
 * - 複数タレント ID を渡せる（現状 UI は単一選択のため呼び出し側は1要素の配列でよい）
 * - REACT_APP_API_DOMAIN がある場合は絶対URLで取得
 * - 開発時のみ相対パス（proxy 想定）。URL が組めない場合のみモック
 */
export const useTalentMusicGetApi = () => {
  const executeTalentMusicGet = useCallback(async (talentIds: (number | string)[]): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    const ids = normalizeTalentIdsForMusicApi(talentIds);
    if (!ids.length) {
      return { apiResponse: null, error: new Error('At least one talentId is required') };
    }

    const url = resolveTalentMusicApiUrl(ids);
    if (!url) {
      return { apiResponse: buildMockResponse(ids), error: null };
    }

    try {
      const apiResponse = await requestTalentMusic(url);
      if (apiResponse) {
        return { apiResponse, error: null };
      }
      return { apiResponse: null, error: new Error('Talent music API failed') };
    } catch (error) {
      console.error('Talent music API Error:', error);
      return { apiResponse: null, error };
    }
  }, []);

  return { executeTalentMusicGet };
};
