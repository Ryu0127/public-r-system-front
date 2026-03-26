import React, { useMemo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    const selected =
      state.filters.talentAccounts.selectedAccounts.length > 0
        ? state.filters.talentAccounts.selectedAccounts[0].talentId
        : null;
    const found = state.data.talents.find((t) => t.talentSlug === talentQuery);
    if (!found) return;
    if (selected === found.id) return;
    actions.selectTalent(found);
  }, [
    state.config.isLoading,
    state.data.talents,
    state.filters.talentAccounts.selectedAccounts,
    talentQuery,
    actions,
  ]);

  const actionsWithUrl = useMemo(() => {
    return {
      ...actions,
      selectTalent: (talent: any) => {
        setSearchParams({ talent: String(talent.talentSlug ?? '').trim() });
        actions.selectTalent(talent);
      },
      resetTalentSelection: () => {
        setSearchParams({});
        actions.resetTalentSelection();
      },
    };
  }, [actions, setSearchParams]);

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
        actions={actionsWithUrl}
      />
    </>
  );
};

export default EgoSearchContainer;
