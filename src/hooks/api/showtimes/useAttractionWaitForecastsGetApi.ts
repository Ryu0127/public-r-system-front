import useFetchDataTs from 'utils/useFetchDataTs';

export interface AttractionWaitForecastApiItem {
  id: number;
  disneyParkAttractionId: number;
  targetDate: string;
  slotTime: string | null;
  waitMinutes: number | null;
}

export interface AttractionWaitForecastsApiResponse {
  status: boolean;
  data: {
    slots: string[];
    waitsByAttractionId: Record<string, Array<number | null>>;
    forecasts: AttractionWaitForecastApiItem[];
  };
  message?: string;
}

const getApiUrl = (parkType: number, date: string): string => {
  const params = new URLSearchParams({
    park_type: String(parkType),
    date,
  });
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/attraction-wait-forecasts?${params.toString()}`;
};

/**
 * GET /showtimes/attraction-wait-forecasts
 * アトラクション時間帯別予想待ち時間取得API
 */
export const useAttractionWaitForecastsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeAttractionWaitForecastsGet = async (
    parkType: number,
    date: string
  ) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'GET',
        getApiUrl(parkType, date)
      );
      const apiResponse = response as AttractionWaitForecastsApiResponse;

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
    executeAttractionWaitForecastsGet,
    loading,
    error,
  };
};
