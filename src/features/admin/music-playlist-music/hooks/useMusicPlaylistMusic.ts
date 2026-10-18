import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS, getApiHeaders } from 'config/api';
import {
  AdminMusicPlaylist,
  MusicPlaylistDetailResponse,
  PlaylistMusicItem,
  PlaylistMusicListResponse,
} from '../../music-playlist-edit/types';
import { AdminMusic, MusicListResponse } from '../../talent-music-edit/types';
import { TalentListResponse } from '../../talent-edit/types';
import { readApiErrorMessage } from '../../music-playlist-edit/utils/readApiErrorMessage';

/** 1プレイリストに紐付けできる楽曲数の上限（API と同一） */
export const PLAYLIST_MUSIC_MAX_COUNT = 500;

/** 1楽曲に紐付けできるタレント数の上限（API と同一） */
export const PLAYLIST_MUSIC_TALENT_MAX_COUNT = 50;

/**
 * 楽曲一覧から追加する楽曲を紐付け用データへ変換
 * タレントは楽曲管理で楽曲に紐付いているタレントを初期値にする
 */
const toPlaylistMusicItem = (music: AdminMusic, sort: number): PlaylistMusicItem => {
  const musicTalentIds = Array.from(new Set(music.talentIds || []));
  return {
    musicId: music.id,
    title: music.title,
    youtubeVideoId: music.youtubeVideoId,
    type: music.type,
    releaseDate: music.releaseDate,
    sort,
    talentIds: musicTalentIds.slice(0, PLAYLIST_MUSIC_TALENT_MAX_COUNT),
    musicTalentIds,
  };
};

/** 並び順・楽曲ごとのタレントを含めた比較用の文字列（未保存の変更判定用） */
const toSignature = (items: PlaylistMusicItem[]): string =>
  JSON.stringify(items.map((m) => [m.musicId, [...m.talentIds].sort((a, b) => a - b)]));

/**
 * タレント名の対応表を取得（失敗しても紐付け操作は可能なため、空の対応表を返す）
 */
const fetchTalentNameMap = async (headers: HeadersInit): Promise<Record<number, string>> => {
  try {
    const response = await fetch(API_ENDPOINTS.talents.list, { method: 'GET', headers });
    if (!response.ok) return {};
    const json: TalentListResponse = await response.json();
    if (!json.success || !Array.isArray(json.data)) return {};
    const map: Record<number, string> = {};
    json.data.forEach((t) => {
      const id = Number(t.id);
      if (Number.isFinite(id) && t.talentName) map[id] = t.talentName;
    });
    return map;
  } catch (err) {
    console.error('タレント取得エラー:', err);
    return {};
  }
};

/**
 * プレイリストへの楽曲紐付け（取得・並べ替え・追加・解除・保存）
 */
