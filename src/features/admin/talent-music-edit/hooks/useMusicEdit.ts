import { useState, useEffect } from 'react';
import {
  AdminMusic,
  MusicListResponse,
  MusicMutationResponse,
  MusicDeleteResponse,
} from '../types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useMusicEdit = () => {
  const [musicList, setMusicList] = useState<AdminMusic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 楽曲一覧を取得
  const fetchMusicList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.list, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MusicListResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の取得に失敗しました');
      }

      setMusicList(apiResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の取得に失敗しました';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 楽曲を作成
  const createMusic = async (musicData: Partial<AdminMusic>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.create, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MusicMutationResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の作成に失敗しました');
      }

      setMusicList((prev) => [apiResponse.data, ...prev]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の作成に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 楽曲を更新
  const updateMusic = async (
    id: string,
    musicData: Partial<AdminMusic>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.update(id), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MusicMutationResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の更新に失敗しました');
      }

      setMusicList((prev) =>
        prev.map((music) =>
          music.id.toString() === id ? apiResponse.data : music
        )
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の更新に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 楽曲を削除
  const deleteMusic = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.delete(id), {
        method: 'DELETE',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MusicDeleteResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の削除に失敗しました');
      }

      setMusicList((prev) =>
        prev.filter((music) => music.id !== apiResponse.data.id)
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の削除に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // IDで楽曲を取得
  const getMusicById = (id: string): AdminMusic | undefined => {
    return musicList.find((music) => music.id.toString() === id);
  };

  // 初期データの取得
  useEffect(() => {
    fetchMusicList();
  }, []);

  return {
    musicList,
    loading,
    error,
    fetchMusicList,
    createMusic,
    updateMusic,
    deleteMusic,
    getMusicById,
  };
};
