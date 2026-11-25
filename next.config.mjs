/**
 * Next.js 設定
 *
 * - 環境変数: CRA 時代の REACT_APP_* もフォールバックとして受け付ける
 *   （Vercel / .env の変数名を NEXT_PUBLIC_* へ移すまでの互換措置）
 * - リダイレクト: 旧 react-router の <Navigate> をサーバー側リダイレクトに置き換え
 * - Docker ビルド時のみ standalone 出力（BUILD_STANDALONE=true）
 */

/** NEXT_PUBLIC_* が未設定なら REACT_APP_* の値を使う */
const withLegacyEnv = (nextName, legacyName) => {
  const value = process.env[nextName] ?? process.env[legacyName];
  return value === undefined ? {} : { [nextName]: value };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  env: {
    ...withLegacyEnv('NEXT_PUBLIC_API_DOMAIN', 'REACT_APP_API_DOMAIN'),
    ...withLegacyEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'REACT_APP_GA_MEASUREMENT_ID'),
  },
  async redirects() {
    return [
      // 旧URL → 新URL
      { source: '/talent-music', destination: '/music', permanent: true },
      { source: '/simple-pages/:slug', destination: '/event/:slug', permanent: true },
      // 管理画面トップはダッシュボードへ
      { source: '/admin', destination: '/admin/dashboard', permanent: false },
    ];
  },
};

export default nextConfig;
