import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, DEFAULT_TWITTER_IMAGE_PATH, SITE_NAME } from './site';

type OgImage = {
  url: string;
  width?: number;
  height?: number;
  type?: string;
};

export type PageMetadataInput = {
  title: string;
  description?: string;
  keywords?: string;
  /** サイトルートからのパス（canonical / og:url に使用）。省略時は canonical を出さない */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  ogImage?: OgImage;
  twitterImage?: string;
  robots?: Metadata['robots'];
  author?: boolean;
};

/**
 * ページ単位の Metadata を組み立てる。
 *
 * Next.js の Metadata は openGraph / twitter 単位で浅くマージされるため、
 * サイト名・ロケール・既定画像などの共通値もここで毎回埋める。
 */
export const buildPageMetadata = ({
  title,
  description,
  keywords,
  path,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  ogImage,
  twitterImage,
  robots,
  author,
}: PageMetadataInput): Metadata => {
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;

  return {
    title,
    description,
    keywords,
    ...(author ? { authors: [{ name: SITE_NAME }] } : {}),
    ...(robots ? { robots } : {}),
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      type: 'website',
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      ...(path ? { url: path } : {}),
      images: [ogImage ?? { url: DEFAULT_OG_IMAGE_PATH }],
      locale: 'ja_JP',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle ?? resolvedOgTitle,
      description: twitterDescription ?? resolvedOgDescription,
      images: [twitterImage ?? DEFAULT_TWITTER_IMAGE_PATH],
    },
  };
};
