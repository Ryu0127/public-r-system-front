/**
 * タレント管理画面の型定義
 */

/**
 * 検索ワードグループ
 */
export interface SearchWorkGroup {
  gropuName: string; // Note: API has typo "gropu" instead of "group"
  keywords: string[];
}

/**
 * ハッシュタグ
 */
export interface TalentHashtag {
  id?: number;
  hashtag: string;
  description: string;
}

/**
 * タレントの基本型（既存のTalent型を拡張）
 */
export interface AdminTalent {
  id: string;
  talentName: string;           // 日本語名
  talentNameEn: string;         // 英語名
  groupName: string;            // グループ名（0期生、1期生など）
  groupId: number;              // グループID
  twitterAccounts: string[];    // Twitterアカウント（@なし）
  hashtags?: TalentHashtag[];   // ハッシュタグ
  searchWorks?: SearchWorkGroup[]; // タレント別検索ワード
  status?: 'active' | 'inactive' | 'graduated';  // ステータス
  debutDate?: string;           // デビュー日（YYYY-MM-DD）
  birthday?: string;            // 誕生日（MM-DD形式）
  affiliation?: string;         // 所属（ホロライブ、ホロスターズなど）
  profile?: string;             // プロフィール
  profileImageUrl?: string;     // プロフィール画像URL
  officialUrl?: string;         // 公式サイトURL
  youtubeChannelId?: string;    // YouTubeチャンネルID
  createdAt?: string;           // 作成日時（ISO8601形式）
  updatedAt?: string;           // 更新日時（ISO8601形式）
}

/**
 * API共通レスポンス型
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * タレント一覧取得レスポンス
 */
export type TalentListResponse = ApiResponse<AdminTalent[]>;

/**
 * タレント詳細取得レスポンス
 */
export type TalentDetailResponse = ApiResponse<AdminTalent>;

/**
 * タレント作成・更新レスポンス
 */
export type TalentMutationResponse = ApiResponse<AdminTalent>;

/**
 * タレント削除レスポンス
 */
export type TalentDeleteResponse = ApiResponse<{ id: string }>;

/**
 * タレントフォームの入力データ型
 */
export interface TalentFormData {
  talentName: string;
  talentNameEn: string;
  groupName: string;
  groupId: number;
  twitterAccounts: string[];
  hashtags?: TalentHashtag[];
  searchWorks?: SearchWorkGroup[];
  status?: 'active' | 'inactive' | 'graduated';
  debutDate?: string;
  birthday?: string;
  affiliation?: string;
  profile?: string;
  profileImageUrl?: string;
  officialUrl?: string;
  youtubeChannelId?: string;
}

/**
 * タレントステータスのラベルマップ
 */
export const TALENT_STATUS_LABELS: Record<string, string> = {
  active: '活動中',
  inactive: '休止中',
  graduated: '卒業',
};

/**
 * グループIDとグループ名のマッピング
 */
export const GROUP_OPTIONS = [
  { id: 1, name: 'ホロライブ' },
  { id: 2, name: '0期生' },
  { id: 3, name: '1期生' },
  { id: 4, name: '2期生' },
  { id: 5, name: '3期生' },
  { id: 6, name: '4期生' },
  { id: 7, name: '5期生' },
  { id: 8, name: '6期生' },
  { id: 9, name: 'ゲーマーズ' },
  { id: 10, name: 'イノナカミュージック' },
  { id: 11, name: 'ホロスターズ' },
  { id: 12, name: 'ホロライブEN' },
  { id: 13, name: 'ホロライブID' },
];
