import { useCallback, useState } from 'react';
import { API_ENDPOINTS, getApiHeaders } from 'config/api';
import {
  AdminMusicPlaylist,
  MusicPlaylistDeleteResponse,
  MusicPlaylistDetailResponse,
  MusicPlaylistFormData,
  MusicPlaylistMutationResponse,
} from '../types';
import { readApiErrorMessage } from '../utils/readApiErrorMessage';

/**
 * プレイリストの詳細取得・登録・更新・削除
 */
export const useMusicPlaylistEdit = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylistById = useCallback(async (id: string): Promise<AdminMusicPlaylist | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.musicPlaylists.detail(id), {
        method: 'GET',
        headers: getApiHeaders(),
      });
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, 'プレイリストの取得に失敗しました'));
      }
      const apiResponse: MusicPlaylistDetailResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'プレイリストの取得に失敗しました');
      }
      return apiResponse.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プレイリストの取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 登録・更新共通（成功時は対象ID、失敗時は null） */
  const save = useCallback(
    async (url: string, method: 'POST' | 'PUT', data: MusicPlaylistFormData, failMessage: string) => {
      setSaving(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          headers: getApiHeaders(),
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(await readApiErrorMessage(response, failMessage));
        }
        const apiResponse: MusicPlaylistMutationResponse = await response.json();
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || failMessage);
        }
        return apiResponse.data.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : failMessage);
        return null;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const createPlaylist = useCallback(
    (data: MusicPlaylistFormData) =>
      save(API_ENDPOINTS.musicPlaylists.create, 'POST', data, 'プレイリストの登録に失敗しました'),
    [save]
  );

  const updatePlaylist = useCallback(
    (id: string, data: MusicPlaylistFormData) =>
      save(API_ENDPOINTS.musicPlaylists.update(id), 'PUT', data, 'プレイリストの更新に失敗しました'),
    [save]
  );

  const deletePlaylist = useCallback(async (id: string): Promise<number | null> => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.musicPlaylists.delete(id), {
        method: 'DELETE',
        headers: getApiHeaders(),
      });
      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, 'プレイリストの削除に失敗しました'));
      }
      const apiResponse: MusicPlaylistDeleteResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'プレイリストの削除に失敗しました');
      }
      return apiResponse.data.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プレイリストの削除に失敗しました');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    loading,
    saving,
    error,
    fetchPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  };
};
