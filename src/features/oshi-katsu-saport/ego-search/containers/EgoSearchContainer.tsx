import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { EgoSearchState, useEgoSearchState } from '../hooks/useEgoSearchState';
import { defaultEgoSearchFilters } from '../types';
import EgoSearchPresenter from '../presenters/EgoSearchPresenter';

const initialState: EgoSearchState = {
  config: {
    isLoading: true,
    isHelpModalOpen: false,
    showSearchPreview: false,
  },
  data: {
    talents: [],
    excludeWords: [],
  },
  filters: defaultEgoSearchFilters,
  ui: {
    talentSearchQuery: '',
    isDropdownOpen: false,
  },
};

/**
 * エゴサーチ サポート画面
 */
const EgoSearchContainer: React.FC = () => {
  const [state, setState] = useState<EgoSearchState>(initialState);

  // Actions Hook
  const { actions } = useEgoSearchState(state, setState);

  return (
    <>
      <Helmet>
        <title>エゴサーチ サポート | ホロリスの推し活サポート</title>
        <meta name="description" content="高度な検索フィルタで効率的にエゴサーチができます。タレントアカウントの絞り込みや、除外ワード設定など、便利な機能が満載。" />
        <meta property="og:title" content="エゴサーチ サポート | ホロリスの推し活サポート" />
        <meta property="og:description" content="高度な検索フィルタで効率的にエゴサーチができます。タレントアカウントの絞り込みや、除外ワード設定など、便利な機能が満載。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/ego-search-support" />
        <meta name="twitter:title" content="エゴサーチ サポート | ホロリスの推し活サポート" />
        <meta name="twitter:description" content="高度な検索フィルタで効率的にエゴサーチができます。" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/ego-search-support" />
      </Helmet>
      <EgoSearchPresenter
        state={state}
        actions={actions}
      />
    </>
  );
};

export default EgoSearchContainer;
