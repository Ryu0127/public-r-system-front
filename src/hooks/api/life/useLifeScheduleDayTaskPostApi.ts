import useFetchDataTs from 'utils/useFetchDataTs';

export interface LifeScheduleDayTaskApiResponse {
  status: boolean;
}

export interface LifeScheduleDayTaskApiRequest {
  tasks: LifeScheduleDayTaskApiRequestTask[];
  scheduleDate: string;
}

export interface LifeScheduleDayTaskApiRequestTask {
  taskId: string;
  taskName: string;
  startDateTime: string;
  endDateTime: string;
  projectId: string;
  remarks: string | null;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/life/schedule-day/tasks`;
};

/**
 * /life/schedule-day/tasks
 * 日次スケジュールタスク更新API
 */
export const useLifeScheduleDayTaskPostApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeLifeScheduleDayTaskPost = async (requestParam: LifeScheduleDayTaskApiRequest) => {
    try {
      // API実行
      const { response, error } = await executeFetch('POST', getApiUrl(), requestParam);
      const apiResponse = response as LifeScheduleDayTaskApiResponse;
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
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        apiResponse: null,
        error
      };
    }
  };

  return {
    executeLifeScheduleDayTaskPost,
    loading,
    error
  };
};