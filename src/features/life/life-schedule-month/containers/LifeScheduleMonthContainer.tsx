import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'hooks/auth/useAuth';
import { LifeScheduleMonthState, useLifeScheduleMonthState } from '../hooks/useLifeScheduleMonthState';
import LifeScheduleMonthPresenter from '../presenters/LifeScheduleMonthPresenter';
import { getYearMonthDefaultNow } from 'utils/dateUtil';

const initialState: LifeScheduleMonthState = {
  requestParams: {
    currentMonth: new Date(),
  },
  config: {
    isLoading: true,
    sidebarVisible: false,
  },
  data: {
    monthlyTasks: {},
  },
};

/**
 * /life/life-schedule-month
 * 月次スケジュール画面
 */
const LifeScheduleMonthContainer: React.FC = () => {
  // 認証チェック
  const { isAuthenticated, isChecking } = useAuth();

  // URLパラメータ
  const urlParams = new URLSearchParams(window.location.search);
  const usageYmd = urlParams.get('yearMonth');

  // 初期値設定
  const [state, setState] = useState<LifeScheduleMonthState>(() => {
    // 初期表示年月を設定
    const currentMonth = new Date(getYearMonthDefaultNow(usageYmd));
    return {
    ...initialState,
    requestParams: {
      currentMonth: currentMonth,
    },
  };
});

  // Actions Hook
  const { actions } = useLifeScheduleMonthState(state, setState);

  // 認証チェック中または未認証の場合は何も表示しない
  if (isChecking || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>月次スケジュール | ホロリスの推し活サポート</title>
        <meta name="description" content="月別の生活スケジュールを管理。1ヶ月の予定を一覧で確認し、推し活と日常生活を効率的に計画できます。" />
        <meta property="og:title" content="月次スケジュール | ホロリスの推し活サポート" />
        <meta property="og:description" content="月別の生活スケジュールを管理。1ヶ月の予定を一覧で確認し、推し活と日常生活を効率的に計画できます。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/life/life-schedule-month" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/life/life-schedule-month" />
      </Helmet>
      <LifeScheduleMonthPresenter
        state={state}
        actions={actions}
      />
    </>
  );
};

export default LifeScheduleMonthContainer;
