import React, { useState, useEffect } from 'react';
import useTitle from 'utils/useTitle';
import { LifeScheduleMonthState, useLifeScheduleMonthState } from '../hooks/useLifeScheduleMonthState';
import LifeScheduleMonthPresenter from '../presenters/LifeScheduleMonthPresenter';

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

  // 初期値設定
  const [state, setState] = useState<LifeScheduleMonthState>(() => {
    const today = new Date();
    today.setDate(1); // 月の1日に設定
    today.setHours(0, 0, 0, 0);
    return {
      ...initialState,
      requestParams: {
        currentMonth: today,
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
