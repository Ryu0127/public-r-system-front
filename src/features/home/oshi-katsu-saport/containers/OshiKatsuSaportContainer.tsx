import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { OshiKatsuSaportState, useOshiKatsuSaportState } from '../hooks/useOshiKatsuSaportState';
import OshiKatsuSaportPresenter from '../presenters/OshiKatsuSaportPresenter';

const initialState: OshiKatsuSaportState = {
  config: {
    isLoading: true,
  },
  data: {
    features: [],
    changeLogs: [],
    limitedTimeTopic: null,
  },
};

/**
 * /
 * ホロリスの推し活サポートホーム画面
 */
const OshiKatsuSaportContainer: React.FC = () => {
  const [state, setState] = useState<OshiKatsuSaportState>(initialState);

  // Actions Hook
  const { actions } = useOshiKatsuSaportState(state, setState);

  return (
    <>
      <Helmet>
        <title>ホロリスの推し活サポート</title>
        <meta name="description" content="推し活をもっと楽しく！ホロリスの推し活サポートは、推し活を全力でサポートするファン作成サイトです。タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <meta property="og:title" content="ホロリスの推し活サポート" />
        <meta property="og:description" content="推し活をもっと楽しく！タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/" />
        <meta name="twitter:title" content="ホロリスの推し活サポート" />
        <meta name="twitter:description" content="推し活をもっと楽しく！タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/" />
      </Helmet>
      <OshiKatsuSaportPresenter
        state={state}
        actions={actions}
      />
    </>
  );
};

export default OshiKatsuSaportContainer;
