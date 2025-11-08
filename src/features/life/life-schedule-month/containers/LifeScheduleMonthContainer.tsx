import React, { useState, useEffect } from 'react';
import useTitle from 'utils/useTitle';
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
  useTitle('月次スケジュール');

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

  // 月が変更されたらデータを再取得
  useEffect(() => {
    actions.fetchMonthData(state.requestParams.currentMonth);
  }, [state.requestParams.currentMonth]);

  return <LifeScheduleMonthPresenter state={state} actions={actions} />;
};

export default LifeScheduleMonthContainer;
