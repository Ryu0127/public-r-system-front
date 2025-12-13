/**
 * API設定
 */

// APIベースURL（環境変数から取得、デフォルトはlocalhost）
export const API_BASE_URL = process.env.REACT_APP_API_DOMAIN || 'http://localhost:8000';

// APIエンドポイント
export const API_ENDPOINTS = {
  // イベント管理（管理者用）
  events: {
    list: `${API_BASE_URL}/api/admin/events`,
    detail: (id: string) => `${API_BASE_URL}/api/admin/events/${id}`,
    create: `${API_BASE_URL}/api/admin/events`,
    update: (id: string) => `${API_BASE_URL}/api/admin/events/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/admin/events/${id}`,
  },
  // パブリックイベント（一般ユーザー用）
  publicEvents: {
    list: `${API_BASE_URL}/api/admin/events`,
    detail: (id: string) => `${API_BASE_URL}/api/events/${id}`,
  },
};

/**
 * APIリクエストヘッダーを取得
 */
export const getApiHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 認証が必要な場合はここにトークンを追加
    // 'Authorization': `Bearer ${getAuthToken()}`,
  };
};
