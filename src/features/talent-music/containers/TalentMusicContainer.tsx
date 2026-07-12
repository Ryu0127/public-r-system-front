import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { TalentMusicState, useTalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { toGroupSlug } from '../utils/toGroupSlug';
import TalentMusicPresenter from '../presenters/TalentMusicPresenter';

const initialState: TalentMusicState = {
  config: {
    isLoading: true,
    isMusicLoading: false,
    isMusicLoadingMore: false,
    isDropdownOpen: false,
    activeFilter: 'all',
    hasMoreMusic: false,
  },
  data: {
    talents: [],
    groups: [],
    musicList: [],
    musicPagination: null,
    musicCounts: null,
    selectedTalent: null,
    selectedGroup: null,
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
  const [searchParams, setSearchParams] = useSearchParams();
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
      actions.selectTalent(found);
      return;
    }

    if (groupQuery) {
      const found = state.data.groups.find((g) => toGroupSlug(g.groupNameEn) === groupQuery);
      if (!found) return;
      urlSelectionAppliedRef.current = true;
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
        actions.selectTalent(talent);
      },
      selectGroup: (group) => {
        setSearchParams({ group: toGroupSlug(group.groupNameEn) });
        actions.selectGroup(group);
      },
      clearSelection: () => {
        setSearchParams({});
        actions.clearSelection();
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>楽曲一覧 | ホロリスの推し活サポート</title>
        <meta
          name="description"
          content="ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認できます。推しの楽曲をまとめてチェックしよう。"
        />
        <meta property="og:title" content="楽曲一覧 | ホロリスの推し活サポート" />
        <meta
          property="og:description"
          content="ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認。推しの楽曲をまとめてチェック。"
        />
        <meta
          property="og:url"
          content="https://public-r-system-front.vercel.app/music"
        />
        <link
          rel="canonical"
          href="https://public-r-system-front.vercel.app/music"
        />
      </Helmet>
      <TalentMusicPresenter state={state} actions={actionsWithUrl} />
    </>
  );
};

export default TalentMusicContainer;
