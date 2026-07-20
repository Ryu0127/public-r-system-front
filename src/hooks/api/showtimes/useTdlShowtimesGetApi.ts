import useFetchDataTs from 'utils/useFetchDataTs';
import { ShowtimesApiResponse } from 'features/showtimes/tdl-showtimes/types';

const getApiUrl = (date: string): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/tdl?date=${encodeURIComponent(date)}`;
};

/**
 * GET /showtimes/tdl
 * TDL ショー&パレード / 混雑データ取得API
 */
export const useTdlShowtimesGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeTdlShowtimesGet = async (date: string) => {
    try {
      const { response, error: fetchError } = await executeFetch('GET', getApiUrl(date));
      const apiResponse = response as ShowtimesApiResponse;

      if (!apiResponse?.status) {
        console.error('API returned error status');
      }
      if (fetchError) {
        console.error('API Error:', fetchError);
      }

      return {
        apiResponse,
        error: fetchError,
      };
    } catch (err) {
      console.error('API Error:', err);
      return {
        apiResponse: null,
        error: err,
      };
    }
  };

  return {
    executeTdlShowtimesGet,
    loading,
    error,
  };
};
