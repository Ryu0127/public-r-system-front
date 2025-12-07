import { useState } from 'react';
import { CollabVideo } from '../types';

export interface CollabVideosApiResponse {
  status: boolean;
  data: {
    videos: CollabVideo[];
  };
}

// モックデータ
const mockCollabVideosData: Record<string, CollabVideo[]> = {
  // ときのそら × ロボ子さん
  'tokino-sora-roboco': [
    {
      id: 'tokino-sora-roboco-1',
      videoCode: 'UrxbELTadIU',
      videoTitle: '【Minecraft】ときのそら×ロボ子さん コラボ配信',
      videoUrl: 'https://www.youtube.com/watch?v=UrxbELTadIU',
      videoImgPath: 'https://i.ytimg.com/vi/UrxbELTadIU/mqdefault.jpg',
      videoTime: '1:30:25',
      publishedAt: '2024-03-20T20:00:00Z',
      favoriteFlag: false,
    },
  ],
  // 星街すいせい(1) × さくらみこ(2)
  '1-2': [
    {
      id: 'v1',
      videoCode: 'dQw4w9WgXcQ',
      videoTitle: '【コラボ】星街すいせい＆さくらみこで歌ってみた！【カラオケ配信】',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoImgPath: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoTime: '1:23:45',
      publishedAt: '2024-03-15T18:00:00Z',
      favoriteFlag: false,
    },
    {
      id: 'v2',
      videoCode: 'J7WNbJWL3E8',
      videoTitle: '【Minecraft】マイクラでお城作り！すいちゃん×みこち【ホロライブ】',
      videoUrl: 'https://www.youtube.com/watch?v=J7WNbJWL3E8',
      videoImgPath: 'https://i.ytimg.com/vi/J7WNbJWL3E8/maxresdefault.jpg',
      videoTime: '2:15:30',
      publishedAt: '2024-02-20T20:00:00Z',
      favoriteFlag: false,
    },
    {
      id: 'v3',
      videoCode: 'kXYiU_JCYtU',
      videoTitle: '【雑談コラボ】最近の出来事について語る【星街すいせい/さくらみこ】',
      videoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
      videoImgPath: 'https://i.ytimg.com/vi/kXYiU_JCYtU/maxresdefault.jpg',
      videoTime: '0:58:12',
      publishedAt: '2024-01-10T19:00:00Z',
      favoriteFlag: false,
    },
  ],
  // 星街すいせい(1) × 天音かなた(3)
  '1-3': [
    {
      id: 'v4',
      videoCode: 'A1B2C3D4E5F',
      videoTitle: '【APEX】ランクマ挑戦！すいちゃん×かなたん【コラボ】',
      videoUrl: 'https://www.youtube.com/watch?v=A1B2C3D4E5F',
      videoImgPath: 'https://i.ytimg.com/vi/A1B2C3D4E5F/maxresdefault.jpg',
      videoTime: '3:05:22',
      publishedAt: '2024-02-28T21:00:00Z',
      favoriteFlag: false,
    },
    {
      id: 'v5',
      videoCode: 'F5E4D3C2B1A',
      videoTitle: '【歌枠】星街すいせい×天音かなた デュエット歌枠',
      videoUrl: 'https://www.youtube.com/watch?v=F5E4D3C2B1A',
      videoImgPath: 'https://i.ytimg.com/vi/F5E4D3C2B1A/maxresdefault.jpg',
      videoTime: '1:45:18',
      publishedAt: '2024-01-25T20:00:00Z',
      favoriteFlag: false,
    },
  ],
  // 星街すいせい(1) × 白銀ノエル(4)
  '1-4': [
    {
      id: 'v6',
      videoCode: 'G6H7I8J9K0L',
      videoTitle: '【ARK】恐竜テイムしながら雑談！すいせい×ノエル',
      videoUrl: 'https://www.youtube.com/watch?v=G6H7I8J9K0L',
      videoImgPath: 'https://i.ytimg.com/vi/G6H7I8J9K0L/maxresdefault.jpg',
      videoTime: '2:30:45',
      publishedAt: '2024-03-01T19:30:00Z',
      favoriteFlag: false,
    },
  ],
  // さくらみこ(2) × 星街すいせい(1)
  '2-1': [
    {
      id: 'v1',
      videoCode: 'dQw4w9WgXcQ',
      videoTitle: '【コラボ】星街すいせい＆さくらみこで歌ってみた！【カラオケ配信】',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoImgPath: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoTime: '1:23:45',
      publishedAt: '2024-03-15T18:00:00Z',
      favoriteFlag: false,
    },
    {
      id: 'v2',
      videoCode: 'J7WNbJWL3E8',
      videoTitle: '【Minecraft】マイクラでお城作り！すいちゃん×みこち【ホロライブ】',
      videoUrl: 'https://www.youtube.com/watch?v=J7WNbJWL3E8',
      videoImgPath: 'https://i.ytimg.com/vi/J7WNbJWL3E8/maxresdefault.jpg',
      videoTime: '2:15:30',
      publishedAt: '2024-02-20T20:00:00Z',
      favoriteFlag: false,
    },
    {
      id: 'v3',
      videoCode: 'kXYiU_JCYtU',
      videoTitle: '【雑談コラボ】最近の出来事について語る【星街すいせい/さくらみこ】',
      videoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
      videoImgPath: 'https://i.ytimg.com/vi/kXYiU_JCYtU/maxresdefault.jpg',
      videoTime: '0:58:12',
      publishedAt: '2024-01-10T19:00:00Z',
      favoriteFlag: false,
    },
  ],
};

