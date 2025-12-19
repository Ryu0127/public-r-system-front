import { useState, useCallback } from 'react';
import {
  AdminTalent,
  TalentListResponse,
  TalentDetailResponse,
  TalentMutationResponse,
  TalentDeleteResponse,
} from '../types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useTalentEdit = () => {
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

  // タレント詳細を取得
  const fetchTalentById = useCallback(async (id: string): Promise<AdminTalent | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talents.detail(id), {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: TalentDetailResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'タレントの取得に失敗しました');
      }

      return apiResponse.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タレントの取得に失敗しました';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // タレントを作成
  const createTalent = async (talentData: Partial<AdminTalent>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talents.create, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(talentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: TalentMutationResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'タレントの作成に失敗しました');
      }

      setTalents((prev) => [apiResponse.data, ...prev]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タレントの作成に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // タレントを更新
  const updateTalent = async (
    id: string,
    talentData: Partial<AdminTalent>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.talents.update(id), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(talentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: TalentMutationResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'タレントの更新に失敗しました');
      }

      setTalents((prev) =>
        prev.map((talent) => (talent.id === id ? apiResponse.data : talent))
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タレントの更新に失敗しました';
      setError(errorMessage);
      console.error(err);
      return false;
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
    return talents.find((talent) => talent.id.toString() === id);
  };

  return {
    talents,
    loading,
    error,
    fetchTalents,
    fetchTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    getTalentById,
  };
};
