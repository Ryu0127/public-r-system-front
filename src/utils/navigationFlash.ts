/**
 * 画面遷移時に一度だけ受け渡す値（フラッシュ）
 *
 * react-router の navigate(path, { state }) の置き換え。
 * Next.js App Router には遷移 state が無いため sessionStorage を使う。
 * 受け取り側で consume すると削除されるので、再読み込みで再表示されない。
 */
const KEY_PREFIX = 'navigationFlash:';

export const setNavigationFlash = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // sessionStorage が使えない環境では受け渡しを諦める
  }
};

export const consumeNavigationFlash = <T>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + key);
    if (raw == null) return null;
    sessionStorage.removeItem(KEY_PREFIX + key);
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
