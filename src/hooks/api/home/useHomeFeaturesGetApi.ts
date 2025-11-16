import useFetchDataTs from 'utils/useFetchDataTs';

export interface HomeFeaturesApiResponse {
  status: boolean;
  data: {
    features: HomeFeature[];
  };
}

export interface HomeFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/home/features`;
};

/**
 * /home/features
 * ホーム画面機能一覧取得API
 */
export const useHomeFeaturesGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeHomeFeaturesGet = async () => {
    try {
      // API実行
      console.log(getApiUrl());
      const { response, error } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as HomeFeaturesApiResponse;
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
    executeHomeFeaturesGet,
    loading,
    error,
  };
};
