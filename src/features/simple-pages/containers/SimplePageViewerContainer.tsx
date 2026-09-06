import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { findSimplePage } from '../data/simplePages';
import SimplePageViewerPresenter from '../presenters/SimplePageViewerPresenter';

const SimplePageViewerContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = findSimplePage(slug);

  return (
    <>
      <Helmet>
        <title>{page ? `${page.title} | ホロリスの推し活サポート` : 'ページが見つかりません'}</title>
        {page && (
          <>
            <meta name="description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta name="keywords" content="ときのそら,CHECK!,EP,購入ガイド,ホロライブ,先着特典,イベント,ホロリスの推し活サポート,推し活" />
            <meta name="author" content="ホロリスの推し活サポート" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://public-r-system-front.vercel.app/event/2026-11-04-ep-tokino-sora" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://public-r-system-front.vercel.app/event/2026-11-04-ep-tokino-sora" />
            <meta property="og:title" content={`${page.title} | ホロリスの推し活サポート`} />
            <meta property="og:description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta property="og:image" content="https://public-r-system-front.vercel.app/og-image.png" />
            <meta property="og:locale" content="ja_JP" />
            <meta property="og:site_name" content="ホロリスの推し活サポート" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content="https://public-r-system-front.vercel.app/event/2026-11-04-ep-tokino-sora" />
            <meta name="twitter:title" content={`${page.title} | ホロリスの推し活サポート`} />
            <meta name="twitter:description" content="ときのそら NEW EP「CHECK！」の購入ガイド。販売エディション、イベントスケジュール、先着特典、店舗一覧をまとめて確認できます。2026年11月4日発売。" />
            <meta name="twitter:image" content="https://public-r-system-front.vercel.app/twitter-image.png" />
          </>
        )}
      </Helmet>
      <SimplePageViewerPresenter page={page} />
    </>
  );
};

export default SimplePageViewerContainer;
