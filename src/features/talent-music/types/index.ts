export type MusicType = 'original' | 'cover';
export type MusicFilterType = 'all' | 'original' | 'cover';

export interface Music {
  id: string;
  title: string;
  talentId: string;
  talentName: string;
  talentNameEn: string;
  youtubeVideoId: string;
  type: MusicType;
  releaseDate: string;
  description?: string;
}

export interface MusicTalent {
  id: string;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
  groupName: string;
  groupId: number;
}
