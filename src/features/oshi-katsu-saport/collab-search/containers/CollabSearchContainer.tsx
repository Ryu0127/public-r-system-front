import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCollabSearchState } from '../hooks/useCollabSearchState';
import { CollabSearchPresenter } from '../presenters/CollabSearchPresenter';

export const CollabSearchContainer: React.FC = () => {
  const { state, actions } = useCollabSearchState();

  return (
    <>
      <Helmet>
        <title>タレントコラボ配信検索 | 推し活サポート</title>
        <meta
          name="description"
          content="タレント同士のコラボ配信アーカイブを検索できます。メインタレントを選択すると、過去にコラボしたタレントと配信動画が表示されます。"
        />
        <meta property="og:title" content="タレントコラボ配信検索 | 推し活サポート" />
        <meta
          property="og:description"
          content="タレント同士のコラボ配信アーカイブを検索できます。"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <CollabSearchPresenter state={state} actions={actions} />
    </>
  );
};
