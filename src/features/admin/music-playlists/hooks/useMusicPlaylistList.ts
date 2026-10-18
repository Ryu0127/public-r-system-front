import { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiHeaders } from 'config/api';
import {
  AdminMusicPlaylist,
  MusicPlaylistListResponse,
} from '../../music-playlist-edit/types';
import { readApiErrorMessage } from '../../music-playlist-edit/utils/readApiErrorMessage';

/**
 * プレイリスト一覧（非表示含む・登録順）の取得
 */
export const useMusicPlaylistList = () => {
  const [playlists, setPlaylists] = useState<AdminMusicPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.musicPlaylists.list, {
        method: 'GET',
        headers: getApiHeaders(),
      });
      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, 'プレイリストの取得に失敗しました'));
      }
      const apiResponse: MusicPlaylistListResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'プレイリストの取得に失敗しました');
      }
      setPlaylists(apiResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プレイリストの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, fetchPlaylists };
};
