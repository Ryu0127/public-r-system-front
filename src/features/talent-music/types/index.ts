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
  /** タレントアイコン画像 URL */
  iconImgUrl?: string;
}

/**
 * API の data.groups[] を画面用に変換したグループ
 * talents には groupId / groupName を注入済みの MusicTalent が入る
 */
export interface MusicTalentGroup {
  groupId: number;
  groupName: string;
  groupNameEn: string;
  talents: MusicTalent[];
}

export interface TalentMusicPagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number | null;
  to: number | null;
}

/** GET …/oshi-katsu-saport/talent-music のレスポンス */
export interface TalentMusicApiResponse {
  status: boolean;
  data: {
    musicList: Music[];
    pagination: TalentMusicPagination;
  };
}

export interface TalentMusicFetchParams {
  talentSlug?: string;
  groupSlug?: string;
  page?: number;
  perPage?: number;
}
