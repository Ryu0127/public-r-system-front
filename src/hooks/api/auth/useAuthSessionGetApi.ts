import useFetchDataTs from 'utils/useFetchDataTs';

export interface AuthSessionApiResponse {
  status: boolean;
  message: string;
  data?: {
    userId: number;
  };
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/auth/session`;
};

/**
 * GET /auth/session
 * Bearer トークンがサーバー側で有効か検証する
 */
export const useAuthSessionGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeSession = async () => {
    try {
      const { response, error: fetchErr } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as AuthSessionApiResponse;

      if (fetchErr) {
        console.error('API Error:', fetchErr);
      }

      return {
        apiResponse,
        error: fetchErr
      };
    } catch (err) {
      console.error('Unexpected error:', err);
      return {
        apiResponse: null as AuthSessionApiResponse | null,
        error: err
      };
    }
  };

  return {
    executeSession,
    loading,
    error
  };
};
