import useFetchDataTs from 'utils/useFetchDataTs';

export interface HomeLimitedTimeTopicApiResponse {
  status: boolean;
  data: {
    limitedTimeTopic: HomeLimitedTimeTopic | null;
  };
}

export interface HomeLimitedTimeTopic {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/home/limited-time-topic`;
};

/**
 * /home/limited-time-topic
 * ホーム画面期間限定トピック取得API
 */
export const useHomeLimitedTimeTopicGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeHomeLimitedTimeTopicGet = async () => {
    try {
      // API実行
      console.log(getApiUrl());
      const { response, error } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as HomeLimitedTimeTopicApiResponse;
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
    executeHomeLimitedTimeTopicGet,
    loading,
    error,
  };
};
