import { useEffect, Dispatch, SetStateAction } from 'react';
import { useOshiKatsuSaportApi } from './useOshiKatsuSaportApi';
import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';
import { HomeLimitedTimeTopic } from 'hooks/api/home/useHomeLimitedTimeTopicGetApi';

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

/**
 * 推し活サポートホーム画面 State Hooks
 */
export const useOshiKatsuSaportState = (
  state: OshiKatsuSaportState,
  setState: Dispatch<SetStateAction<OshiKatsuSaportState>>
) => {
  const api = useOshiKatsuSaportApi();

  // 初期データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: true }
        }));

        // 並列でAPIを呼び出し
        const [featuresResult, changeLogsResult, limitedTimeTopicResult] = await Promise.all([
          api.executeHomeFeaturesGet(),
          api.executeHomeChangeLogsGet(),
          api.executeHomeLimitedTimeTopicGet(),
        ]);

        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            features: featuresResult.data?.features ?? [],
            changeLogs: changeLogsResult.data?.changeLogs ?? [],
            limitedTimeTopic: limitedTimeTopicResult.data?.limitedTimeTopic ?? null,
          }
        }));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false }
        }));
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    actions: {}
  };
};
