'use client';

import React, { ReactNode, Suspense, useSyncExternalStore } from 'react';

const subscribe = () => () => {};

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 子要素をブラウザ上でのみ描画する。
 *
 * 既存画面は localStorage / window / 現在時刻を初期描画で参照するため、
 * サーバー描画するとハイドレーション不一致が起きる。
 * メタデータ（title / OGP 等）はページの generateMetadata でサーバー出力し、
 * 画面本体は従来どおりクライアントで描画する。
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isClient) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default ClientOnly;
