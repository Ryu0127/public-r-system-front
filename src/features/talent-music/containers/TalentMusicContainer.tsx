import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { TalentMusicState, useTalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { toGroupSlug } from '../utils/toGroupSlug';
import TalentMusicPresenter from '../presenters/TalentMusicPresenter';

const initialState: TalentMusicState = {
  config: {
    isLoading: true,
    isMusicLoading: false,
    isDropdownOpen: false,
    activeFilter: 'all',
  },
  data: {
    talents: [],
    groups: [],
    musicList: [],
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
  const groupQuery  = useMemo(() => (searchParams.get('group')  ?? '').trim(), [searchParams]);

  useEffect(() => {
    actions.loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択して楽曲を取得
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    if (state.data.selectedTalent?.talentSlug === talentQuery) return;

    const found = state.data.talents.find((t) => t.talentSlug === talentQuery);
    if (!found) return;
    actions.selectTalent(found);
  }, [state.config.isLoading, state.data.selectedTalent, state.data.talents, talentQuery, actions]);

  // URLの ?group=...（slug）がある場合、一致するグループを自動選択して楽曲を取得
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!groupQuery) return;
    if (toGroupSlug(state.data.selectedGroup?.groupNameEn ?? '') === groupQuery) return;

    const found = state.data.groups.find((g) => toGroupSlug(g.groupNameEn) === groupQuery);
    if (!found) return;
    actions.selectGroup(found);
  }, [state.config.isLoading, state.data.selectedGroup, state.data.groups, groupQuery, actions]);

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
