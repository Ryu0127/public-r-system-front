import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from 'config/metadata';
import { SITE_NAME } from 'config/site';
import { findSimplePage, SIMPLE_PAGES } from 'features/simple-pages/data/simplePages';
import SimplePageViewerContainer from 'features/simple-pages/containers/SimplePageViewerContainer';

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

/** 登録済みのイベントページをビルド時に静的生成する */
export function generateStaticParams() {
  return SIMPLE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findSimplePage(slug);
  if (!page) {
    return { title: 'ページが見つかりません' };
  }

  return buildPageMetadata({
    title: `${page.title} | ${SITE_NAME}`,
    description: page.metaDescription,
    keywords: page.keywords,
    path: `/event/${page.slug}`,
    author: true,
    robots: { index: true, follow: true },
    ogImage: {
      url: page.ogImagePath,
      width: page.ogImageWidth,
      height: page.ogImageHeight,
      type: 'image/jpeg',
    },
    twitterImage: page.ogImagePath,
  });
}

/**
 * イベントページ（public/event 配下の静的HTMLを iframe 表示）
 *
 * URL: /event/[slug]
 * 画面本体はブラウザ API を描画時に使わないため、サーバー描画する。
 */
export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  if (!findSimplePage(slug)) {
    notFound();
  }
  return <SimplePageViewerContainer slug={slug} />;
}
