/** metadata 生成で API を待つ上限（クローラーへの応答を遅らせすぎない） */
const FETCH_TIMEOUT_MS = 3000;
/** 楽曲名のキャッシュ秒数（ISR） */
const REVALIDATE_SECONDS = 3600;

/**
 * サーバー側（generateMetadata）で楽曲名だけを取得する。
 *
 * - API URL が絶対URLで設定されていない場合や、取得に失敗した場合は null
 *   （呼び出し側は汎用タイトルにフォールバックする）
 * - 認証トークンは付与しない（公開APIとして取得できる範囲のみ）
 */
export const fetchLyricsMusicTitle = async (musicId: number): Promise<string | null> => {
  const base = process.env.NEXT_PUBLIC_API_DOMAIN?.trim();
  if (!base || !/^https?:\/\//.test(base)) return null;

  const url = `${base.replace(/\/$/, '')}/oshi-katsu-saport/talent-music/${encodeURIComponent(
    String(musicId)
  )}/lyrics`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const title = (json as { data?: { music?: { title?: unknown } } })?.data?.music?.title;
    return typeof title === 'string' && title.trim() ? title.trim() : null;
  } catch {
    return null;
  }
};
