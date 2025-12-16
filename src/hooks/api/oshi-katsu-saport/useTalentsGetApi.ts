import useFetchDataTs from 'utils/useFetchDataTs';

export interface TalentsApiResponse {
  status: boolean;
  data: {
    talents: Talent[];
  };
}

export interface Talent {
  id: string;
  talentName: string;
  talentNameEn: string;
  groupName: string;
  groupId: number;
  xAccounts: string[];
}

const getApiUrl = (): string => {
  return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/talents`;
};

/**
 * /oshi-katsu-saport/talents
 * タレント一覧取得API
 */
export const useTalentsGetApi = () => {
  const { loading, error, executeFetch } = useFetchDataTs();

  // APIリクエスト処理
  const executeTalentsGet = async () => {
    try {
      // モックデータ（APIが実装されるまでの暫定対応）
      const mockResponse: TalentsApiResponse = {
        status: true,
        data: {
          talents: [
            {
              id: '1',
              talentName: 'ときのそら',
              talentNameEn: 'Tokino Sora',
              groupName: '0期生',
              groupId: 2,
              xAccounts: ['tokino_sora']
            },
            {
              id: '2',
              talentName: 'ロボ子さん',
              talentNameEn: 'Roboco-san',
              groupName: '0期生',
              groupId: 2,
              xAccounts: ['robocosan', 'maybe_robochan']
            }
          ]
        }
      };

      // TODO: 実際のAPIが実装されたら以下のコメントアウトを解除してモックデータを削除
      // const { response, error } = await executeFetch('GET', getApiUrl());
      // const apiResponse = response as TalentsApiResponse;
      // if (!apiResponse?.status) {
      //   // APIからエラーレスポンスが返却された場合
      //   console.error('API returned error status');
      // }
      // if (error) {
      //   // API呼出が異常の場合
      //   console.error('API Error:', error);
      // }

      // 正常終了時の処理
      return {
        apiResponse: mockResponse,
        error: null
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
    executeTalentsGet,
    loading,
    error,
  };
};
