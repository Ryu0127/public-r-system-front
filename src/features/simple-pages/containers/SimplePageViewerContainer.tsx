'use client';

import React from 'react';
import { findSimplePage } from '../data/simplePages';
import SimplePageViewerPresenter from '../presenters/SimplePageViewerPresenter';

interface SimplePageViewerContainerProps {
  /** 未指定・未登録の slug は「ページが見つかりません」を表示 */
  slug?: string;
}

/**
 * イベントページ（public/event 配下の静的HTML）ビューア
 *
 * title / OGP は app/event/[slug]/page.tsx の generateMetadata でサーバー出力する。
 */
const SimplePageViewerContainer: React.FC<SimplePageViewerContainerProps> = ({ slug }) => {
  const page = findSimplePage(slug);
  return <SimplePageViewerPresenter page={page} />;
};

export default SimplePageViewerContainer;
