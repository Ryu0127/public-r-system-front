import useFetchDataTs from 'utils/useFetchDataTs';

export interface FavoritesApiData {
  showParadeIds: number[];
  attractionIds: number[];
  foodMenuIds: number[];
}

export interface FavoritesApiResponse {
  status: boolean;
  data: FavoritesApiData;
  message?: string;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/favorites`;
};

/**
 * GET /showtimes/favorites
 * お気に入り一覧取得API
 */
export const useFavoritesGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeFavoritesGet = async () => {
    try {
      const { response, error: fetchError } = await executeFetch('GET', getApiUrl());
      const apiResponse = response as FavoritesApiResponse;

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
    executeFavoritesGet,
    loading,
    error,
  };
};
