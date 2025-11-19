import useFetchDataTs from 'utils/useFetchDataTs';

export interface LoginApiResponse {
  status: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    autoLoginToken: string;
  };
  errors?: any;
  warning?: boolean;
  warningMessage?: string;
  locked?: boolean;
}

export interface LoginApiRequest {
  email: string;
  password: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/auth/login`;
};

/**
 * /auth/login
 * ログインAPI
 */
export const useLoginPostApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeLogin = async (requestParam: LoginApiRequest) => {
    try {
      // API実行
      const { response, error } = await executeFetch('POST', getApiUrl(), requestParam);
      const apiResponse = response as LoginApiResponse;

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
    executeLogin,
    loading,
    error
  };
};
