/**
 * 楽曲管理画面の型定義
 */

import { MusicType } from '../../../talent-music/types';

export type { MusicType };

/**
 * 管理者用楽曲データ型
 */
export interface AdminMusic {
  id: number;
  title: string;
  /** 楽曲に紐づくタレントID（コラボ等で複数） */
  talentIds: number[];
  youtubeVideoId: string;
  type: MusicType;
  releaseDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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
 * 楽曲一覧取得レスポンス
 */
export type MusicListResponse = ApiResponse<AdminMusic[]>;

/**
 * 楽曲詳細取得レスポンス
 */
export type MusicDetailResponse = ApiResponse<AdminMusic>;

/**
 * 楽曲作成・更新レスポンス
 */
export type MusicMutationResponse = ApiResponse<AdminMusic>;

/**
 * 楽曲削除レスポンス
 */
export type MusicDeleteResponse = ApiResponse<{ id: number }>;

/**
 * 楽曲フォームの入力データ型
 */
export interface MusicFormData {
  title: string;
  talentIds: number[];
  youtubeVideoId: string;
  type: MusicType;
  releaseDate: string;
  description?: string;
}

/**
 * 楽曲種別のラベルマップ
 */
export const MUSIC_TYPE_LABELS: Record<MusicType, string> = {
  original: 'オリジナル曲',
  cover: 'カバー曲',
};
