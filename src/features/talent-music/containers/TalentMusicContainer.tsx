import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { TalentMusicState, useTalentMusicState, TalentMusicActions } from '../hooks/useTalentMusicState';
import { toGroupSlug } from '../utils/toGroupSlug';
import { saveTalentSelection } from 'utils/talentSelectionStorage';
import { getMusicOgPage, SITE_ORIGIN } from 'og/musicOgPages';
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

  const ogPage = useMemo(() => getMusicOgPage(talentQuery), [talentQuery]);
  const pageUrl = `${SITE_ORIGIN}${ogPage.path}`;
  const imageUrl = `${SITE_ORIGIN}${ogPage.imagePath}`;
  const twitterImageUrl = `${SITE_ORIGIN}${ogPage.twitterImagePath}`;

  return (
    <>
      <Helmet>
        <title>{ogPage.title}</title>
        <meta name="description" content={ogPage.description} />
        <meta name="keywords" content={ogPage.keywords} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ogPage.title} />
        <meta property="og:description" content={ogPage.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        {ogPage.imageWidth != null && (
          <meta property="og:image:width" content={String(ogPage.imageWidth)} />
        )}
        {ogPage.imageHeight != null && (
          <meta property="og:image:height" content={String(ogPage.imageHeight)} />
        )}
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:site_name" content="ホロリスの推し活サポート" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={ogPage.title} />
        <meta name="twitter:description" content={ogPage.description} />
        <meta name="twitter:image" content={twitterImageUrl} />
      </Helmet>
      <TalentMusicPresenter state={state} actions={actionsWithUrl} />
    </>
  );
};

export default TalentMusicContainer;
