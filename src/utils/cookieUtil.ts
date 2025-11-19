/**
 * クッキー管理ユーティリティ
 */

/**
 * クッキーを取得
 * @param name クッキー名
 * @returns クッキーの値（存在しない場合はnull）
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

/**
 * クッキーを設定
 * @param name クッキー名
 * @param value クッキーの値
 * @param days 有効期限（日数）デフォルトは30日
 */
export const setCookie = (name: string, value: string, days: number = 30): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * クッキーを削除
 * @param name クッキー名
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
