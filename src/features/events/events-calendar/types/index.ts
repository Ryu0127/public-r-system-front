/**
 * イベントの種類
 */
export type EventType =
  | 'anniversary' // 記念配信
  | 'live'        // ライブ
  | 'concert'     // コンサート
  | 'meet'        // リアルイベント・ミート
  | 'collab'      // コラボ配信
  | 'birthday'    // 誕生日配信
  | 'goods'       // グッズ
  | 'voice'       // ボイス
  | 'application' // イベント申込
  | 'other';      // その他

/**
 * フィルターカテゴリ
 */
export type FilterCategory =
  | 'streaming'   // 配信イベント（記念配信、誕生日、コラボ）
  | 'event'       // イベント（ライブ、コンサート、ミート、イベント申込）
  | 'goods';      // グッズ/ボイス

/**
 * 表示モード
 */
export type ViewMode = 'calendar' | 'list';

/**
 * イベントの公開状態
 */
export type EventStatus =
  | 'draft'     // 下書き
  | 'published' // 公開
  | 'archived'; // アーカイブ（非公開）

/**
 * イベント申込詳細情報
 */
export interface ApplicationDetails {
  eventDate?: string; // イベント開催日時（表示用）
  eventSiteUrl?: string; // イベントサイトURL
  firstLottery?: string; // 1次抽選日時
  secondLottery?: string; // 2次抽選日時
  applicationStart?: string; // 申込開始日時
  applicationEnd?: string; // 申込終了日時
  notes?: string[]; // 注意事項（複数行対応）
}

/**
 * ホロライブイベント
 */
export interface HololiveEvent {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd形式（開始日）
  endDate?: string; // yyyy-mm-dd形式（終了日、期間のあるイベントの場合）
  startTime?: string; // HH:mm形式
  endTime?: string; // HH:mm形式
  type: EventType;
  talentNames: string[]; // タレント名の配列（複数タレント対応）
  description?: string;
  color: string; // イメージカラー（16進数）- イベント種類で自動設定
  url?: string; // 配信URLやイベント詳細URL
  thumbnailUrl?: string; // サムネイル画像URL
  location?: string; // 開催場所
  notes?: string[]; // 注意事項（複数行対応）
  applicationDetails?: ApplicationDetails; // イベント申込詳細情報
  status?: EventStatus; // 公開状態（デフォルトは published）
  createdAt?: string; // 作成日時（ISO8601形式）
  updatedAt?: string; // 更新日時（ISO8601形式）
}

/**
 * 日付ごとのイベントマップ
 */
export type EventsMap = {
  [dateKey: string]: HololiveEvent[];
};
