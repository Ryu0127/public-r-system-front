import useFetchDataTs from 'utils/useFetchDataTs';

export interface FoodMenuContentApiItem {
  id: number;
  contentName: string;
  pauseFlag: number;
}

export interface FoodMenuApiItem {
  id: number;
  disneyParkFoodShopId: number;
  menuName: string;
  categoryType: number;
  categoryTypeLabel: string | null;
  priceYen: number | null;
  note: string | null;
  timeLimitNote: string | null;
  thumbUrl: string | null;
  officialUrl: string | null;
  publishStartDate: string | null;
  publishEndDate: string | null;
  pauseFlag: number;
  shopName: string | null;
  areaType: number | null;
  areaTypeLabel: string | null;
  contents: FoodMenuContentApiItem[];
}

export interface FoodMenusApiResponse {
  status: boolean;
  data: {
    foodMenus: FoodMenuApiItem[];
  };
  message?: string;
}

const getApiUrl = (parkType: number, date?: string): string => {
  const params = new URLSearchParams({ park_type: String(parkType) });
  if (date) {
    params.set('date', date);
  }
  return `${process.env.REACT_APP_API_DOMAIN}/showtimes/food-menus?${params.toString()}`;
};

/**
 * GET /showtimes/food-menus
 * フードメニュー一覧取得API（マスタ＋内容）
 */
export const useFoodMenusGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeFoodMenusGet = async (parkType: number, date?: string) => {
    try {
      const { response, error: fetchError } = await executeFetch(
        'GET',
        getApiUrl(parkType, date)
      );
      const apiResponse = response as FoodMenusApiResponse;

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
    executeFoodMenusGet,
    loading,
    error,
  };
};
