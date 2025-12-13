import { EventType } from './index';

/**
 * イベント種類ごとの固定カラー定義
 */
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  anniversary: '#FF6B9D', // 記念配信 - ピンク
  live: '#FF4444',        // ライブ - 赤
  concert: '#FF8C00',     // コンサート - オレンジ
  meet: '#32CD32',        // リアルイベント・ミート - 緑
  collab: '#9370DB',      // コラボ配信 - 紫
  birthday: '#FFD700',    // 誕生日配信 - 金色
  goods: '#1E90FF',       // グッズ - 青
  voice: '#87CEEB',       // ボイス - スカイブルー
  application: '#FF69B4', // イベント申込 - ホットピンク
  other: '#808080',       // その他 - グレー
};

/**
 * イベント種類からカラーを取得
 */
export const getEventTypeColor = (type: EventType): string => {
  return EVENT_TYPE_COLORS[type];
};

/**
 * イベント種類のラベル定義
 */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  anniversary: '記念配信',
  live: 'ライブ',
  concert: 'コンサート',
  meet: 'リアルイベント・ミート',
  collab: 'コラボ配信',
  birthday: '誕生日配信',
  goods: 'グッズ',
  voice: 'ボイス',
  application: 'イベント申込',
  other: 'その他',
};
