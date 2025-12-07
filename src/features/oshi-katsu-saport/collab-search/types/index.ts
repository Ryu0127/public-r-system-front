// タレント型
export interface Talent {
  id: string;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
}

// コラボレーター型
export interface Collaborator {
  id: string;
  talentName: string;
  talentNameEn: string;
  collaborationCount: number; // コラボ回数
}

// コラボ動画型
export interface CollabVideo {
  id: string;
  videoCode: string; // YouTube動画ID
  videoTitle: string;
  videoUrl: string;
  videoImgPath: string; // サムネイルURL
  videoTime: string; // 動画時間 (例: "1:23:45")
  publishedAt: string; // 配信日時 (ISO 8601形式)
  favoriteFlag?: boolean;
}

// コラボ検索の状態型
export interface CollabSearchState {
  config: {
    isLoading: boolean;
    isBaseTalentDropdownOpen: boolean;
    isCollaboratorDropdownOpen: boolean;
  };
  data: {
    talents: Talent[];
    selectedBaseTalent: Talent | null;
    collaborators: Collaborator[];
    selectedCollaborator: Collaborator | null;
    videos: CollabVideo[];
  };
  ui: {
    baseTalentSearchQuery: string;
    collaboratorSearchQuery: string;
  };
}
