import { useState, useEffect } from 'react';
import { AdminMusic, MusicListResponse } from '../../talent-music-edit/types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useMusicList = () => {
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
    getMusicById,
  };
};
