import useFetchDataTs from 'utils/useFetchDataTs';

export interface EgoSearchTalentsApiResponse {
  status: boolean;
  data: {
    talents: Talent[];
  };
}

export interface SearchWordGroup {
  gropuName: string; // Note: API has typo "gropu" instead of "group"
  keywords: string[];
}

export interface Talent {
  id: string;
  talentName: string;
  talentNameEn: string;
  groupName: string;
  groupId: number;
  twitterAccounts: string[];
  searchWordGroups: SearchWordGroup[];
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/ego-search/talents`;
};

/**
 * /oshi-katsu-saport/ego-search/talents
 * エゴサーチサポート用タレント一覧取得API
 */
export const useEgoSearchTalentsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeEgoSearchTalentsGet = async () => {
    try {
      const { response, error } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as EgoSearchTalentsApiResponse;

      if (!apiResponse?.status) {
        // APIからエラーレスポンスが返却された場合
        console.error('API returned error status');
      }

      if (error) {
        // API呼出が異常の場合
        console.error('API Error:', error);
      }

      // 正常終了時の処理
      return {
        apiResponse,
        error
      }
    } catch (error) {
      // API呼出が異常の場合
      console.error('API Error:', error);
      return {
        apiResponse: null,
        error
      }
    }
  };

  return {
    executeEgoSearchTalentsGet,
    loading,
    error,
  };
};
