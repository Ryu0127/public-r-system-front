import { Music, MusicTalent } from 'features/talent-music/types';

export interface TalentMusicApiResponse {
  status: boolean;
  data: {
    talents: MusicTalent[];
    musicList: Music[];
  };
}

// モックデータ: タレント一覧
const mockTalents: MusicTalent[] = [
  {
    id: '1',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    talentNameJoin: 'ときのそら（Tokino Sora）',
    groupName: '0期生',
    groupId: 2,
  },
  {
    id: '2',
    talentName: 'ロボ子さん',
    talentNameEn: 'Roboco-san',
    talentNameJoin: 'ロボ子さん（Roboco-san）',
    groupName: '0期生',
    groupId: 2,
  },
  {
    id: '3',
    talentName: 'さくらみこ',
    talentNameEn: 'Sakura Miko',
    talentNameJoin: 'さくらみこ（Sakura Miko）',
    groupName: '0期生',
    groupId: 2,
  },
  {
    id: '4',
    talentName: '白上フブキ',
    talentNameEn: 'Shirakami Fubuki',
    talentNameJoin: '白上フブキ（Shirakami Fubuki）',
    groupName: 'ゲーマーズ',
    groupId: 7,
  },
  {
    id: '5',
    talentName: '湊あくあ',
    talentNameEn: 'Minato Aqua',
    talentNameJoin: '湊あくあ（Minato Aqua）',
    groupName: '2期生',
    groupId: 4,
  },
  {
    id: '6',
    talentName: '宝鐘マリン',
    talentNameEn: 'Houshou Marine',
    talentNameJoin: '宝鐘マリン（Houshou Marine）',
    groupName: '3期生',
    groupId: 5,
  },
];

