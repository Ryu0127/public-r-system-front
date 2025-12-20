/**
 * エゴサーチサポート画面の型定義
 */

/**
 * 日付範囲プリセット
 */
export type DateRangePreset =
  | 'all'          // すべて
  | 'today'        // 今日
  | 'yesterday'    // 昨日
  | 'last7days'    // 過去7日
  | 'last30days'   // 過去30日
  | 'custom';      // カスタム

/**
 * タレントアカウント情報（複数アカウント対応）
 */
export interface TalentAccount {
  talentId: string;
  talentName: string;
  accounts: string[];    // アカウントリスト (@なし)
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
 * 検索キーワードプリセット
 */
export interface KeywordPreset {
  id: string;
  label: string;
  keyword: string;
  category?: string; // カテゴリ（活動、ファンアートなど）
}

/**
 * エゴサーチフィルタの状態
 */
export interface EgoSearchFilters {
  // 検索ワード（複数キーワード対応）
  searchKeywords: string[];

  // 日付フィルタ
  dateRange: {
    preset: DateRangePreset;
    customStartDate?: string; // YYYY-MM-DD形式
    customEndDate?: string;   // YYYY-MM-DD形式
  };

  // タレントアカウントフィルタ（エゴサーチでは"from"のみ使用）
  talentAccounts: {
    enabled: boolean;
    selectedAccounts: TalentAccount[];
  };

  // 除外ワード
  excludeWords: {
    enabled: boolean;
    selectedWords: ExcludeWord[];
  };

  // リプライを除外
  excludeReplies: boolean;

  // リツイートを除外
  excludeRetweets: boolean;
}

/**
 * デフォルトのエゴサーチフィルタ
 */
export const defaultEgoSearchFilters: EgoSearchFilters = {
  searchKeywords: [''],
  dateRange: {
    preset: 'all',
  },
  talentAccounts: {
    enabled: false,
    selectedAccounts: [],
  },
  excludeWords: {
    enabled: false,
    selectedWords: [],
  },
  excludeReplies: true,
  excludeRetweets: true,
};

/**
 * デフォルトの除外ワード（荒らし・誹謗中傷対策）
 */
export const defaultExcludeWords: ExcludeWord[] = [
  { id: '1', word: 'スパム', category: '荒らし' },
  { id: '2', word: '誹謗中傷', category: '誹謗中傷' },
  { id: '3', word: '悪質', category: '荒らし' },
  { id: '4', word: '炎上', category: '荒らし' },
];

/**
 * 検索キーワードプリセット（固定）
 */
export const keywordPresets: KeywordPreset[] = [
  // 活動関連
  { id: 'streaming', label: '配信', keyword: '配信', category: '活動' },
  { id: 'singing', label: '歌ってみた', keyword: '歌ってみた', category: '活動' },
  { id: 'cover', label: 'カバー', keyword: 'カバー', category: '活動' },
  { id: 'collab', label: 'コラボ', keyword: 'コラボ', category: '活動' },
  { id: 'clip', label: '切り抜き', keyword: '切り抜き', category: '活動' },

  // ファンアート関連
  { id: 'fanart', label: 'ファンアート', keyword: 'ファンアート', category: 'ファンアート' },
  { id: 'illustration', label: 'イラスト', keyword: 'イラスト', category: 'ファンアート' },
  { id: '3d', label: '3D', keyword: '3D', category: 'ファンアート' },
  { id: 'mmd', label: 'MMD', keyword: 'MMD', category: 'ファンアート' },

  // グッズ・コンテンツ関連
  { id: 'goods', label: 'グッズ', keyword: 'グッズ', category: 'グッズ' },
  { id: 'merch', label: 'マーチャンダイズ', keyword: 'マーチャンダイズ', category: 'グッズ' },
  { id: 'voice', label: 'ボイス', keyword: 'ボイス', category: 'コンテンツ' },

  // イベント関連
  { id: 'birthday', label: '誕生日', keyword: '誕生日', category: 'イベント' },
  { id: 'anniversary', label: '記念日', keyword: '記念日', category: 'イベント' },
  { id: 'debut', label: 'デビュー', keyword: 'デビュー', category: 'イベント' },
];
