import { useState } from 'react';
import { Collaborator } from '../types';

export interface CollaboratorsApiResponse {
  status: boolean;
  data: {
    collaborators: Collaborator[];
  };
}

// モックデータ
const mockCollaboratorsData: Record<string, Collaborator[]> = {
  // ときのそらのコラボ相手
  'tokino-sora': [
    {
      id: 'roboco',
      talentName: 'ロボ子さん',
      talentNameEn: 'Roboco',
      collaborationCount: 25,
    },
    {
      id: 'azki',
      talentName: 'AZKi',
      talentNameEn: 'AZKi',
      collaborationCount: 18,
    },
  ],
  // 星街すいせいのコラボ相手（例）
  '1': [
    {
      id: '2',
      talentName: 'さくらみこ',
      talentNameEn: 'Sakura Miko',
      collaborationCount: 15,
    },
    {
      id: '3',
      talentName: '天音かなた',
      talentNameEn: 'Amane Kanata',
      collaborationCount: 12,
    },
    {
      id: '4',
      talentName: '白銀ノエル',
      talentNameEn: 'Shirogane Noel',
      collaborationCount: 8,
    },
  ],
  // 他のタレントのモックデータも追加可能
  '2': [
    {
      id: '1',
      talentName: '星街すいせい',
      talentNameEn: 'Hoshimachi Suisei',
      collaborationCount: 15,
    },
    {
      id: '5',
      talentName: '宝鐘マリン',
      talentNameEn: 'Houshou Marine',
      collaborationCount: 20,
    },
  ],
};

/**
 * コラボレーター一覧取得API（モック版）
 * 実際のAPIが実装されたら、この関数を置き換えてください
 */
export const useCollaboratorsGetApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // APIリクエスト処理（モック）
  const executeCollaboratorsGet = async (talentId: string) => {
    setLoading(true);
    setError(null);

    try {
      // 実際のAPI呼び出しをシミュレート（500ms待機）
      await new Promise((resolve) => setTimeout(resolve, 500));

      // モックデータを取得
      const collaborators = mockCollaboratorsData[talentId] || [];

      const apiResponse: CollaboratorsApiResponse = {
        status: true,
        data: {
          collaborators,
        },
      };

      setLoading(false);

      return {
        apiResponse,
        error: null,
      };
    } catch (err) {
      console.error('API Error:', err);
      setError(err);
      setLoading(false);

      return {
        apiResponse: null,
        error: err,
      };
    }
  };

  return {
    executeCollaboratorsGet,
    loading,
    error,
  };
};

/*
 * 実際のAPI実装例（参考）:
 *
 * import useFetchDataTs from 'utils/useFetchDataTs';
 *
 * const getApiUrl = (talentId: string): string => {
 *   return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/talents/${talentId}/collaborators`;
 * };
 *
 * export const useCollaboratorsGetApi = () => {
 *   const { loading, error, executeFetch } = useFetchDataTs();
 *
 *   const executeCollaboratorsGet = async (talentId: string) => {
 *     try {
 *       const { response, error } = await executeFetch('GET', getApiUrl(talentId));
 *       const apiResponse = response as CollaboratorsApiResponse;
 *
 *       if (!apiResponse?.status) {
 *         console.error('API returned error status');
 *       }
 *       if (error) {
 *         console.error('API Error:', error);
 *       }
 *
 *       return {
 *         apiResponse,
 *         error
 *       };
 *     } catch (error) {
 *       console.error('API Error:', error);
 *       return {
 *         apiResponse: null,
 *         error
 *       };
 *     }
 *   };
 *
 *   return {
 *     executeCollaboratorsGet,
 *     loading,
 *     error,
 *   };
 * };
 */
