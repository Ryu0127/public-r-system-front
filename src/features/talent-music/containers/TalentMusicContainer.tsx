import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { TalentMusicState, useTalentMusicState } from '../hooks/useTalentMusicState';
import TalentMusicPresenter from '../presenters/TalentMusicPresenter';

const initialState: TalentMusicState = {
  config: {
    isLoading: true,
    isDropdownOpen: false,
    activeFilter: 'all',
  },
  data: {
    talents: [],
    musicList: [],
    selectedTalent: null,
  },
  ui: {
    talentSearchQuery: '',
  },
};

/**
 * タレント別 楽曲一覧画面
 */
const TalentMusicContainer: React.FC = () => {
  const [state, setState] = useState<TalentMusicState>(initialState);
  const { actions } = useTalentMusicState(state, setState);

  useEffect(() => {
    actions.loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>タレント別 楽曲一覧 | ホロリスの推し活サポート</title>
        <meta
          name="description"
          content="ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認できます。推しの楽曲をまとめてチェックしよう。"
        />
        <meta property="og:title" content="タレント別 楽曲一覧 | ホロリスの推し活サポート" />
        <meta
          property="og:description"
          content="ホロライブタレントのオリジナル曲・カバー曲をYouTubeサムネイルで一覧確認。推しの楽曲をまとめてチェック。"
        />
        <meta
          property="og:url"
          content="https://public-r-system-front.vercel.app/talent-music"
        />
        <link
          rel="canonical"
          href="https://public-r-system-front.vercel.app/talent-music"
        />
      </Helmet>
      <TalentMusicPresenter state={state} actions={actions} />
    </>
  );
};

export default TalentMusicContainer;
