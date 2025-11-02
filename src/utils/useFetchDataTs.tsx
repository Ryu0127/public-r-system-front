import { useCallback, useState } from 'react';

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * APIリクエスト用カスタムフック
 * 
 * @returns 
 */
const useFetchDataTs = () => {
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * APIリクエスト実行
   */
  const executeFetch = useCallback(async (
    method: string,
    apiUrl: string,
    requestParam: unknown = null
  ) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('api-call...');
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (method !== 'GET' && requestParam) {
        fetchOptions.body = JSON.stringify(requestParam);
      }

      const fetchResponse = await fetch(apiUrl, fetchOptions);
      const result = await fetchResponse.json();
      setResponse(result);

      return { response: result, error: null };
    } catch (err) {
      console.log('api-call-error');
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);

      return { response: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    response,
    error,
    executeFetch
  };
};

export default useFetchDataTs;