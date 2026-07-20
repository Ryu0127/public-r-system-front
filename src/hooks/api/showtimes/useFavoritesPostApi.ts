import useFetchDataTs from 'utils/useFetchDataTs';
import { FavoriteType } from 'features/showtimes/tdl-showtimes/constants/favoriteType';

export interface FavoritesPostApiResponse {
  status: boolean;
  message?: string;
}

export interface FavoritesPostApiRequest {
  favoriteType: FavoriteType;
  targetId: number;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/favorites`;
};

/**
 * POST /showtimes/favorites
 * お気に入り登録API
 */
export const useFavoritesPostApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeFavoritesPost = async (requestParam: FavoritesPostApiRequest) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'POST',
        getApiUrl(),
        requestParam
      );
      const apiResponse = response as FavoritesPostApiResponse;

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
    executeFavoritesPost,
    loading,
    error,
  };
};
