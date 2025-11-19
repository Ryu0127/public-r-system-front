import useFetchDataTs from 'utils/useFetchDataTs';

export interface AutoLoginApiResponse {
  status: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    autoLoginToken: string;
  };
  errors?: any;
}

export interface AutoLoginApiRequest {
  autoLoginToken: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/auth/auto-login`;
};

/**
 * /auth/auto-login
 * 自動ログイン認証API
 */
export const useAutoLoginPostApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeAutoLogin = async (requestParam: AutoLoginApiRequest) => {
    try {
      // API実行
      const { response, error } = await executeFetch('POST', getApiUrl(), requestParam);
      const apiResponse = response as AutoLoginApiResponse;

      if (error) {
        // API呼出が異常の場合
        console.error('API Error:', error);
      }

      // 正常終了時の処理
      return {
        apiResponse,
        error
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        apiResponse: null,
        error
      };
    }
  };

  return {
    executeAutoLogin,
    loading,
    error
  };
};
