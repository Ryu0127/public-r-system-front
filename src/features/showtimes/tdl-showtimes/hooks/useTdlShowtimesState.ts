import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useAttractionWaitForecastsGetApi } from 'hooks/api/showtimes/useAttractionWaitForecastsGetApi';
import { useAttractionsGetApi } from 'hooks/api/showtimes/useAttractionsGetApi';
import { useShowParadesGetApi } from 'hooks/api/showtimes/useShowParadesGetApi';
import { useTdlShowtimesGetApi } from 'hooks/api/showtimes/useTdlShowtimesGetApi';
import { CrowdAreaFilter, CrowdRankFilter, FoodCategoryFilter, ShowtimesTab } from '../types';
import {
  TdlShowtimesActions,
  TdlShowtimesState,
  findCrowdSlotIndexForNow,
} from './showtimesUtils';
import { mergeAttractionsWithMock } from '../utils/mapAttraction';
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
 * - アトラクション名寄せ・所要時間・サムネ・ランク: DB（/showtimes/attractions）
 * - 混雑 wait: DB（/showtimes/attraction-wait-forecasts）、なければモック
 * - pass / icon / フード等: 当面モック（/showtimes/tdl）
 */
export const useTdlShowtimesState = (
  state: TdlShowtimesState,
  setState: Dispatch<SetStateAction<TdlShowtimesState>>
): { actions: TdlShowtimesActions } => {
  const { executeTdlShowtimesGet } = useTdlShowtimesGetApi();
  const { executeShowParadesGet } = useShowParadesGetApi();
  const { executeAttractionsGet } = useAttractionsGetApi();
  const { executeAttractionWaitForecastsGet } = useAttractionWaitForecastsGetApi();

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true, error: null },
    }));

    const date = state.data.date;
    const [tdlResult, showParadesResult, attractionsResult, waitForecastsResult] =
      await Promise.all([
        executeTdlShowtimesGet(date),
        executeShowParadesGet(PARK_TYPE_LAND, date),
        executeAttractionsGet(PARK_TYPE_LAND, date),
        executeAttractionWaitForecastsGet(PARK_TYPE_LAND, date),
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

    if (
      attractionsResult.error ||
      !attractionsResult.apiResponse?.status ||
      !attractionsResult.apiResponse.data
    ) {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
          error: 'アトラクションデータの取得に失敗しました',
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

    const mockCrowd = tdlResult.apiResponse.data.crowd;
    const waitForecastData =
      !waitForecastsResult.error &&
      waitForecastsResult.apiResponse?.status &&
      waitForecastsResult.apiResponse.data
        ? waitForecastsResult.apiResponse.data
        : null;
    const dbSlots = waitForecastData?.slots ?? [];
    const waitsByAttractionId = waitForecastData?.waitsByAttractionId ?? {};
    const hasDbWaits = Object.keys(waitsByAttractionId).length > 0;

    const attractions = mergeAttractionsWithMock(
      attractionsResult.apiResponse.data.attractions,
      mockCrowd.attractions ?? [],
      hasDbWaits ? waitsByAttractionId : undefined
    );

    const showtimes = {
      ...tdlResult.apiResponse.data,
      shows,
      timeline,
      stoppedPrograms,
      crowd: {
        ...mockCrowd,
        slots: dbSlots.length > 0 ? dbSlots : mockCrowd.slots,
        attractions,
      },
    };

    const enabledShows: Record<string, boolean> = {};
    shows.forEach((show) => {
      enabledShows[show.id] = true;
    });

    const crowdSlotIndex = findCrowdSlotIndexForNow(showtimes.crowd.slots);

    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        isLoading: false,
        error: null,
        enabledShows,
        crowdSlotIndex,
      },
      data: {
        ...prev.data,
        showtimes,
      },
    }));
  }, [
    executeAttractionWaitForecastsGet,
    executeAttractionsGet,
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

  const setCrowdAreaFilter = useCallback(
    (area: CrowdAreaFilter) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, crowdAreaFilter: area },
      }));
    },
    [setState]
  );

  const setCrowdRankFilter = useCallback(
    (rank: CrowdRankFilter) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, crowdRankFilter: rank },
      }));
    },
    [setState]
  );

  const setFoodCategoryFilter = useCallback(
    (category: FoodCategoryFilter) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, foodCategoryFilter: category },
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
      setCrowdAreaFilter,
      setCrowdRankFilter,
      setFoodCategoryFilter,
    }),
    [
      loadData,
      setActiveTab,
      toggleShow,
      setCrowdSlotIndex,
      setCrowdAreaFilter,
      setCrowdRankFilter,
      setFoodCategoryFilter,
    ]
  );

  return { actions };
};
