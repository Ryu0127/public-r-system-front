/**
 * プレイリスト管理画面の型定義
 */
import type { ApiResponse } from '../../talent-music-edit/types';

/** 管理者用プレイリストデータ */
export interface AdminMusicPlaylist {
  id: number;
  /** YouTube プレイリストID（URL の list パラメータ） */
  youtubePlaylistCode: string;
  name: string;
  url: string;
  /** 楽曲一覧画面に表示するか */
  isVisible: boolean;
  /** 紐付け楽曲数（一覧取得時のみ） */
  musicCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** 登録・更新リクエスト */
export interface MusicPlaylistFormData {
  /** プレイリストID または プレイリストURL（API 側で ID を抽出） */
  youtubePlaylistCode: string;
  name: string;
  isVisible: boolean;
}

export type MusicPlaylistListResponse = ApiResponse<AdminMusicPlaylist[]>;
export type MusicPlaylistDetailResponse = ApiResponse<AdminMusicPlaylist>;
export type MusicPlaylistMutationResponse = ApiResponse<AdminMusicPlaylist>;
export type MusicPlaylistDeleteResponse = ApiResponse<{ id: number }>;

/** プレイリストに紐付いた楽曲（GET/PUT …/music-playlists/{id}/music） */
export interface PlaylistMusicItem {
  musicId: number;
  title: string;
  youtubeVideoId: string;
  type: 'original' | 'cover';
  releaseDate: string;
  /** 並び順（1始まり） */
  sort: number;
  /** プレイリスト上でこの楽曲に紐付けたタレントID */
  talentIds: number[];
  /** 楽曲管理で楽曲に紐付いているタレントID（「楽曲のタレントを反映」用） */
  musicTalentIds: number[];
}

export type PlaylistMusicListResponse = ApiResponse<PlaylistMusicItem[]>;

/** 一覧画面へ戻る際に渡す完了メッセージ */
export interface MusicPlaylistLastAction {
  message: string;
  id: number;
}
