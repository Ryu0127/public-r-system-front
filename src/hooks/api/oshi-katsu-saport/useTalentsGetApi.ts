import { useCallback } from 'react';

/**
 * GET /oshi-katsu-saport/talents の data.talents[] 1件（バックエンド仕様）
 * id / talentName / talentNameEn のみ返る想定
 */
export interface TalentsListApiRow {
  id: string | number;
  talentName: string;
  talentNameEn: string;
}

export interface TalentsApiResponse {
  status: boolean;
  data: {
    talents: Talent[];
  };
}

/**
 * 一覧APIを正規化したタレント（画面用）
 * APIに無い groupName / groupId / twitterAccounts は空・0・[] で埋める
 */
export interface Talent extends TalentsListApiRow {
  id: string;
  groupName: string;
  groupId: number;
  twitterAccounts: string[];
}

function resolveTalentsApiUrl(): string | null {
  const base = process.env.REACT_APP_API_DOMAIN?.trim();
  if (base) {
    return `${base.replace(/\/$/, '')}/oshi-katsu-saport/talent-music/talents`;
  }
  if (process.env.NODE_ENV === 'development') {
    return '/api/oshi-katsu-saport/talent-music/talents';
  }
  return null;
}

function normalizeTalentsResponse(raw: unknown): TalentsApiResponse | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = raw as Record<string, unknown>;
  if (r.status !== true || !r.data || typeof r.data !== 'object') {
    return null;
  }
  const d = r.data as Record<string, unknown>;
  if (!Array.isArray(d.talents)) {
    return null;
  }

  const talents: Talent[] = d.talents.map((item) => {
    const t = item as Record<string, unknown>;
    const tw = t.twitterAccounts;
    const gid = t.groupId;
    const gn = t.groupName;
    return {
      id: String(t.id ?? ''),
      talentName: String(t.talentName ?? ''),
      talentNameEn: String(t.talentNameEn ?? ''),
      groupName: gn !== undefined && gn !== null ? String(gn) : '',
      groupId: gid !== undefined && gid !== null && gid !== '' ? Number(gid) : 0,
      twitterAccounts: Array.isArray(tw) ? tw.map((x) => String(x)) : [],
    };
  });

  return { status: true, data: { talents } };
}

async function requestTalents(url: string): Promise<TalentsApiResponse | null> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: 'GET', headers });
  if (!res.ok) {
    console.error('Talents API HTTP error:', res.status, res.statusText);
    return null;
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    console.error('Talents API: response is not JSON');
    return null;
  }

  return normalizeTalentsResponse(json);
}

/** 開発用フォールバック（実APIと同じ3項目のみ） */
const buildMockTalentsResponse = (): TalentsApiResponse => {
  const raw = {
    status: true,
    data: {
      talents: [
        { id: '1', talentName: 'ときのそら', talentNameEn: 'Tokino Sora' },
        { id: '2', talentName: 'ロボ子さん', talentNameEn: 'Roboco-san' },
      ],
    },
  };
  return normalizeTalentsResponse(raw) ?? { status: true, data: { talents: [] } };
};

/**
 * GET …/oshi-katsu-saport/talents
 * レスポンスは id / talentName / talentNameEn のみ。他項目はクライアントで補完。
 */
export const useTalentsGetApi = () => {
  const executeTalentsGet = useCallback(async (): Promise<{
    apiResponse: TalentsApiResponse | null;
    error: unknown;
  }> => {
    const url = resolveTalentsApiUrl();
    if (!url) {
      return { apiResponse: buildMockTalentsResponse(), error: null };
    }

    try {
      const apiResponse = await requestTalents(url);
      if (apiResponse) {
        return { apiResponse, error: null };
      }
      return { apiResponse: null, error: new Error('Talents API failed') };
    } catch (error) {
      console.error('Talents API Error:', error);
      return { apiResponse: null, error };
    }
  }, []);

  return {
    executeTalentsGet,
    loading: false,
    error: null,
  };
};
