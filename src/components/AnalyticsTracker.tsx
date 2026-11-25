'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, logPageView } from 'utils/analytics';

/**
 * Google アナリティクスの初期化とページ遷移の計測
 * （旧 App.js の initGA + AnalyticsTracker）
 */
const AnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initGA();
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    logPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
};

export default AnalyticsTracker;
