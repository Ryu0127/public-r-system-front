import { useCallback } from 'react';

/**
 * GET /oshi-katsu-saport/talent-music/talents の data.talents[] 1件
 */
export interface TalentsListApiRow {
  id: string | number;
  talentName: string;
  talentNameEn: string;
  talentSlug?: string;
  groupId?: number;
  groupName?: string;
  iconImgUrl?: string;
}

/**
 * data.groups[].talents[] 1件（グループ側にはタレント自体の groupId/groupName は含まれない）
 */
export interface TalentGroupTalentApiRow {
  id: string | number;
  talentName: string;
  talentNameEn: string;
  talentSlug?: string;
  iconImgUrl?: string;
}

/** data.groups[] 1件 */
export interface TalentGroupApiItem {
  groupId: number;
  groupName: string;
  groupNameEn: string;
  talents: TalentGroupTalentApiRow[];
}

export interface TalentsApiResponse {
  status: boolean;
  data: {
    talents: Talent[];
    groups: TalentGroupApiItem[];
  };
}

/**
 * 一覧APIを正規化したタレント（画面用）
 */
export interface Talent extends TalentsListApiRow {
  id: string;
  groupName: string;
  groupId: number;
  twitterAccounts: string[];
  iconImgUrl?: string;
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
      talentSlug: t.talentSlug != null ? String(t.talentSlug) : undefined,
      groupName: gn !== undefined && gn !== null ? String(gn) : '',
      groupId: gid !== undefined && gid !== null && gid !== '' ? Number(gid) : 0,
      twitterAccounts: Array.isArray(tw) ? tw.map((x) => String(x)) : [],
      iconImgUrl: t.iconImgUrl != null ? String(t.iconImgUrl) : undefined,
    };
  });

  const groups: TalentGroupApiItem[] = Array.isArray(d.groups)
    ? d.groups.map((g) => {
        const grp = g as Record<string, unknown>;
        const groupTalents: TalentGroupTalentApiRow[] = Array.isArray(grp.talents)
          ? grp.talents.map((t) => {
              const talent = t as Record<string, unknown>;
              return {
                id: String(talent.id ?? ''),
                talentName: String(talent.talentName ?? ''),
                talentNameEn: String(talent.talentNameEn ?? ''),
                talentSlug: talent.talentSlug != null ? String(talent.talentSlug) : undefined,
                iconImgUrl: talent.iconImgUrl != null ? String(talent.iconImgUrl) : undefined,
              };
            })
          : [];
        return {
          groupId: Number(grp.groupId ?? 0),
          groupName: String(grp.groupName ?? ''),
          groupNameEn: String(grp.groupNameEn ?? ''),
          talents: groupTalents,
        };
      })
    : [];

  return { status: true, data: { talents, groups } };
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

