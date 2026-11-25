'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParamsState } from 'hooks/navigation/useSearchParamsState';
import { HashtagSearchState, useHashtagSearchState } from '../hooks/useHashtagSearchState';
import { loadTalentSelection, saveTalentSelection } from 'utils/talentSelectionStorage';
import HashtagSearchPresenter from '../presenters/HashtagSearchPresenter';

const initialState: HashtagSearchState = {
  config: {
    isLoading: true,
    mode: 'post',
    isDropdownOpen: false,
    isHelpModalOpen: false,
    includeEventUrl: false,
    showSelectedTags: false,
    showSearchPreview: false,
  },
  data: {
    talents: [],
    selectedTalent: null,
    hashtags: [],
    eventHashtags: [],
  },
  ui: {
    selectedTags: [],
    selectedEventHashtags: [],
    searchQuery: '',
    talentSearchQuery: '',
  },
};

/**
 * タレント別 ハッシュタグ投稿/検索 サポート画面
 */
const HashtagSearchContainer: React.FC = () => {
  const [state, setState] = useState<HashtagSearchState>(initialState);

  // Actions Hook
  const { actions } = useHashtagSearchState(state, setState);
  const [searchParams, setSearchParams] = useSearchParamsState();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択してハッシュタグを取得
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    if (state.data.selectedTalent?.talentSlug === talentQuery) return;
    const found = state.data.talents.find((t) => t.talentSlug === talentQuery);
    if (!found) return;
    saveTalentSelection({ talentSlug: found.talentSlug ?? null, groupId: found.groupId });
    actions.selectTalent(found);
  }, [
    state.config.isLoading,
    state.data.selectedTalent,
    state.data.talents,
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
      clearTalentSelection: () => {
        // URL の ?talent= を消さないと自動再選択されてしまう
        setSearchParams({});
        saveTalentSelection({ talentSlug: null, groupId: loadTalentSelection().groupId });
        actions.clearTalentSelection();
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <HashtagSearchPresenter
        state={state}
        actions={actionsWithUrl}
      />
    </>
  );
};

export default HashtagSearchContainer;
