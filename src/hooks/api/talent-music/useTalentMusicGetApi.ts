import { useCallback } from 'react';
import type {
  Music,
  MusicType,
  TalentMusicApiResponse,
  TalentMusicFetchParams,
  TalentMusicPagination,
} from 'features/talent-music/types';

export type { TalentMusicApiResponse } from 'features/talent-music/types';

export const TALENT_MUSIC_DEFAULT_PER_PAGE = 20;

// モックデータ: 楽曲一覧（API URL 未設定時のみ）
const mockMusicList: Music[] = [
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

function buildPagination(
  total: number,
  page: number,
  perPage: number
): TalentMusicPagination {
  const lastPage = Math.max(1, Math.ceil(total / perPage) || 1);
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const from = total > 0 ? (currentPage - 1) * perPage + 1 : null;
  const to = total > 0 ? Math.min(currentPage * perPage, total) : null;
  return {
    total,
    perPage,
    currentPage,
    lastPage,
    from,
    to,
  };
}

const buildMockResponse = (params: TalentMusicFetchParams): TalentMusicApiResponse => {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? TALENT_MUSIC_DEFAULT_PER_PAGE);
  const talentSlug = params.talentSlug?.trim() ?? '';
  const groupSlug = params.groupSlug?.trim() ?? '';

  // モックでは slug フィルタの実データがないため、talent/group 指定時は空、未指定時は全件をページング
  let list = mockMusicList.slice().sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  if (talentSlug || groupSlug) {
    list = [];
  }

  const pagination = buildPagination(list.length, page, perPage);
  const start = (pagination.currentPage - 1) * perPage;
  const musicList = list.slice(start, start + perPage);

  return {
    status: true,
    data: { musicList, pagination },
  };
};

function resolveTalentMusicBaseUrl(): string | null {
  const base = process.env.REACT_APP_API_DOMAIN?.trim();
  if (base) {
    return `${base.replace(/\/$/, '')}/oshi-katsu-saport/talent-music`;
  }
  if (process.env.NODE_ENV === 'development') {
    return `/api/oshi-katsu-saport/talent-music`;
  }
  return null;
}

function resolveTalentMusicApiUrl(params: TalentMusicFetchParams): string | null {
  const baseUrl = resolveTalentMusicBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const query = new URLSearchParams();
  const talentSlug = params.talentSlug?.trim() ?? '';
  const groupSlug = params.groupSlug?.trim() ?? '';
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? TALENT_MUSIC_DEFAULT_PER_PAGE);

  if (talentSlug) {
    query.set('talent', talentSlug);
  }
  if (groupSlug) {
    query.set('group', groupSlug);
  }
  query.set('page', String(page));
  query.set('perPage', String(perPage));

  return `${baseUrl}?${query.toString()}`;
}

/** 後方互換: talent_ids クエリ URL */
function resolveTalentMusicApiUrlByTalentIds(talentIds: number[]): string | null {
  const ids = normalizeTalentIdsForMusicApi(talentIds);
  if (!ids.length) {
    return null;
  }
  const baseUrl = resolveTalentMusicBaseUrl();
  if (!baseUrl) {
    return null;
  }
  const query = `talent_ids=${encodeURIComponent(ids.map(String).join(','))}`;
  return `${baseUrl}?${query}`;
}

function normalizeMusicType(raw: unknown): MusicType {
  return raw === 'cover' ? 'cover' : 'original';
}

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

function normalizePagination(raw: unknown, musicListLength: number): TalentMusicPagination {
  if (raw && typeof raw === 'object') {
    const p = raw as Record<string, unknown>;
    const total = coerceFiniteNumber(p.total) ?? musicListLength;
    const perPage = coerceFiniteNumber(p.perPage) ?? Math.max(musicListLength, 1);
    const currentPage = coerceFiniteNumber(p.currentPage) ?? 1;
    const lastPage = coerceFiniteNumber(p.lastPage) ?? 1;
    const from = coerceFiniteNumber(p.from);
    const to = coerceFiniteNumber(p.to);
    return {
      total,
      perPage,
      currentPage,
      lastPage,
      from,
      to,
    };
  }

  // ページネーション未対応の旧レスポンス互換
  return buildPagination(musicListLength, 1, Math.max(musicListLength, 1));
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

  return {
    status: true,
    data: {
      musicList,
      pagination: normalizePagination(d.pagination, musicList.length),
    },
  };
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
 * GET …/oshi-katsu-saport/talent-music
 * - talent / group は任意（未指定で全件）
 * - page / perPage でページネーション
 */
export const useTalentMusicGetApi = () => {
  const executeTalentMusicGetByParams = useCallback(async (params: TalentMusicFetchParams = {}): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    const url = resolveTalentMusicApiUrl(params);
    if (!url) {
      return { apiResponse: buildMockResponse(params), error: null };
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

  const executeTalentMusicGet = useCallback(async (talentIds: (number | string)[]): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    const ids = normalizeTalentIdsForMusicApi(talentIds);
    if (!ids.length) {
      return { apiResponse: null, error: new Error('At least one talentId is required') };
    }

    const url = resolveTalentMusicApiUrlByTalentIds(ids);
    if (!url) {
      return {
        apiResponse: buildMockResponse({ page: 1, perPage: TALENT_MUSIC_DEFAULT_PER_PAGE }),
        error: null,
      };
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

  const executeTalentMusicGetByTalentSlug = useCallback(async (
    talentSlug: string,
    options?: { page?: number; perPage?: number }
  ): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    const slug = talentSlug.trim();
    if (!slug) {
      return { apiResponse: null, error: new Error('talent is required') };
    }
    return executeTalentMusicGetByParams({
      talentSlug: slug,
      page: options?.page,
      perPage: options?.perPage,
    });
  }, [executeTalentMusicGetByParams]);

  const executeTalentMusicGetByGroupSlug = useCallback(async (
    groupSlug: string,
    options?: { page?: number; perPage?: number }
  ): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    const slug = groupSlug.trim();
    if (!slug) {
      return { apiResponse: null, error: new Error('group is required') };
    }
    return executeTalentMusicGetByParams({
      groupSlug: slug,
      page: options?.page,
      perPage: options?.perPage,
    });
  }, [executeTalentMusicGetByParams]);

  return {
    executeTalentMusicGet,
    executeTalentMusicGetByParams,
    executeTalentMusicGetByTalentSlug,
    executeTalentMusicGetByGroupSlug,
  };
};
