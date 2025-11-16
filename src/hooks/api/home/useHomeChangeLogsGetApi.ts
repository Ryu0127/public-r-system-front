import useFetchDataTs from 'utils/useFetchDataTs';

export interface HomeChangeLogsApiResponse {
  status: boolean;
  data: {
    changeLogs: HomeChangeLog[];
  };
}

export interface HomeChangeLog {
  id: string;
  version: string;
  date: string;
  changes: string[];
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/home/change-logs`;
};

/**
 * /home/change-logs
 * ホーム画面更新履歴取得API
 */
export const useHomeChangeLogsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeHomeChangeLogsGet = async () => {
    try {
      // API実行
      console.log(getApiUrl());
      const { response, error } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as HomeChangeLogsApiResponse;
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
    executeHomeChangeLogsGet,
    loading,
    error,
  };
};