/**
 * コラボ動画一覧取得API（モック版）
 * 実際のAPIが実装されたら、この関数を置き換えてください
 */
export const useCollabVideosGetApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // APIリクエスト処理（モック）
  const executeCollabVideosGet = async (talentId: string, collaboratorId: string) => {
    setLoading(true);
    setError(null);

    try {
      // 実際のAPI呼び出しをシミュレート（800ms待機）
      await new Promise((resolve) => setTimeout(resolve, 800));

      // モックデータのキーを生成（どちらの順序でも取得可能）
      const key = `${talentId}-${collaboratorId}`;

      // モックデータを取得
      const videos = mockCollabVideosData[key] || [];

      const apiResponse: CollabVideosApiResponse = {
        status: true,
        data: {
          videos,
        },
      };

      setLoading(false);

      return {
        apiResponse,
        error: null,
      };
    } catch (err) {
      console.error('API Error:', err);
      setError(err);
      setLoading(false);

      return {
        apiResponse: null,
        error: err,
      };
    }
  };

  return {
    executeCollabVideosGet,
    loading,
    error,
  };
};

/*
 * 実際のAPI実装例（参考）:
 *
 * import useFetchDataTs from 'utils/useFetchDataTs';
 *
 * const getApiUrl = (talentId: string, collaboratorId: string): string => {
 *   return `${process.env.REACT_APP_API_DOMAIN}/oshi-katsu-saport/collaborations?talent1=${talentId}&talent2=${collaboratorId}`;
 * };
 *
 * export const useCollabVideosGetApi = () => {
 *   const { loading, error, executeFetch } = useFetchDataTs();
 *
 *   const executeCollabVideosGet = async (talentId: string, collaboratorId: string) => {
 *     try {
 *       const { response, error } = await executeFetch('GET', getApiUrl(talentId, collaboratorId));
 *       const apiResponse = response as CollabVideosApiResponse;
 *
 *       if (!apiResponse?.status) {
 *         console.error('API returned error status');
 *       }
 *       if (error) {
 *         console.error('API Error:', error);
 *       }
 *
 *       return {
 *         apiResponse,
 *         error
 *       };
 *     } catch (error) {
 *       console.error('API Error:', error);
 *       return {
 *         apiResponse: null,
 *         error
 *       };
 *     }
 *   };
 *
 *   return {
 *     executeCollabVideosGet,
 *     loading,
 *     error,
 *   };
 * };
 */
