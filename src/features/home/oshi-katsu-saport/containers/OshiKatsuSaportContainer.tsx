import React, { useState } from 'react';
import useTitle from 'utils/useTitle';
import { OshiKatsuSaportState, useOshiKatsuSaportState } from '../hooks/useOshiKatsuSaportState';
import OshiKatsuSaportPresenter from '../presenters/OshiKatsuSaportPresenter';

const initialState: OshiKatsuSaportState = {
  config: {
    isLoading: true,
  },
  data: {
    features: [],
    changeLogs: [],
    limitedTimeTopic: null,
  },
};

/**
 * /
 * 推し活サポートホーム画面
 */
const OshiKatsuSaportContainer: React.FC = () => {
  useTitle('推し活サポート');

  const [state, setState] = useState<OshiKatsuSaportState>(initialState);

  // Actions Hook
  const { actions } = useOshiKatsuSaportState(state, setState);

  return (
    <OshiKatsuSaportPresenter
      state={state}
      actions={actions}
    />
  );
};

export default OshiKatsuSaportContainer;
