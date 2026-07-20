import useFetchDataTs from 'utils/useFetchDataTs';
import { FavoriteType } from 'features/showtimes/tdl-showtimes/constants/favoriteType';

export interface FavoritesDeleteApiResponse {
  status: boolean;
  message?: string;
}

const getApiUrl = (favoriteType: FavoriteType, targetId: number): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/favorites/${favoriteType}/${targetId}`;
};

/**
 * DELETE /showtimes/favorites/{favoriteType}/{targetId}
 * お気に入り解除API
 */
export const useFavoritesDeleteApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeFavoritesDelete = async (
    favoriteType: FavoriteType,
    targetId: number
  ) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'DELETE',
        getApiUrl(favoriteType, targetId)
      );
      const apiResponse = response as FavoritesDeleteApiResponse;

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
    executeFavoritesDelete,
    loading,
    error,
  };
};
