/**
 * groupNameEn を URL クエリパラメータ用スラグに変換する
 * 例: "1st Generation" → "1st-generation"
 *     "Project: HOPE"  → "project-hope"
 */
export const toGroupSlug = (groupNameEn: string): string =>
  groupNameEn
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // コロン等の記号を除去
    .trim()
    .replace(/\s+/g, '-');    // スペースをハイフンに変換
