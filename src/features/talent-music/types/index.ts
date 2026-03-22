export type MusicType = 'original' | 'cover';
export type MusicFilterType = 'all' | 'original' | 'cover';

export interface Music {
  id: number;
  title: string;
  /** 楽曲に紐づくタレントID（コラボ等で複数） */
  talentIds: number[];
  youtubeVideoId: string;
  type: MusicType;
  releaseDate: string;
  description?: string;
}

export interface MusicTalent {
  id: number;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
  groupName: string;
  groupId: number;
}

/** GET …/oshi-katsu-saport/talent-music?talent_ids=… のレスポンス（複数タレントの楽曲をまとめて返しうる。タレント一覧は別API） */
export interface TalentMusicApiResponse {
  status: boolean;
  data: {
    musicList: Music[];
  };
}
