import { useCallback } from 'react';
import type { MusicPlaylist } from 'features/talent-music/types';

/** YouTube プレイリストID として許可する形式 */
const YOUTUBE_PLAYLIST_CODE_PATTERN = /^[A-Za-z0-9_-]{2,64}$/;

const buildPlaylistUrl = (code: string): string =>
  `https://www.youtube.com/playlist?list=${encodeURIComponent(code)}`;

/** モックデータ（API URL 未設定時のみ使用） */
const MOCK_PLAYLISTS: MusicPlaylist[] = [
  {
    id: 1,
    youtubePlaylistCode: 'PL_0A0t0-Y0AMZWQAuvcAf_VzfKKhxqvO4',
    name: 'おすすめ楽曲プレイリスト',
    url: buildPlaylistUrl('PL_0A0t0-Y0AMZWQAuvcAf_VzfKKhxqvO4'),
  },
];

export interface MusicPlaylistsFetchParams {
  /** タレント slug（指定時はそのタレントが含まれるプレイリストのみ） */
  talentSlug?: string;
}

function resolvePlaylistsApiUrl(params: MusicPlaylistsFetchParams): string | null {
  const base = process.env.REACT_APP_API_DOMAIN?.trim();
  const path = '/oshi-katsu-saport/talent-music/playlists';
  const talentSlug = params.talentSlug?.trim() ?? '';
  const query = talentSlug ? `?${new URLSearchParams({ talent: talentSlug }).toString()}` : '';
  if (base) {
    return `${base.replace(/\/$/, '')}${path}${query}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return `/api${path}${query}`;
  }
  return null;
}

/**
 * レスポンスを画面用に正規化
 * URL はレスポンスの値を使わず、検証済みのプレイリストIDからフロントで組み立てる
 */
function normalizePlaylists(raw: unknown): MusicPlaylist[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const statusOk = r.status === true || r.status === 1;
  if (!statusOk || !r.data || typeof r.data !== 'object') return null;
  const list = (r.data as Record<string, unknown>).playlists;
  if (!Array.isArray(list)) return null;

  const out: MusicPlaylist[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const p = item as Record<string, unknown>;
    const code = String(p.youtubePlaylistCode ?? p.youtube_playlist_code ?? '').trim();
    const name = String(p.name ?? p.playlist_name ?? '').trim();
    const id = Number(p.id);
    if (!YOUTUBE_PLAYLIST_CODE_PATTERN.test(code) || !name || seen.has(code)) continue;
    seen.add(code);
    out.push({
      id: Number.isFinite(id) ? id : out.length + 1,
      youtubePlaylistCode: code,
      name,
      url: buildPlaylistUrl(code),
    });
  }
  return out;
}

/**
 * GET …/oshi-katsu-saport/talent-music/playlists（?talent= で絞り込み）
 *
 * レスポンス:
 * { status: true, data: { playlists: [{ id, youtubePlaylistCode, name, url }] } }
 */
export const useMusicPlaylistsGetApi = () => {
  const executeMusicPlaylistsGet = useCallback(async (params: MusicPlaylistsFetchParams = {}): Promise<{
    playlists: MusicPlaylist[];
    error: unknown;
  }> => {
    const url = resolvePlaylistsApiUrl(params);
    if (!url) {
      // モックにはタレントとの紐付けがないため、タレント指定時は空（楽曲一覧のモックと同じ扱い）
      return { playlists: params.talentSlug?.trim() ? [] : MOCK_PLAYLISTS, error: null };
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('Music playlists API HTTP error:', res.status, res.statusText);
        return { playlists: [], error: new Error(`HTTP ${res.status}`) };
      }
      const playlists = normalizePlaylists(await res.json());
      if (!playlists) {
        return { playlists: [], error: new Error('Music playlists API: invalid response') };
      }
      return { playlists, error: null };
    } catch (error) {
      console.error('Music playlists API Error:', error);
      return { playlists: [], error };
    }
  }, []);

  return { executeMusicPlaylistsGet };
};
