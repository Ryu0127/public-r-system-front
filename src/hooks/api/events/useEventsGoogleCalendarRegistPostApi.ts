import { useState } from 'react';
import useFetchDataTs from 'utils/useFetchDataTs';

export interface EventsGoogleCalendarRegistPostApiRequest {
  summary: string;
  startEventDateTime: string;
  endEventDateTime: string;
  location: string;
  description: string;
}

export interface EventsGoogleCalendarRegistPostApiResponse {
  status: boolean;
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/events/google-calendar/regist`;
};

/**
 * /events/google-calendar/regist
 * イベントの登録API
 */
export const useEventsGoogleCalendarRegistPostApi = () => {
  const [apiCallCompResult, setApiCallCompResult] = useState(false);
  const { loading, error, executeFetch } = useFetchDataTs();

  const executeEventsGoogleCalendarRegist = async (requestParam: EventsGoogleCalendarRegistPostApiRequest) => {
    try {
      // API実行
      const { response, error } = await executeFetch('POST', getApiUrl(), requestParam);
      if (response) {
        // API呼出が正常の場合
        const apiObject = response as EventsGoogleCalendarRegistPostApiResponse;
        if (apiObject.status) {
          // APIから正常終了レスポンスが存在する場合
          setApiCallCompResult(true);
        } else {
          // APIから正常終了レスポンスが存在しない場合
          setApiCallCompResult(false);
        }
      }
      if (error) {
        // API呼出が異常の場合
        console.error('API Error:', error);
        setApiCallCompResult(false);
      }
      
      return {
        apiCallCompResult,
        error
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      setApiCallCompResult(false);
      return {
        apiCallCompResult: false,
        error
      };
    }
  };

  return {
    apiCallCompResult,
    executeEventsGoogleCalendarRegist,
    loading,
    error
  };
};