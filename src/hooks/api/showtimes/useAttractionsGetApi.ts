import useFetchDataTs from 'utils/useFetchDataTs';

export interface AttractionApiItem {
  id: number;
  parkType: number;
  attractionName: string;
  areaType: number;
  areaTypeLabel: string | null;
  rankType: number;
  rankTypeLabel: 'S' | 'A' | 'B' | 'C' | null;
  durationMinutes: number | null;
  thumbUrl: string | null;
  publishStartDate: string | null;
  publishEndDate: string | null;
  dpaFlag: number;
  priorityPassFlag: number;
  pauseFlag: number;
}

export interface AttractionsApiResponse {
  status: boolean;
  data: {
    attractions: AttractionApiItem[];
  };
  message?: string;
}

const getApiUrl = (parkType: number, date?: string): string => {
  const params = new URLSearchParams({ park_type: String(parkType) });
  if (date) {
    params.set('date', date);
  }
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/attractions?${params.toString()}`;
};

/**
 * GET /showtimes/attractions
 * アトラクション一覧取得API（マスタ）
 */
export const useAttractionsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeAttractionsGet = async (parkType: number, date?: string) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'GET',
        getApiUrl(parkType, date)
      );
      const apiResponse = response as AttractionsApiResponse;

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
    executeAttractionsGet,
    loading,
    error,
  };
};
