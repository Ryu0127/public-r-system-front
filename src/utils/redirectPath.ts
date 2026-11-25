/**
 * ログイン後の遷移先（?from=）の扱い
 *
 * react-router の navigate('/login', { state: { from } }) の置き換え。
 * URL に載るため、外部サイトへのオープンリダイレクトにならないよう
 * サイト内パス（"/" 始まり、"//" や "/\" 始まりでない）のみ許可する。
 */
export const LOGIN_PATH = '/login';
export const REDIRECT_FROM_PARAM = 'from';

export const buildLoginPath = (from: string): string =>
  `${LOGIN_PATH}?${new URLSearchParams({ [REDIRECT_FROM_PARAM]: from }).toString()}`;

export const resolveSafeRedirectPath = (raw: string | null | undefined, fallback = '/'): string => {
  if (!raw) return fallback;
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  return raw;
};
