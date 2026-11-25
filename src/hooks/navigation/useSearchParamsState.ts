'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SearchParamsInit = Record<string, string>;

/**
 * react-router の useSearchParams 互換フック（Next.js App Router 版）
 *
 * - [searchParams, setSearchParams] を返す
 * - setSearchParams は現在のパスのまま、クエリ文字列を丸ごと置き換える
 *   （react-router と同様に履歴へ追加。スクロール位置は維持する）
 */
export const useSearchParamsState = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (next: SearchParamsInit) => {
      const query = new URLSearchParams(next).toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  return [searchParams, setSearchParams] as const;
};
