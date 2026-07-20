import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TdlShowtimesPresenter from '../presenters/TdlShowtimesPresenter';
import {
  TdlShowtimesState,
  useTdlShowtimesState,
} from '../hooks/useTdlShowtimesState';
import { emptyFavorites } from '../hooks/showtimesUtils';

const DEFAULT_DATE = '2026-07-21';

const initialState: TdlShowtimesState = {
  config: {
    isLoading: true,
    error: null,
    activeTab: 'shows',
    enabledShows: {},
    crowdSlotIndex: 0,
    crowdAreaFilter: 'all',
    crowdRankFilter: 'all',
    foodAreaFilter: 'all',
    favorites: emptyFavorites(),
    favoritePendingIds: {},
  },
  data: {
    date: DEFAULT_DATE,
    showtimes: null,
  },
};

/**
 * TDL ショー&パレード / 混雑 Container
 */
const TdlShowtimesContainer: React.FC = () => {
  const [state, setState] = useState<TdlShowtimesState>(initialState);
  const { actions } = useTdlShowtimesState(state, setState);

  useEffect(() => {
    actions.loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const park = state.data.showtimes?.park;
  const title = park
    ? `TDL ショー&パレード タイムライン｜${park.date.replace(/-/g, '.')}（${park.dayOfWeek}）`
    : 'TDL ショー&パレード タイムライン';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Kanit:ital,wght@0,600;1,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <TdlShowtimesPresenter state={state} actions={actions} />
    </>
  );
};

export default TdlShowtimesContainer;
