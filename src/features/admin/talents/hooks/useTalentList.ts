import { useState, useEffect } from 'react';
import { AdminTalent, TalentListResponse, TalentDeleteResponse } from '../../talent-edit/types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useTalentList = () => {
  const [talents, setTalents] = useState<AdminTalent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // タレント一覧を取得
  const fetchTalents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talents.list, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: TalentListResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'タレントの取得に失敗しました');
      }

      setTalents(apiResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タレントの取得に失敗しました';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // タレントを削除
  const deleteTalent = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talents.delete(id), {
        method: 'DELETE',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: TalentDeleteResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'タレントの削除に失敗しました');
      }

      setTalents((prev) => prev.filter((talent) => talent.id !== apiResponse.data.id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タレントの削除に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // IDでタレントを取得
  const getTalentById = (id: string): AdminTalent | undefined => {
    return talents.find((talent) => talent.id === id);
  };

  // 初期データの取得
  useEffect(() => {
    fetchTalents();
  }, []);

  return {
    talents,
    loading,
    error,
    fetchTalents,
    deleteTalent,
    getTalentById,
  };
};
