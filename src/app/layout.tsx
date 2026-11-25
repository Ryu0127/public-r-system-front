import React, { ReactNode, Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import AnalyticsTracker from 'components/AnalyticsTracker';
import {
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_TWITTER_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_ORIGIN,
} from 'config/site';
import '../index.css';
import '../App.css';

/** サイト共通の既定メタデータ（旧 public/index.html の <head>） */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE_PATH }],
    locale: 'ja_JP',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_TWITTER_IMAGE_PATH],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

/** 構造化データ（JSON-LD） */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  description:
    '推し活をもっと楽しく！お気に入りのタレントを応援できるホロリスの推し活サポートアプリケーション。',
  url: `${SITE_ORIGIN}/`,
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    ratingCount: '100',
  },
  featureList: ['タレントハッシュタグ検索', '推し活情報収集', 'タレント応援機能'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Google Fonts（Material Icons / Symbols, Playfair Display, Montserrat） */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
