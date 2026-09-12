import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { findSimplePage } from '../data/simplePages';
import SimplePageViewerPresenter from '../presenters/SimplePageViewerPresenter';

const SITE_ORIGIN = 'https://public-r-system-front.vercel.app';

const SimplePageViewerContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = findSimplePage(slug);
  const pageUrl = page ? `${SITE_ORIGIN}/event/${page.slug}` : undefined;
  const ogImageUrl = page ? `${SITE_ORIGIN}${page.ogImagePath}` : undefined;

  return (
    <>
      <Helmet>
        <title>{page ? `${page.title} | ホロリスの推し活サポート` : 'ページが見つかりません'}</title>
        {page && pageUrl && ogImageUrl && (
          <>
            <meta name="description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta name="keywords" content="ときのそら,CHECK!,EP,購入ガイド,ホロライブ,先着特典,イベント,ホロリスの推し活サポート,推し活" />
            <meta name="author" content="ホロリスの推し活サポート" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={pageUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={`${page.title} | ホロリスの推し活サポート`} />
            <meta property="og:description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content={String(page.ogImageWidth)} />
            <meta property="og:image:height" content={String(page.ogImageHeight)} />
            <meta property="og:locale" content="ja_JP" />
            <meta property="og:site_name" content="ホロリスの推し活サポート" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={`${page.title} | ホロリスの推し活サポート`} />
            <meta name="twitter:description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta name="twitter:image" content={ogImageUrl} />
          </>
        )}
      </Helmet>
      <SimplePageViewerPresenter page={page} />
    </>
  );
};

export default SimplePageViewerContainer;
