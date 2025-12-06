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
  | 'event'       // ライブイベント（ライブ、コンサート、ミート）
  | 'goods';      // グッズ/ボイス/申し込み

/**
 * 表示モード
 */
export type ViewMode = 'calendar' | 'list';

/**
 * ホロライブイベント
 */
export interface HololiveEvent {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd形式
  startTime?: string; // HH:mm形式
  endTime?: string; // HH:mm形式
  type: EventType;
  talentName: string;
  description?: string;
  color: string; // イメージカラー（16進数）
  url?: string; // 配信URLやイベント詳細URL
}

/**
 * 日付ごとのイベントマップ
 */
export type EventsMap = {
  [dateKey: string]: HololiveEvent[];
};