// モックデータ: 楽曲一覧
// ※ YouTubeのビデオIDはサンプルです。実際のAPIが実装されたら差し替えてください。
const mockMusicList: Music[] = [
  // ときのそら
  {
    id: '101',
    title: 'Watashi wa Idol!!!',
    talentId: '1',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    youtubeVideoId: 'oO2tcADzMz0',
    type: 'original',
    releaseDate: '2020-03-01',
    description: 'ときのそら 1stシングル',
  },
  {
    id: '102',
    title: 'Say! Fanfare!',
    talentId: '1',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    youtubeVideoId: 'QFnRAbp-tKI',
    type: 'original',
    releaseDate: '2021-03-15',
    description: 'ときのそら オリジナル曲',
  },
  {
    id: '103',
    title: 'いのちの食べ方 (Cover)',
    talentId: '1',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    youtubeVideoId: 'n5RxmhDMhMo',
    type: 'cover',
    releaseDate: '2022-09-10',
    description: 'カバー曲',
  },
  {
    id: '104',
    title: 'Dreaming!',
    talentId: '1',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    youtubeVideoId: 'lXMskKTw3Bc',
    type: 'original',
    releaseDate: '2021-10-01',
    description: 'ときのそら 1stフルアルバム収録曲',
  },
  // ロボ子さん
  {
    id: '201',
    title: 'ロボ子さんのうた',
    talentId: '2',
    talentName: 'ロボ子さん',
    talentNameEn: 'Roboco-san',
    youtubeVideoId: 'xSXpNpqOJ-s',
    type: 'original',
    releaseDate: '2021-05-01',
    description: 'ロボ子さん オリジナル曲',
  },
  {
    id: '202',
    title: 'LOVE DRAMATIC (Cover)',
    talentId: '2',
    talentName: 'ロボ子さん',
    talentNameEn: 'Roboco-san',
    youtubeVideoId: 'Zu_5UtXAJo0',
    type: 'cover',
    releaseDate: '2022-02-14',
    description: 'カバー曲',
  },
  // さくらみこ
  {
    id: '301',
    title: 'だいすき！ (オリジナル曲)',
    talentId: '3',
    talentName: 'さくらみこ',
    talentNameEn: 'Sakura Miko',
    youtubeVideoId: 'p3iFDFDMb8Y',
    type: 'original',
    releaseDate: '2022-01-25',
    description: 'さくらみこ オリジナル曲',
  },
  {
    id: '302',
    title: '恋愛サーキュレーション (Cover)',
    talentId: '3',
    talentName: 'さくらみこ',
    talentNameEn: 'Sakura Miko',
    youtubeVideoId: 'wiy8pSf1tdk',
    type: 'cover',
    releaseDate: '2021-08-12',
    description: 'カバー曲',
  },
  {
    id: '303',
    title: 'さくらみこオリジナル曲2',
    talentId: '3',
    talentName: 'さくらみこ',
    talentNameEn: 'Sakura Miko',
    youtubeVideoId: 'gSVvxOchT3w',
    type: 'original',
    releaseDate: '2023-04-01',
    description: 'さくらみこ 2ndオリジナル曲',
  },
  // 白上フブキ
  {
    id: '401',
    title: 'Say！ダーリン！！',
    talentId: '4',
    talentName: '白上フブキ',
    talentNameEn: 'Shirakami Fubuki',
    youtubeVideoId: 'Fwc6S1KaTS8',
    type: 'original',
    releaseDate: '2021-09-17',
    description: '白上フブキ オリジナル曲',
  },
  {
    id: '402',
    title: '心做し (Cover)',
    talentId: '4',
    talentName: '白上フブキ',
    talentNameEn: 'Shirakami Fubuki',
    youtubeVideoId: 'NPKH3iiNNKk',
    type: 'cover',
    releaseDate: '2020-12-25',
    description: 'カバー曲',
  },
  {
    id: '403',
    title: 'Say！ダーリン！！ (ショートver)',
    talentId: '4',
    talentName: '白上フブキ',
    talentNameEn: 'Shirakami Fubuki',
    youtubeVideoId: 'XpTHOoJsS9Q',
    type: 'original',
    releaseDate: '2022-06-10',
    description: '白上フブキ オリジナル曲',
  },
  // 湊あくあ
  {
    id: '501',
    title: 'Dreamy Night',
    talentId: '5',
    talentName: '湊あくあ',
    talentNameEn: 'Minato Aqua',
    youtubeVideoId: 'ZPTvkKLME60',
    type: 'original',
    releaseDate: '2022-08-01',
    description: '湊あくあ オリジナル曲',
  },
  {
    id: '502',
    title: 'なんでもないや (Cover)',
    talentId: '5',
    talentName: '湊あくあ',
    talentNameEn: 'Minato Aqua',
    youtubeVideoId: 'g_RK2NQFKYE',
    type: 'cover',
    releaseDate: '2021-11-20',
    description: 'カバー曲',
  },
  // 宝鐘マリン
  {
    id: '601',
    title: 'AHOY!! 我ら宝鐘海賊団☆',
    talentId: '6',
    talentName: '宝鐘マリン',
    talentNameEn: 'Houshou Marine',
    youtubeVideoId: 'Sj3Gi7cIPyA',
    type: 'original',
    releaseDate: '2020-12-26',
    description: '宝鐘マリン オリジナル曲',
  },
  {
    id: '602',
    title: 'KING (Cover)',
    talentId: '6',
    talentName: '宝鐘マリン',
    talentNameEn: 'Houshou Marine',
    youtubeVideoId: 'xf3AntRuPNw',
    type: 'cover',
    releaseDate: '2021-04-05',
    description: 'カバー曲',
  },
  {
    id: '603',
    title: '恋のLesson初級編！ (Cover)',
    talentId: '6',
    talentName: '宝鐘マリン',
    talentNameEn: 'Houshou Marine',
    youtubeVideoId: '3-3AJuRBo5Q',
    type: 'cover',
    releaseDate: '2022-02-10',
    description: 'カバー曲',
  },
];

/**
 * タレント別楽曲一覧取得API
 * TODO: 実際のAPIが実装されたら差し替える
 */
export const useTalentMusicGetApi = () => {
  const executeTalentMusicGet = async (): Promise<{
    apiResponse: TalentMusicApiResponse | null;
    error: unknown;
  }> => {
    try {
      const mockResponse: TalentMusicApiResponse = {
        status: true,
        data: {
          talents: mockTalents,
          musicList: mockMusicList,
        },
      };

      return { apiResponse: mockResponse, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { apiResponse: null, error };
    }
  };

  return { executeTalentMusicGet };
};
