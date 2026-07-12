import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { OshiKatsuSaportState, useOshiKatsuSaportState } from '../hooks/useOshiKatsuSaportState';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import OshiKatsuSaportPresenter from '../presenters/OshiKatsuSaportPresenter';

const initialState: OshiKatsuSaportState = {
  config: {
    isLoading: true,
  },
  data: {
    features: [],
    changeLogs: [],
    limitedTimeTopic: null,
    musicList: [],
    talentGroups: [],
    selectedTalent: null,
    selectedGroupId: null,
  },
};

/**
 * /
 * ホロリスの推し活サポートホーム画面
 */
const OshiKatsuSaportContainer: React.FC = () => {
  const [state, setState] = useState<OshiKatsuSaportState>(initialState);

  // Actions Hook
  const { actions } = useOshiKatsuSaportState(state, setState);
  const [searchParams, setSearchParams] = useSearchParams();
  const talentQuery = useMemo(() => (searchParams.get('talent') ?? '').trim(), [searchParams]);

  // URLの ?talent=...（slug）がある場合、完全一致するタレントを自動選択（他画面と同様）
  useEffect(() => {
    if (state.config.isLoading) return;
    if (!talentQuery) return;
    if (state.data.selectedTalent?.talentSlug === talentQuery) return;
    const found = state.data.talentGroups
      .flatMap((group) => group.talents)
      .find((t) => t.talentSlug === talentQuery);
    if (!found) return;
    actions.selectTalent(found);
  }, [
    state.config.isLoading,
    state.data.selectedTalent,
    state.data.talentGroups,
    talentQuery,
    actions,
  ]);

  // タレント選択/解除時に URL パラメータへ反映（他画面と同様）
  const actionsWithUrl = useMemo(() => {
    return {
      ...actions,
      selectTalent: (talent: Talent) => {
        setSearchParams({ talent: String(talent.talentSlug ?? '').trim() });
        actions.selectTalent(talent);
      },
      clearTalentSelection: () => {
        // URL の ?talent= を消さないと自動再選択されてしまう
        setSearchParams({});
        actions.clearTalentSelection();
      },
    };
  }, [actions, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>ホロリスの推し活サポート</title>
        <meta name="description" content="推し活をもっと楽しく！ホロリスの推し活サポートは、推し活を全力でサポートするファン作成サイトです。タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <meta property="og:title" content="ホロリスの推し活サポート" />
        <meta property="og:description" content="推し活をもっと楽しく！タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/" />
        <meta name="twitter:title" content="ホロリスの推し活サポート" />
        <meta name="twitter:description" content="推し活をもっと楽しく！タレント別ハッシュタグ検索、生活スケジュール管理など、推しとの思い出を記録・共有できる便利な機能を提供しています。" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/" />
      </Helmet>
      <OshiKatsuSaportPresenter
        state={state}
        actions={actionsWithUrl}
      />
    </>
  );
};

export default OshiKatsuSaportContainer;
