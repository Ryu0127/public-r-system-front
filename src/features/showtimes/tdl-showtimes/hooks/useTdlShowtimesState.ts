import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useAttractionWaitForecastsGetApi } from 'hooks/api/showtimes/useAttractionWaitForecastsGetApi';
import { useAttractionsGetApi } from 'hooks/api/showtimes/useAttractionsGetApi';
import { useFoodMenusGetApi } from 'hooks/api/showtimes/useFoodMenusGetApi';
import { useShowParadesGetApi } from 'hooks/api/showtimes/useShowParadesGetApi';
import { useTdlShowtimesGetApi } from 'hooks/api/showtimes/useTdlShowtimesGetApi';
import { CrowdAreaFilter, CrowdRankFilter, FoodAreaFilter, ShowtimesTab } from '../types';
import {
  TdlShowtimesActions,
  TdlShowtimesState,
  findCrowdSlotIndexForNow,
} from './showtimesUtils';
import { mapAttractionsFromDb } from '../utils/mapAttraction';
import { mapFoodMenusToFoodData } from '../utils/mapFoodMenu';
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
 * - 混雑 wait / slots: DB（/showtimes/attraction-wait-forecasts）のみ。無ければ「-」
 * - フードメニュー: DB（/showtimes/food-menus）
 * - park 等: 当面モック（/showtimes/tdl）
 */
export const useTdlShowtimesState = (
  state: TdlShowtimesState,
  setState: Dispatch<SetStateAction<TdlShowtimesState>>
): { actions: TdlShowtimesActions } => {
  const { executeTdlShowtimesGet } = useTdlShowtimesGetApi();
  const { executeShowParadesGet } = useShowParadesGetApi();
  const { executeAttractionsGet } = useAttractionsGetApi();
  const { executeAttractionWaitForecastsGet } = useAttractionWaitForecastsGetApi();
  const { executeFoodMenusGet } = useFoodMenusGetApi();

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true, error: null },
    }));

    const date = state.data.date;
    const [
      tdlResult,
      showParadesResult,
      attractionsResult,
      waitForecastsResult,
      foodMenusResult,
    ] = await Promise.all([
      executeTdlShowtimesGet(date),
      executeShowParadesGet(PARK_TYPE_LAND, date),
      executeAttractionsGet(PARK_TYPE_LAND, date),
      executeAttractionWaitForecastsGet(PARK_TYPE_LAND, date),
      executeFoodMenusGet(PARK_TYPE_LAND, date),
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

    if (
      foodMenusResult.error ||
      !foodMenusResult.apiResponse?.status ||
      !foodMenusResult.apiResponse.data
    ) {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
          error: 'フードメニューデータの取得に失敗しました',
        },
      }));
      return;
    }

    const showParades = showParadesResult.apiResponse.data.showParades;
    const activeShowParades = showParades.filter((item) => item.pauseFlag !== 1);
    const shows = activeShowParades.map(mapShowParadeToShowItem);
    const timeline = buildTimelineFromShowParades(showParades);
    const excludedPrograms = mapPausedShowsToProgramNotes(showParades);

    const waitForecastData =
      !waitForecastsResult.error &&
      waitForecastsResult.apiResponse?.status &&
      waitForecastsResult.apiResponse.data
        ? waitForecastsResult.apiResponse.data
        : null;
    const dbSlots = waitForecastData?.slots ?? [];
    const waitsByAttractionId = waitForecastData?.waitsByAttractionId ?? {};

    const attractions = mapAttractionsFromDb(
      attractionsResult.apiResponse.data.attractions,
      waitsByAttractionId
    );

    const food = mapFoodMenusToFoodData(
      foodMenusResult.apiResponse.data.foodMenus
    );

    const showtimes = {
      ...tdlResult.apiResponse.data,
      shows,
      timeline,
      excludedPrograms,
      stoppedPrograms: [],
      crowd: {
        slots: dbSlots,
        attractions,
      },
      food,
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
    executeFoodMenusGet,
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

  const setFoodAreaFilter = useCallback(
    (area: FoodAreaFilter) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, foodAreaFilter: area },
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
      setFoodAreaFilter,
    }),
    [
      loadData,
      setActiveTab,
      toggleShow,
      setCrowdSlotIndex,
      setCrowdAreaFilter,
      setCrowdRankFilter,
      setFoodAreaFilter,
    ]
  );

  return { actions };
};
