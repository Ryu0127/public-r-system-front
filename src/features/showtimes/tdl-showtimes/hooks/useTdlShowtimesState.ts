import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useShowParadesGetApi } from 'hooks/api/showtimes/useShowParadesGetApi';
import { useTdlShowtimesGetApi } from 'hooks/api/showtimes/useTdlShowtimesGetApi';
import { CrowdSort, ShowtimesTab } from '../types';
import { TdlShowtimesActions, TdlShowtimesState } from './showtimesUtils';
import {
  PARK_TYPE_LAND,
  buildTimelineFromShowParades,
  mapPausedShowsToProgramNotes,
  mapShowParadeToShowItem,
} from '../utils/mapShowParade';

export type { TdlShowtimesActions, TdlShowtimesState } from './showtimesUtils';

/**
 * TDL ショーパレ画面の状態管理
 * - ショーパレ一覧・タイムライン: DB（/showtimes/show-parades）
 * - 混雑など: 当面モック（/showtimes/tdl）
 */
export const useTdlShowtimesState = (
  state: TdlShowtimesState,
  setState: Dispatch<SetStateAction<TdlShowtimesState>>
): { actions: TdlShowtimesActions } => {
  const { executeTdlShowtimesGet } = useTdlShowtimesGetApi();
  const { executeShowParadesGet } = useShowParadesGetApi();

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true, error: null },
    }));

    const date = state.data.date;
    const [tdlResult, showParadesResult] = await Promise.all([
      executeTdlShowtimesGet(date),
      executeShowParadesGet(PARK_TYPE_LAND, date),
    ]);

    if (
      tdlResult.error ||
      !tdlResult.apiResponse?.status ||
      !tdlResult.apiResponse.data
    ) {
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

    if (
      showParadesResult.error ||
      !showParadesResult.apiResponse?.status ||
      !showParadesResult.apiResponse.data
    ) {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
          error: 'ショーパレデータの取得に失敗しました',
        },
      }));
      return;
    }

    const showParades = showParadesResult.apiResponse.data.showParades;
    const activeShowParades = showParades.filter((item) => item.pauseFlag !== 1);
    const shows = activeShowParades.map(mapShowParadeToShowItem);
    const timeline = buildTimelineFromShowParades(showParades);
    const pausedNotes = mapPausedShowsToProgramNotes(showParades);

    const mockStopped = tdlResult.apiResponse.data.stoppedPrograms ?? [];
    const stoppedNames = new Set(pausedNotes.map((n) => n.name));
    const stoppedPrograms = [
      ...pausedNotes,
      ...mockStopped.filter((n) => !stoppedNames.has(n.name)),
    ];

    const showtimes = {
      ...tdlResult.apiResponse.data,
      shows,
      timeline,
      stoppedPrograms,
    };

    const enabledShows: Record<string, boolean> = {};
    shows.forEach((show) => {
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
        showtimes,
      },
    }));
  }, [
    executeShowParadesGet,
    executeTdlShowtimesGet,
    setState,
    state.data.date,
  ]);

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
