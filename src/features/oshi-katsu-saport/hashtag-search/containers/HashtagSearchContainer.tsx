import React, { useMemo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { HashtagSearchState, useHashtagSearchState } from '../hooks/useHashtagSearchState';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択してハッシュタグを取得
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    if (state.data.selectedTalent?.talentSlug === talentQuery) return;
    const found = state.data.talents.find((t) => t.talentSlug === talentQuery);
    if (!found) return;
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
        actions.selectTalent(talent);
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>タレント別 ハッシュタグ投稿/検索 サポート | ホロリスの推し活サポート</title>
        <meta name="description" content="お気に入りのタレントのハッシュタグを簡単に検索・投稿できます。推しのSNS投稿を見逃さず、効率的に推し活を楽しむためのハッシュタグサポート機能。" />
        <meta property="og:title" content="タレント別 ハッシュタグサポート | ホロリスの推し活サポート" />
        <meta property="og:description" content="お気に入りのタレントのハッシュタグを簡単に検索・投稿。推しのSNS投稿を見逃さず、効率的に推し活を楽しめます。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/talent-hashtag-support" />
        <meta name="twitter:title" content="タレント別 ハッシュタグサポート | ホロリスの推し活サポート" />
        <meta name="twitter:description" content="お気に入りのタレントのハッシュタグを簡単に検索・投稿。推しのSNS投稿を見逃さず、効率的に推し活を楽しめます。" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/talent-hashtag-support" />
      </Helmet>
      <HashtagSearchPresenter
        state={state}
        actions={actionsWithUrl}
      />
    </>
  );
};

export default HashtagSearchContainer;
