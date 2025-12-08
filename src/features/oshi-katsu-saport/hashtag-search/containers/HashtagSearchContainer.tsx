import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HashtagSearchState, useHashtagSearchState } from '../hooks/useHashtagSearchState';
import HashtagSearchPresenter from '../presenters/HashtagSearchPresenter';
import { defaultAdvancedSearchFilters } from '../types/advancedSearchFilters';
import { loadExcludeWords } from '../utils/excludeWordsStorage';

const initialState: HashtagSearchState = {
  config: {
    isLoading: true,
    mode: 'post',
    isDropdownOpen: false,
    isHelpModalOpen: false,
    includeEventUrl: false,
    showSelectedTags: false,
    showSearchPreview: false,
    showAdvancedFilters: false,
  },
  data: {
    talents: [],
    selectedTalent: null,
    hashtags: [],
    eventHashtags: [],
    excludeWords: loadExcludeWords(),
  },
  ui: {
    selectedTags: [],
    selectedEventHashtags: [],
    searchQuery: '',
    talentSearchQuery: '',
  },
  advancedFilters: defaultAdvancedSearchFilters,
};

/**
 * タレント別 ハッシュタグ投稿/検索 サポート画面
 */
const HashtagSearchContainer: React.FC = () => {
  const [state, setState] = useState<HashtagSearchState>(initialState);

  // Actions Hook
  const { actions } = useHashtagSearchState(state, setState);

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
        actions={actions}
      />
    </>
  );
};

export default HashtagSearchContainer;
