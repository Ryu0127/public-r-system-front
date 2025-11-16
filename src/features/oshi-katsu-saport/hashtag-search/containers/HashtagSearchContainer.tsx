import React, { useState } from 'react';
import useTitle from 'utils/useTitle';
import { HashtagSearchState, useHashtagSearchState } from '../hooks/useHashtagSearchState';
import HashtagSearchPresenter from '../presenters/HashtagSearchPresenter';

const initialState: HashtagSearchState = {
  config: {
    isLoading: true,
    mode: 'post',
    isDropdownOpen: false,
    isHelpModalOpen: false,
    includeEventUrl: true,
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
  useTitle('タレント別 ハッシュタグ投稿/検索 サポート');

  const [state, setState] = useState<HashtagSearchState>(initialState);

  // Actions Hook
  const { actions } = useHashtagSearchState(state, setState);

  return (
    <HashtagSearchPresenter
      state={state}
      actions={actions}
    />
  );
};

export default HashtagSearchContainer;
