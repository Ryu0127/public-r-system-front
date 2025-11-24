import useFetchDataTs from 'utils/useFetchDataTs';

export interface TalentHashtagsApiResponse {
  status: boolean;
  data: {
    talent: {
      id: string;
      key: string;
      name: string;
    };
    hashtags: TalentHashtagsApiHashtag[];
    eventHashtags: TalentHashtagsApiEventHashtag[];
  };
}

export interface TalentHashtagsApiHashtag {
  id: number;
  tag: string;
  description: string;
}

export interface TalentHashtagsApiEventHashtag {
  id: number;
  tag: string;
  type: string;
  eventName: string;
  url: string;
}

const getApiUrl = (id: string): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/talents/${id}/hashtags`;
};

/**
 * /oshi-katsu-saport/talents/{id}/hashtags
 * タレント別ハッシュタグ取得API
 */
export const useTalentHashtagsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeTalentHashtagsGet = async (id: string) => {
    try {
      // API実行
      const { response, error } = await executeFetch('GET', getApiUrl(id));
      const apiResponse = response as TalentHashtagsApiResponse;
      if (!apiResponse?.status) {
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
    executeTalentHashtagsGet,
    loading,
    error,
  };
};
