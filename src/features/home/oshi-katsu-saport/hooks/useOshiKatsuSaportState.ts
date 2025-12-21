import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useOshiKatsuSaportApi } from './useOshiKatsuSaportApi';
import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';
import { HomeLimitedTimeTopic } from 'hooks/api/home/useHomeLimitedTimeTopicGetApi';
import { HOME_FEATURES, HOME_CHANGE_LOGS } from '../data/homeData';

export interface OshiKatsuSaportState {
  config: {
    isLoading: boolean;
  };
  data: {
    features: HomeFeature[];
    changeLogs: HomeChangeLog[];
    limitedTimeTopic: HomeLimitedTimeTopic | null;
  };
}

export interface OshiKatsuSaportActions {
  // データ取得アクション
  fetchHomeData: () => void;
}

/**
 * 状態管理値のグループ更新
 */
const updateStateGroup = {
  /**
   * ローディング状態の更新
   */
  toLoading: (
    setState: Dispatch<SetStateAction<OshiKatsuSaportState>>,
    isLoading: boolean
  ) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        isLoading: isLoading,
      },
    }));
  },
};

/**
 * 状態管理値の更新
 */
const updateState = {
  /**
   * データの更新
   */
  toData: (
    prev: OshiKatsuSaportState,
    features: HomeFeature[],
    changeLogs: HomeChangeLog[],
    limitedTimeTopic: HomeLimitedTimeTopic | null
  ) => ({
    data: {
      features: features,
      changeLogs: changeLogs,
      limitedTimeTopic: limitedTimeTopic,
    },
  }),

  /**
   * ローディング状態の更新
   */
  toLoading: (prev: OshiKatsuSaportState, isLoading: boolean) => ({
    config: {
      ...prev.config,
      isLoading: isLoading,
    },
  }),
};

/**
 * 推し活サポートホーム画面 State Hooks
 *
 * @param state 状態
 * @param setState 状態更新関数
 * @returns アクション
 */
export const useOshiKatsuSaportState = (
  state: OshiKatsuSaportState,
  setState: Dispatch<SetStateAction<OshiKatsuSaportState>>
): {
  actions: OshiKatsuSaportActions;
} => {
  // API Hooks
  const api = useOshiKatsuSaportApi();

  // アクション実装
  const actions: OshiKatsuSaportActions = {
    /**
     * ホームデータ取得
     */
    fetchHomeData: useCallback(async () => {
      try {
        // ローディング開始
        updateStateGroup.toLoading(setState, true);

        // 期間限定トピックのみAPIから取得
        const limitedTimeTopicResult = await api.executeHomeLimitedTimeTopicGet();

        // 静的データを使用
        const features = HOME_FEATURES;
        const changeLogs = HOME_CHANGE_LOGS;

        // データ更新
        setState(prev => ({
          ...prev,
          ...updateState.toLoading(prev, false),
          ...updateState.toData(
            prev,
            features,
            changeLogs,
            limitedTimeTopicResult.data?.limitedTimeTopic ?? null
          ),
        }));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        // エラー時もローディングを終了
        updateStateGroup.toLoading(setState, false);
      }
    }, [api, setState]),
  };

  /**
   * 初期データ取得
   */
  useEffect(() => {
    actions.fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { actions };
};
