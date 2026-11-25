'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParamsState } from 'hooks/navigation/useSearchParamsState';
import { OshiKatsuSaportState, useOshiKatsuSaportState } from '../hooks/useOshiKatsuSaportState';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import OshiKatsuSaportPresenter from '../presenters/OshiKatsuSaportPresenter';

const initialState: OshiKatsuSaportState = {
  config: {
    isLoading: true,
  },
  data: {
    features: [],
    changeLogs: [],
    limitedTimeTopic: null,
    musicList: [],
    talentGroups: [],
    selectedTalent: null,
    selectedGroupId: null,
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
  const [searchParams, setSearchParams] = useSearchParamsState();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択（他画面と同様）
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    if (state.data.selectedTalent?.talentSlug === talentQuery) return;
    const found = state.data.talentGroups
      .flatMap((group) => group.talents)
      .find((t) => t.talentSlug === talentQuery);
    if (!found) return;
    actions.selectTalent(found);
  }, [
    state.config.isLoading,
    state.data.selectedTalent,
    state.data.talentGroups,
    talentQuery,
    actions,
  ]);

  // タレント選択/解除時に URL パラメータへ反映（他画面と同様）
  const actionsWithUrl = useMemo(() => {
    return {
      ...actions,
      selectTalent: (talent: Talent) => {
        setSearchParams({ talent: String(talent.talentSlug ?? '').trim() });
        actions.selectTalent(talent);
      },
      clearTalentSelection: () => {
        // URL の ?talent= を消さないと自動再選択されてしまう
        setSearchParams({});
        actions.clearTalentSelection();
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <OshiKatsuSaportPresenter
        state={state}
        actions={actionsWithUrl}
      />
    </>
  );
};

export default OshiKatsuSaportContainer;