/** 開発用フォールバック（APIレスポンス新フォーマット準拠） */
const buildMockTalentsResponse = (): TalentsApiResponse => {
  const raw = {
    status: true,
    data: {
      talents: [
        // 0期生 (groupId: 0)
        { id: 1,  talentName: 'ときのそら',          talentNameEn: 'Tokino Sora',       talentSlug: 'tokino-sora',   groupId: 0, groupName: '0期生' },
        { id: 2,  talentName: 'ロボ子さん',           talentNameEn: 'Roboco-san',         talentSlug: 'roboco',        groupId: 0, groupName: '0期生' },
        { id: 3,  talentName: 'さくらみこ',           talentNameEn: 'Sakura Miko',        talentSlug: 'sakura-miko',   groupId: 0, groupName: '0期生' },
        { id: 4,  talentName: '星街すいせい',         talentNameEn: 'Hoshimachi Suisei',  talentSlug: 'suisei',        groupId: 0, groupName: '0期生' },
        { id: 5,  talentName: 'AZKi',                 talentNameEn: 'AZKi',               talentSlug: 'azki',          groupId: 0, groupName: '0期生' },
        // 1期生 (groupId: 1)
        { id: 6,  talentName: '夜空メル',             talentNameEn: 'Yozora Mel',         talentSlug: 'yozora-mel',    groupId: 1, groupName: '1期生' },
        { id: 7,  talentName: 'アキ・ローゼンタール', talentNameEn: 'Aki Rosenthal',      talentSlug: 'aki-rosenthal', groupId: 1, groupName: '1期生' },
        { id: 8,  talentName: '赤井はあと',           talentNameEn: 'Haachama',           talentSlug: 'haachama',      groupId: 1, groupName: '1期生' },
        { id: 9,  talentName: '白上フブキ',           talentNameEn: 'Shirakami Fubuki',   talentSlug: 'fubuki',        groupId: 1, groupName: '1期生' },
        { id: 10, talentName: '夏色まつり',           talentNameEn: 'Natsuiro Matsuri',   talentSlug: 'matsuri',       groupId: 1, groupName: '1期生' },
        // 2期生 (groupId: 2)
        { id: 11, talentName: '湊あくあ',             talentNameEn: 'Minato Aqua',        talentSlug: 'aqua',          groupId: 2, groupName: '2期生' },
        { id: 12, talentName: '紫咲シオン',           talentNameEn: 'Murasaki Shion',     talentSlug: 'shion',         groupId: 2, groupName: '2期生' },
        { id: 13, talentName: '百鬼あやめ',           talentNameEn: 'Nakiri Ayame',       talentSlug: 'ayame',         groupId: 2, groupName: '2期生' },
        { id: 14, talentName: '癒月ちょこ',           talentNameEn: 'Yuzuki Choco',       talentSlug: 'choco',         groupId: 2, groupName: '2期生' },
        { id: 15, talentName: '大空スバル',           talentNameEn: 'Oozora Subaru',      talentSlug: 'subaru',        groupId: 2, groupName: '2期生' },
        // 3期生 (groupId: 4 ※ゲーマーズが3のため)
        { id: 16, talentName: '兎田ぺこら',           talentNameEn: 'Usada Pekora',       talentSlug: 'pekora',        groupId: 4, groupName: '3期生' },
        { id: 17, talentName: '不知火フレア',         talentNameEn: 'Shiranui Flare',     talentSlug: 'flare',         groupId: 4, groupName: '3期生' },
        { id: 18, talentName: '白銀ノエル',           talentNameEn: 'Shirogane Noel',     talentSlug: 'noel',          groupId: 4, groupName: '3期生' },
        { id: 19, talentName: '宝鐘マリン',           talentNameEn: 'Houshou Marine',     talentSlug: 'marine',        groupId: 4, groupName: '3期生' },
      ],
      groups: [
        { groupId: 0,  groupName: '0期生',           groupNameEn: 'Generation 0',        talents: [
          { id: 1,  talentName: 'ときのそら',          talentNameEn: 'Tokino Sora',       talentSlug: 'tokino-sora'   },
          { id: 2,  talentName: 'ロボ子さん',           talentNameEn: 'Roboco-san',         talentSlug: 'roboco'        },
          { id: 3,  talentName: 'さくらみこ',           talentNameEn: 'Sakura Miko',        talentSlug: 'sakura-miko'   },
          { id: 4,  talentName: '星街すいせい',         talentNameEn: 'Hoshimachi Suisei',  talentSlug: 'suisei'        },
          { id: 5,  talentName: 'AZKi',                 talentNameEn: 'AZKi',               talentSlug: 'azki'          },
        ]},
        { groupId: 1,  groupName: '1期生',           groupNameEn: '1st Generation',      talents: [
          { id: 6,  talentName: '夜空メル',             talentNameEn: 'Yozora Mel',        talentSlug: 'yozora-mel'    },
          { id: 7,  talentName: 'アキ・ローゼンタール', talentNameEn: 'Aki Rosenthal',     talentSlug: 'aki-rosenthal' },
          { id: 8,  talentName: '赤井はあと',           talentNameEn: 'Haachama',          talentSlug: 'haachama'      },
          { id: 9,  talentName: '白上フブキ',           talentNameEn: 'Shirakami Fubuki',  talentSlug: 'fubuki'        },
          { id: 10, talentName: '夏色まつり',           talentNameEn: 'Natsuiro Matsuri',  talentSlug: 'matsuri'       },
        ]},
        { groupId: 2,  groupName: '2期生',           groupNameEn: '2nd Generation',      talents: [
          { id: 11, talentName: '湊あくあ',   talentNameEn: 'Minato Aqua',    talentSlug: 'aqua'   },
          { id: 12, talentName: '紫咲シオン', talentNameEn: 'Murasaki Shion', talentSlug: 'shion'  },
          { id: 13, talentName: '百鬼あやめ', talentNameEn: 'Nakiri Ayame',   talentSlug: 'ayame'  },
          { id: 14, talentName: '癒月ちょこ', talentNameEn: 'Yuzuki Choco',   talentSlug: 'choco'  },
          { id: 15, talentName: '大空スバル', talentNameEn: 'Oozora Subaru',  talentSlug: 'subaru' },
        ]},
        { groupId: 3,  groupName: 'ホロライブゲーマーズ', groupNameEn: 'hololive GAMERS',    talents: [] },
        { groupId: 4,  groupName: '3期生',           groupNameEn: '3rd Generation',      talents: [
          { id: 16, talentName: '兎田ぺこら',   talentNameEn: 'Usada Pekora',   talentSlug: 'pekora' },
          { id: 17, talentName: '不知火フレア', talentNameEn: 'Shiranui Flare', talentSlug: 'flare'  },
          { id: 18, talentName: '白銀ノエル',   talentNameEn: 'Shirogane Noel', talentSlug: 'noel'   },
          { id: 19, talentName: '宝鐘マリン',   talentNameEn: 'Houshou Marine', talentSlug: 'marine' },
        ]},
        { groupId: 5,  groupName: '4期生',           groupNameEn: '4th Generation',      talents: [] },
        { groupId: 6,  groupName: '5期生',           groupNameEn: '5th Generation',      talents: [] },
        { groupId: 7,  groupName: '秘密結社holoX',   groupNameEn: 'Secret Society holoX', talents: [] },
        { groupId: 8,  groupName: 'Myth',             groupNameEn: 'Myth',                talents: [] },
        { groupId: 9,  groupName: 'Project: HOPE',   groupNameEn: 'Project: HOPE',       talents: [] },
        { groupId: 10, groupName: 'Council',          groupNameEn: 'Council',             talents: [] },
        { groupId: 11, groupName: 'Promise',          groupNameEn: 'Promise',             talents: [] },
        { groupId: 12, groupName: 'Advent',           groupNameEn: 'Advent',              talents: [] },
        { groupId: 13, groupName: 'Justice',          groupNameEn: 'Justice',             talents: [] },
        { groupId: 14, groupName: 'ReGLOSS',          groupNameEn: 'ReGLOSS',             talents: [] },
        { groupId: 15, groupName: 'FLOW GLOW',        groupNameEn: 'FLOW GLOW',           talents: [] },
        { groupId: 16, groupName: 'holoAN',           groupNameEn: 'holoAN',              talents: [] },
        { groupId: 17, groupName: '事務所スタッフ',       groupNameEn: 'Office Staff',        talents: [] },
        { groupId: 18, groupName: 'ホロライブインドネシア', groupNameEn: 'hololive Indonesia',  talents: [] },
      ],
    },
  };
  return normalizeTalentsResponse(raw) ?? { status: true, data: { talents: [], groups: [] } };
};

/**
 * GET …/oshi-katsu-saport/talent-music/talents
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
