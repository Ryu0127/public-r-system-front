import useFetchDataTs from 'utils/useFetchDataTs';

export interface LifeScheduleDayTaskApiResponse {
  status: boolean;
  data: {
    // workTypeOptions: LifeScheduleDayTaskApiWorkTypeOption[];
    // projects: LifeScheduleDayTaskApiProject[];
    // masterTask: LifeScheduleDayTaskApiMasterTask;
    tasks: LifeScheduleDayTaskApiTask[];
  };
}

// export interface LifeScheduleDayTaskApiWorkTypeOption {
//   label: string;
//   value: string;
// }

// export interface LifeScheduleDayTaskApiProject {
//   projectId: string;
//   projectName: string;
// }

// export interface LifeScheduleDayTaskApiMasterTask {
//   taskId: string;
//   workType: string;
// }

export interface LifeScheduleDayTaskApiTask {
  taskId: string;
  taskName: string;
  startDateTime: Date;
  endDateTime: Date;
  projectId: string;
  remarks: string;
  notificationRequestFlag: boolean;
}

const getApiUrl = (date: string): string => {
  console.log(process.env.REACT_APP_API_DOMAIN);
  return `${process.env.REACT_APP_API_DOMAIN}/life/schedule-day/tasks/${date}`;
};

/**
 * /life/schedule-day/tasks
 * 日次スケジュールタスク取得API
 */
export const useLifeScheduleDayTaskGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeLifeScheduleDayTaskGet = async (date: Date) => {
    try {
      // API実行
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      console.log(getApiUrl(dateString));
      const { response, error } = await executeFetch('GET', getApiUrl(dateString));
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
    executeLifeScheduleDayTaskGet,
    loading,
    error,
  };
};