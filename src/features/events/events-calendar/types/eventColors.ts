import { EventType } from './index';

/**
 * イベント種類ごとの固定カラー定義（APIのtype値に対応）
 */
const EVENT_TYPE_COLOR_MAP: { [key: string]: string } = {
  'live': '#FF4444',            // ライブ - 赤
  'ファンミーティング': '#9370DB', // ファンミーティング - 紫
  'コラボイベント': '#FF8C00',     // コラボイベント - オレンジ
  'ポップアップストア': '#1E90FF', // ポップアップストア - 青
  'リアルイベント': '#32CD32',     // リアルイベント - 緑
  'イベント申込': '#FF69B4',       // イベント申込 - ホットピンク
  'イベント当落-入金': '#20B2AA',  // イベント当落-入金 - ライトシーグリーン
};

/**
 * イベント種類からカラーを取得
 */
export const getEventTypeColor = (type: EventType): string => {
  return EVENT_TYPE_COLOR_MAP[type] || '#808080'; // デフォルトはグレー
};

/**
 * イベント種類のラベル定義（APIのtype値がそのままラベル）
 */
export const getEventTypeLabel = (type: EventType): string => {
  return type; // APIのtype値がそのまま表示用ラベル
};
