import { useState, useEffect, useCallback } from 'react';
import {
  AdminMusic,
  MusicListResponse,
  MusicDetailResponse,
  MusicMutationResponse,
  MusicDeleteResponse,
} from '../types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useMusicEdit = () => {
  const [musicList, setMusicList] = useState<AdminMusic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readApiErrorMessage = useCallback(async (response: Response, defaultMessage: string) => {
    try {
      const text = await response.text();
      if (!text) return defaultMessage;
      try {
        const body = JSON.parse(text);
        if (body?.error) return String(body.error);
        if (body?.message) return String(body.message);
        if (body?.errors) return defaultMessage;
      } catch {
        // JSONではない場合は本文をそのまま返す（HTML等）
        return text.slice(0, 500);
      }
    } catch {
      return defaultMessage;
    }
    return defaultMessage;
  }, []);

  // 楽曲一覧を取得
  const fetchMusicList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.list, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(response, `HTTP error! status: ${response.status}`)
        );
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
  }, [readApiErrorMessage]);

  // 楽曲を作成
  const createMusic = async (musicData: Partial<AdminMusic>): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.create, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(response, `HTTP error! status: ${response.status}`)
        );
      }

      const apiResponse: MusicMutationResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の作成に失敗しました');
      }

      setMusicList((prev) => [apiResponse.data, ...prev]);
      return apiResponse.data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の作成に失敗しました';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 楽曲を更新
  const updateMusic = async (
    id: string,
    musicData: Partial<AdminMusic>
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.update(id), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(musicData),
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(response, `HTTP error! status: ${response.status}`)
        );
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
      return apiResponse.data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の更新に失敗しました';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 楽曲を削除
  const deleteMusic = async (id: string): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.delete(id), {
        method: 'DELETE',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(response, `HTTP error! status: ${response.status}`)
        );
      }

      const apiResponse: MusicDeleteResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲の削除に失敗しました');
      }

      setMusicList((prev) =>
        prev.filter((music) => music.id !== apiResponse.data.id)
      );
      return apiResponse.data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲の削除に失敗しました';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // IDで楽曲を取得
  const fetchMusicById = async (id: string): Promise<AdminMusic | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talentMusic.detail(id), {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MusicDetailResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || '楽曲詳細の取得に失敗しました');
      }

      setMusicList((prev) => {
        const exists = prev.some((music) => music.id === apiResponse.data.id);
        if (exists) {
          return prev.map((music) =>
            music.id === apiResponse.data.id ? apiResponse.data : music
          );
        }
        return [apiResponse.data, ...prev];
      });
      return apiResponse.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '楽曲詳細の取得に失敗しました';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMusicById = (id: string): AdminMusic | undefined => {
    return musicList.find((music) => music.id.toString() === id);
  };

  // 初期データの取得
  useEffect(() => {
    fetchMusicList();
  }, [fetchMusicList]);

  return {
    musicList,
    loading,
    error,
    fetchMusicList,
    createMusic,
    updateMusic,
    deleteMusic,
    fetchMusicById,
    getMusicById,
  };
};
