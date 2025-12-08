/**
 * 高度な検索フィルタの型定義
 */

/**
 * 日付範囲プリセット
 */
export type DateRangePreset =
  | 'today'        // 今日
  | 'yesterday'    // 昨日
  | 'last7days'    // 過去7日
  | 'last30days'   // 過去30日
  | 'custom';      // カスタム

/**
 * メディアタイプフィルタ
 */
export type MediaFilter =
  | 'all'          // すべて
  | 'images'       // 画像のみ
  | 'videos'       // 動画のみ
  | 'media';       // 画像・動画両方

/**
 * プリセット検索タイプ
 */
export interface SearchPreset {
  id: string;
  name: string;
  description: string;
  dateRange?: DateRangePreset;
  mediaFilter?: MediaFilter;
  includeIllustTag?: boolean;
}

/**
 * タレントアカウント情報
 */
export interface TalentAccount {
  talentId: string;
  talentName: string;
  twitterHandle: string; // @なしのアカウント名
}

/**
 * 除外ワード
 */
export interface ExcludeWord {
  id: string;
  word: string;
  category?: string; // 荒らし、誹謗中傷など
}

/**
 * 高度な検索フィルタの状態
 */
export interface AdvancedSearchFilters {
  // 日付フィルタ
  dateRange: {
    preset: DateRangePreset;
    customStartDate?: string; // YYYY-MM-DD形式
    customEndDate?: string;   // YYYY-MM-DD形式
  };

  // メディアフィルタ
  mediaFilter: MediaFilter;

  // タレントアカウントフィルタ
  talentAccounts: {
    enabled: boolean;
    selectedAccounts: TalentAccount[];
    searchType: 'from' | 'to' | 'mentions'; // from: 投稿, to: リプライ, mentions: やりとり
  };

  // 除外ワード
  excludeWords: {
    enabled: boolean;
    selectedWords: ExcludeWord[];
  };

  // イラストタグの自動追加
  includeIllustTag: boolean;
}

/**
 * デフォルトの検索フィルタ
 */
export const defaultAdvancedSearchFilters: AdvancedSearchFilters = {
  dateRange: {
    preset: 'last7days',
  },
  mediaFilter: 'all',
  talentAccounts: {
    enabled: false,
    selectedAccounts: [],
    searchType: 'from',
  },
  excludeWords: {
    enabled: false,
    selectedWords: [],
  },
  includeIllustTag: false,
};

/**
 * プリセット検索の定義
 */
export const searchPresets: SearchPreset[] = [
  {
    id: 'yesterday-posts',
    name: '昨日投稿されたポスト',
    description: '昨日投稿されたハッシュタグ付きポストを検索',
    dateRange: 'yesterday',
    mediaFilter: 'all',
  },
  {
    id: 'today-illustrations',
    name: '今日のイラスト投稿',
    description: '今日投稿されたイラスト付きポストを検索',
    dateRange: 'today',
    mediaFilter: 'images',
    includeIllustTag: true,
  },
  {
    id: 'week-videos',
    name: '今週の動画投稿',
    description: '過去7日間の動画付きポストを検索',
    dateRange: 'last7days',
    mediaFilter: 'videos',
  },
  {
    id: 'recent-media',
    name: '最近のメディア投稿',
    description: '過去7日間の画像・動画付きポストを検索',
    dateRange: 'last7days',
    mediaFilter: 'media',
  },
];

/**
 * デフォルトの除外ワード（荒らし・誹謗中傷対策）
 */
export const defaultExcludeWords: ExcludeWord[] = [
  { id: '1', word: 'スパム', category: '荒らし' },
  { id: '2', word: '誹謗中傷', category: '誹謗中傷' },
  { id: '3', word: '悪質', category: '荒らし' },
  { id: '4', word: '炎上', category: '荒らし' },
];
