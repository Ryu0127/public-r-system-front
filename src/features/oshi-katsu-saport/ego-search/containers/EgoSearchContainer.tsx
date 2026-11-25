'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParamsState } from 'hooks/navigation/useSearchParamsState';
import { EgoSearchState, useEgoSearchState } from '../hooks/useEgoSearchState';
import { defaultEgoSearchFilters } from '../types';
import { loadTalentSelection, saveTalentSelection } from 'utils/talentSelectionStorage';
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
  const [searchParams, setSearchParams] = useSearchParamsState();
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
    saveTalentSelection({ talentSlug: found.talentSlug ?? null, groupId: found.groupId });
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
        saveTalentSelection({ talentSlug: talent.talentSlug ?? null, groupId: talent.groupId });
        actions.selectTalent(talent);
      },
      resetTalentSelection: () => {
        setSearchParams({});
        saveTalentSelection({ talentSlug: null, groupId: loadTalentSelection().groupId });
        actions.resetTalentSelection();
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <EgoSearchPresenter
        state={state}
        actions={actionsWithUrl}
      />
    </>
  );
};

export default EgoSearchContainer;
