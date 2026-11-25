'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParamsState } from 'hooks/navigation/useSearchParamsState';
import { useDocumentTitle } from 'hooks/useDocumentTitle';
import { TalentMusicState, useTalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { toGroupSlug } from '../utils/toGroupSlug';
import { saveTalentSelection } from 'utils/talentSelectionStorage';
import { getMusicOgPage } from 'og/musicOgPages';
import TalentMusicPresenter from '../presenters/TalentMusicPresenter';

const initialState: TalentMusicState = {
  config: {
    isLoading: true,
    isMusicLoading: false,
    isMusicLoadingMore: false,
    isDropdownOpen: false,
    activeFilter: 'all',
    hasMoreMusic: false,
    isMultiSelectMode: false,
  },
  data: {
    talents: [],
    groups: [],
    playlists: [],
    musicList: [],
    musicPagination: null,
    musicCounts: null,
    selectedTalent: null,
    selectedGroup: null,
    playlistSelection: [],
  },
  ui: {
    talentSearchQuery: '',
  },
};

/**
 * 楽曲一覧画面
 */
const TalentMusicContainer: React.FC = () => {
  const [state, setState] = useState<TalentMusicState>(initialState);
  const { actions } = useTalentMusicState(state, setState);
  const [searchParams, setSearchParams] = useSearchParamsState();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);
  const groupQuery = useMemo(() => (searchParams.get('group') ?? '').trim(), [searchParams]);
  const urlSelectionAppliedRef = useRef(false);

  useEffect(() => {
    actions.loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL に talent/group がある場合のみ、一覧取得後に選択を適用（未指定時は loadData 内で全件取得済み）
  useEffect(() => {
    if (state.config.isLoading) return;
    if (urlSelectionAppliedRef.current) return;

    if (talentQuery) {
      const found = state.data.talents.find((t) => t.talentSlug === talentQuery);
      if (!found) return;
      urlSelectionAppliedRef.current = true;
      saveTalentSelection({ talentSlug: found.talentSlug ?? null, groupId: found.groupId });
      actions.selectTalent(found);
      return;
    }

    if (groupQuery) {
      const found = state.data.groups.find((g) => toGroupSlug(g.groupNameEn) === groupQuery);
      if (!found) return;
      urlSelectionAppliedRef.current = true;
      saveTalentSelection({ talentSlug: null, groupId: found.groupId });
      actions.selectGroup(found);
      return;
    }

    urlSelectionAppliedRef.current = true;
  }, [
    state.config.isLoading,
    state.data.talents,
    state.data.groups,
    talentQuery,
    groupQuery,
    actions,
  ]);

  const actionsWithUrl: TalentMusicActions = useMemo(() => {
    return {
      ...actions,
      selectTalent: (talent) => {
        setSearchParams({ talent: String(talent.talentSlug ?? '').trim() });
        saveTalentSelection({ talentSlug: talent.talentSlug ?? null, groupId: talent.groupId });
        actions.selectTalent(talent);
      },
      selectGroup: (group) => {
        setSearchParams({ group: toGroupSlug(group.groupNameEn) });
        saveTalentSelection({ talentSlug: null, groupId: group.groupId });
        actions.selectGroup(group);
      },
      clearSelection: () => {
        setSearchParams({});
        saveTalentSelection({ talentSlug: null, groupId: null });
        actions.clearSelection();
      },
    };
  }, [actions, setSearchParams]);

  // タブタイトルはタレント選択に追従させる（初期値は app/music/page.tsx の generateMetadata）
  const ogPage = useMemo(() => getMusicOgPage(talentQuery), [talentQuery]);
  useDocumentTitle(ogPage.title);

  return <TalentMusicPresenter state={state} actions={actionsWithUrl} />;
};

export default TalentMusicContainer;
