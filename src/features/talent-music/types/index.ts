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
  /** 一覧APIの id（数値でも文字列でも返りうるため文字列で保持） */
  id: string;
  talentName: string;
  talentNameEn: string;
  /** URL 用の slug（例: tokino-sora） */
  talentSlug?: string;
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