export const useMusicPlaylistMusic = (playlistId: string) => {
  const [playlist, setPlaylist] = useState<AdminMusicPlaylist | null>(null);
  const [allMusic, setAllMusic] = useState<AdminMusic[]>([]);
  /** タレントID → タレント名（楽曲のタレント絞り込み・表示用） */
  const [talentNameMap, setTalentNameMap] = useState<Record<number, string>>({});
  /** 編集中の紐付け楽曲（配列順 = 並び順） */
  const [items, setItems] = useState<PlaylistMusicItem[]>([]);
  /** 保存済みの楽曲ID（変更有無の判定用） */
  const [savedSignature, setSavedSignature] = useState(toSignature([]));
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const headers = getApiHeaders();
      const [playlistRes, linkedRes, musicRes] = await Promise.all([
        fetch(API_ENDPOINTS.musicPlaylists.detail(playlistId), { method: 'GET', headers }),
        fetch(API_ENDPOINTS.musicPlaylists.music(playlistId), { method: 'GET', headers }),
        fetch(API_ENDPOINTS.talentMusic.list, { method: 'GET', headers }),
      ]);

      if (playlistRes.status === 404 || linkedRes.status === 404) {
        setNotFound(true);
        return;
      }
      if (!playlistRes.ok) throw new Error(await readApiErrorMessage(playlistRes, 'プレイリストの取得に失敗しました'));
      if (!linkedRes.ok) throw new Error(await readApiErrorMessage(linkedRes, '紐付け楽曲の取得に失敗しました'));
      if (!musicRes.ok) throw new Error(await readApiErrorMessage(musicRes, '楽曲一覧の取得に失敗しました'));

      const playlistJson: MusicPlaylistDetailResponse = await playlistRes.json();
      const linkedJson: PlaylistMusicListResponse = await linkedRes.json();
      const musicJson: MusicListResponse = await musicRes.json();
      if (!playlistJson.success || !linkedJson.success || !musicJson.success) {
        throw new Error('データの取得に失敗しました');
      }

      setPlaylist(playlistJson.data);
      setItems(linkedJson.data);
      setSavedSignature(toSignature(linkedJson.data));
      setAllMusic(musicJson.data);
      setTalentNameMap(await fetchTalentNameMap(headers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    load();
  }, [load]);

  const linkedIdSet = useMemo(() => new Set(items.map((m) => m.musicId)), [items]);
  const isDirty = useMemo(() => toSignature(items) !== savedSignature, [items, savedSignature]);
  const isMaxReached = items.length >= PLAYLIST_MUSIC_MAX_COUNT;

  const addMusic = useCallback((music: AdminMusic) => {
    setNotice(null);
    setItems((prev) => {
      if (prev.some((m) => m.musicId === music.id) || prev.length >= PLAYLIST_MUSIC_MAX_COUNT) return prev;
      return prev.concat(toPlaylistMusicItem(music, prev.length + 1));
    });
  }, []);

  const removeMusic = useCallback((musicId: number) => {
    setNotice(null);
    setItems((prev) => prev.filter((m) => m.musicId !== musicId));
  }, []);

  /** index の楽曲を to の位置へ移動 */
  const moveMusic = useCallback((index: number, to: number) => {
    setNotice(null);
    setItems((prev) => {
      if (index < 0 || index >= prev.length || to < 0 || to >= prev.length || index === to) return prev;
      const next = prev.slice();
      const [moved] = next.splice(index, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  /** 楽曲ごとのタレントを置き換え（重複除去・上限件数で打ち切り） */
  const setMusicTalents = useCallback((musicId: number, talentIds: number[]) => {
    setNotice(null);
    const nextIds = Array.from(new Set(talentIds)).slice(0, PLAYLIST_MUSIC_TALENT_MAX_COUNT);
    setItems((prev) => prev.map((m) => (m.musicId === musicId ? { ...m, talentIds: nextIds } : m)));
  }, []);

  /** 保存済みの状態に戻す */
  const resetChanges = useCallback(() => {
    load();
    setNotice(null);
  }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(API_ENDPOINTS.musicPlaylists.music(playlistId), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify({
          items: items.map((m) => ({ musicId: m.musicId, talentIds: m.talentIds })),
        }),
      });
      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, '紐付け楽曲の保存に失敗しました'));
      }
      const apiResponse: PlaylistMusicListResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || '紐付け楽曲の保存に失敗しました');
      }
      setItems(apiResponse.data);
      setSavedSignature(toSignature(apiResponse.data));
      setNotice(`紐付け楽曲を保存しました（${apiResponse.data.length}曲）`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '紐付け楽曲の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }, [playlistId, items]);

  return {
    playlist,
    allMusic,
    talentNameMap,
    items,
    linkedIdSet,
    loading,
    notFound,
    saving,
    error,
    notice,
    isDirty,
    isMaxReached,
    addMusic,
    removeMusic,
    moveMusic,
    setMusicTalents,
    resetChanges,
    save,
  };
};
