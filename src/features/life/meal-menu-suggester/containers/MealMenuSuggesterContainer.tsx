import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MealMenuSuggesterState } from '../types';
import { useMealMenuSuggesterState, generateWeekMenus } from '../hooks/useMealMenuSuggesterState';
import MealMenuSuggesterPresenter from '../presenters/MealMenuSuggesterPresenter';

const getMonday = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const getTodayIndex = (startDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(6, diff));
};

const initialState: MealMenuSuggesterState = (() => {
  const monday = getMonday();
  const weekMenus = generateWeekMenus(monday);
  return {
    config: {
      sidebarVisible: false,
      selectedDayIndex: getTodayIndex(monday),
      isShuffling: null,
    },
    data: {
      weekMenus,
    },
  };
})();

const MealMenuSuggesterContainer: React.FC = () => {
  const [state, setState] = useState<MealMenuSuggesterState>(initialState);
  const { actions } = useMealMenuSuggesterState(state, setState);

  return (
    <>
      <Helmet>
        <title>献立メニュー | ホロリスの推し活サポート</title>
        <meta name="description" content="一人暮らしの毎日の食事メニューを提案。一週間分の朝食・昼食・夕食をイタリアンスタイルのメニュー表でご提案します。" />
        <meta property="og:title" content="献立メニュー | ホロリスの推し活サポート" />
        <meta property="og:description" content="一人暮らしの毎日の食事メニューを提案。一週間分の朝食・昼食・夕食をイタリアンスタイルのメニュー表でご提案します。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/life/meal-menu" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/life/meal-menu" />
      </Helmet>
      <MealMenuSuggesterPresenter
        state={state}
        actions={actions}
      />
    </>
  );
};

export default MealMenuSuggesterContainer;
