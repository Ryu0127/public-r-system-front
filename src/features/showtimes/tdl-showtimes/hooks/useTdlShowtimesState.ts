import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTdlShowtimesGetApi } from 'hooks/api/showtimes/useTdlShowtimesGetApi';
import { CrowdSort, ShowtimesTab } from '../types';
import { TdlShowtimesActions, TdlShowtimesState } from './showtimesUtils';

export type { TdlShowtimesActions, TdlShowtimesState } from './showtimesUtils';

/**
 * TDL ショーパレ画面の状態管理
 */
export const useTdlShowtimesState = (
  state: TdlShowtimesState,
  setState: Dispatch<SetStateAction<TdlShowtimesState>>
): { actions: TdlShowtimesActions } => {
  const { executeTdlShowtimesGet } = useTdlShowtimesGetApi();

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true, error: null },
    }));

    const { apiResponse, error } = await executeTdlShowtimesGet(state.data.date);

    if (error || !apiResponse?.status || !apiResponse.data) {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
          error: 'データの取得に失敗しました',
        },
      }));
      return;
    }

    const enabledShows: Record<string, boolean> = {};
    apiResponse.data.shows.forEach((show) => {
      enabledShows[show.id] = true;
    });

    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        isLoading: false,
        error: null,
        enabledShows,
      },
      data: {
        ...prev.data,
        showtimes: apiResponse.data,
      },
    }));
  }, [executeTdlShowtimesGet, setState, state.data.date]);

  const setActiveTab = useCallback(
    (tab: ShowtimesTab) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, activeTab: tab },
      }));
    },
    [setState]
  );

  const toggleShow = useCallback(
    (showId: string) => {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          enabledShows: {
            ...prev.config.enabledShows,
            [showId]: !prev.config.enabledShows[showId],
          },
        },
      }));
    },
    [setState]
  );

  const setCrowdSlotIndex = useCallback(
    (index: number) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, crowdSlotIndex: index },
      }));
    },
    [setState]
  );

  const setCrowdSort = useCallback(
    (sort: CrowdSort) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, crowdSort: sort },
      }));
    },
    [setState]
  );

  const actions = useMemo(
    () => ({
      loadData,
      setActiveTab,
      toggleShow,
      setCrowdSlotIndex,
      setCrowdSort,
    }),
    [loadData, setActiveTab, toggleShow, setCrowdSlotIndex, setCrowdSort]
  );

  return { actions };
};
