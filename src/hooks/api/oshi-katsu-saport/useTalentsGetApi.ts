import useFetchDataTs from 'utils/useFetchDataTs';

export interface TalentsApiResponse {
  status: boolean;
  data: {
    talents: Talent[];
  };
}

export interface Talent {
  id: string;
  key: string;
  name: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/talents`;
};

/**
 * /oshi-katsu-saport/talents
 * タレント一覧取得API
 */
export const useTalentsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeTalentsGet = async () => {
    try {
      // API実行
      console.log(getApiUrl());
      const { response, error } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as TalentsApiResponse;
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
    executeTalentsGet,
    loading,
    error,
  };
};
