import useFetchDataTs from 'utils/useFetchDataTs';

export interface LifeScheduleMonthTaskApiResponse {
  status: boolean;
  data: {
    tasks: LifeScheduleMonthTaskApiTask[];
  };
}

export interface LifeScheduleMonthTaskApiTask {
  taskId: string;
  taskName: string;
  startDateTime: string;
  endDateTime: string;
  scheduleDate: string;
  projectId: string;
  remarks: string;
}

const getApiUrl = (yearMonth: string): string => {
  console.log(process.env.REACT_APP_API_DOMAIN);
  return `${process.env.REACT_APP_API_DOMAIN}/life/schedule-month/tasks/${yearMonth}`;
};

/**
 * /life/schedule-month/tasks
 * 月次スケジュールタスク取得API
 */
export const useLifeScheduleMonthTaskGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeLifeScheduleMonthTaskGet = async (yearMonth: Date) => {
    try {
      // API実行 (YYYY-MM形式に変換)
      const yearMonthString = `${yearMonth.getFullYear()}-${String(yearMonth.getMonth() + 1).padStart(2, '0')}`;
      console.log(getApiUrl(yearMonthString));
      const { response, error } = await executeFetch('GET', getApiUrl(yearMonthString));
      const apiResponse = response as LifeScheduleMonthTaskApiResponse;
      if (!apiResponse.status) {
        // APIからエラーレスポンスが返却された場合
        console.error('API returned error status');
      }
      if (error) {
        // API呼出が異常の場合
        console.error('API Error:', error);
      }

      // 正常終了時の処理
      return {
        apiResponse,
        error
      }
    } catch (error) {
      // API呼出が異常の場合
      console.error('API Error:', error);
      return {
        apiResponse: null,
        error
      }
    }
  };

  return {
    executeLifeScheduleMonthTaskGet,
    loading,
    error,
  };
};
