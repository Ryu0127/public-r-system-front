import useFetchDataTs from 'utils/useFetchDataTs';

export interface ShowParadeScheduleApiItem {
  id: number;
  startTime: string;
  note: string | null;
  cancelFlag: number;
}

export interface ShowParadeApiItem {
  id: number;
  parkType: number;
  showParadeType: number;
  showParadeTypeLabel: string | null;
  showParadeName: string;
  durationMinutes: number | null;
  thumbUrl: string | null;
  publishStartDate: string | null;
  publishEndDate: string | null;
  entryFlag: number;
  dpaFlag: number;
  pauseFlag: number;
  schedules: ShowParadeScheduleApiItem[];
}

export interface ShowParadesApiResponse {
  status: boolean;
  data: {
    showParades: ShowParadeApiItem[];
  };
  message?: string;
}

const getApiUrl = (parkType: number, date?: string): string => {
  const params = new URLSearchParams({ park_type: String(parkType) });
  if (date) {
    params.set('date', date);
  }
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/show-parades?${params.toString()}`;
};

/**
 * GET /showtimes/show-parades
 * ショー・パレード一覧取得API（マスタ＋公演時刻）
 */
export const useShowParadesGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeShowParadesGet = async (parkType: number, date?: string) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'GET',
        getApiUrl(parkType, date)
      );
      const apiResponse = response as ShowParadesApiResponse;

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
    executeShowParadesGet,
    loading,
    error,
  };
};
