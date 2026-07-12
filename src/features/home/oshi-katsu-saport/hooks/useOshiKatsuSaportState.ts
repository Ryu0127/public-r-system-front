import { useCallback, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useOshiKatsuSaportApi } from './useOshiKatsuSaportApi';
import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';
import { HomeLimitedTimeTopic } from 'hooks/api/home/useHomeLimitedTimeTopicGetApi';
import { Talent, TalentsApiResponse } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import { Music } from 'features/talent-music/types';
import { loadTalentSelection, saveTalentSelection } from 'utils/talentSelectionStorage';
import { HOME_FEATURES, HOME_CHANGE_LOGS } from '../data/homeData';

/** Talentエリアで表示するグループ */
export interface HomeTalentGroup {
  groupId: number;
  groupName: string;
  talents: Talent[];
}

/**
 * タレント一覧APIのレスポンスから Talentエリア用のグループ一覧を組み立てる
 * （data.groups を優先し、無い場合はフラット一覧を groupId ごとにまとめる）
 */
const buildTalentGroups = (
  apiData: TalentsApiResponse['data'] | undefined
): HomeTalentGroup[] => {
  const groups = apiData?.groups ?? [];
  if (groups.length > 0) {
    return groups
      .filter((group) => group.talents.length > 0)
      .map((group) => ({
        groupId: group.groupId,
        groupName: group.groupName,
        talents: group.talents.map((talent) => ({
          id: String(talent.id),
          talentName: talent.talentName,
          talentNameEn: talent.talentNameEn,
          talentSlug: talent.talentSlug,
          iconImgUrl: talent.iconImgUrl,
          groupId: group.groupId,
          groupName: group.groupName,
          twitterAccounts: [],
        })),
      }));
  }

  // フォールバック: フラット一覧を groupId ごとにまとめる
  const map = new Map<number, HomeTalentGroup>();
  for (const talent of apiData?.talents ?? []) {
    let group = map.get(talent.groupId);
    if (!group) {
      group = {
        groupId: talent.groupId,
        groupName: talent.groupName || 'その他',
        talents: [],
      };
      map.set(talent.groupId, group);
    }
    group.talents.push(talent);
  }
  return Array.from(map.values());
};

export interface OshiKatsuSaportState {
  config: {
    isLoading: boolean;
  };
  data: {
    features: HomeFeature[];
    changeLogs: HomeChangeLog[];
    limitedTimeTopic: HomeLimitedTimeTopic | null;
    /** 楽曲ショーケース用の先頭数件 */
    musicList: Music[];
    /** Talentエリア用のグループ別タレント一覧 */
    talentGroups: HomeTalentGroup[];
    /** 選択中タレント（タレント選択モード） */
    selectedTalent: Talent | null;
    /** Talentエリアで表示中のグループID */
    selectedGroupId: number | null;
  };
}

export interface OshiKatsuSaportActions {
  // データ取得アクション
  fetchHomeData: () => void;
  // タレント選択
  selectTalent: (talent: Talent) => void;
  clearTalentSelection: () => void;
  selectGroup: (groupId: number) => void;
}

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
  // 楽曲取得の競合防止（後勝ち）
  const musicFetchSeqRef = useRef(0);

  /**
   * 楽曲ショーケースの取得（talentSlug 指定時はそのタレントの楽曲）
   */
  const fetchShowcaseMusic = useCallback(async (talentSlug?: string) => {
    const seq = ++musicFetchSeqRef.current;
    const musicResult = await api.executeHomeMusicGet(talentSlug);
    if (seq !== musicFetchSeqRef.current) return;
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        musicList: musicResult.data?.musicList ?? [],
      },
    }));
  }, [api, setState]);

  // アクション実装
  const actions: OshiKatsuSaportActions = {
    /**
     * ホームデータ取得
     */
    fetchHomeData: useCallback(async () => {
      try {
        // ローディング開始
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: true },
        }));

        // 期間限定トピックとタレント一覧を並列取得
        const [limitedTimeTopicResult, talentsResult] = await Promise.all([
          api.executeHomeLimitedTimeTopicGet(),
          api.executeTalentsGet(),
        ]);

        const talentGroups = buildTalentGroups(talentsResult.data);
        const allTalents = talentGroups.flatMap(group => group.talents);

        // 前回のタレント/グループ選択を復元（他画面での選択も共有）
        const stored = loadTalentSelection();
        const selectedTalent = stored.talentSlug
          ? allTalents.find(t => (t.talentSlug ?? '') === stored.talentSlug) ?? null
          : null;
        const selectedGroupId =
          stored.groupId ?? selectedTalent?.groupId ?? null;

        // 楽曲ショーケース取得（選択タレントがあればそのタレントの楽曲）
        const seq = ++musicFetchSeqRef.current;
        const musicResult = await api.executeHomeMusicGet(
          selectedTalent?.talentSlug ?? undefined
        );

        // 静的データを使用
        const features = HOME_FEATURES;
        const changeLogs = HOME_CHANGE_LOGS;

        // データ更新
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            ...prev.data,
            features,
            changeLogs,
            limitedTimeTopic:
              limitedTimeTopicResult.data?.limitedTimeTopic ?? null,
            musicList:
              seq === musicFetchSeqRef.current
                ? musicResult.data?.musicList ?? []
                : prev.data.musicList,
            talentGroups,
            selectedTalent,
            selectedGroupId,
          },
        }));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        // エラー時もローディングを終了
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
        }));
      }
    }, [api, setState]),

    /**
     * タレント選択（楽曲ショーケースも選択タレントのものに切り替え）
     */
    selectTalent: useCallback((talent: Talent) => {
      saveTalentSelection({
        talentSlug: talent.talentSlug ?? null,
        groupId: talent.groupId,
      });
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          selectedTalent: talent,
          selectedGroupId: talent.groupId,
        },
      }));
      void fetchShowcaseMusic(talent.talentSlug ?? undefined);
    }, [setState, fetchShowcaseMusic]),

    /**
     * タレント選択の解除（楽曲ショーケースを全体表示に戻す）
     */
    clearTalentSelection: useCallback(() => {
      saveTalentSelection({
        talentSlug: null,
        groupId: state.data.selectedGroupId,
      });
      setState(prev => ({
        ...prev,
        data: { ...prev.data, selectedTalent: null },
      }));
      void fetchShowcaseMusic();
    }, [setState, fetchShowcaseMusic, state.data.selectedGroupId]),

    /**
     * Talentエリアの表示グループ切り替え
     */
    selectGroup: useCallback((groupId: number) => {
      saveTalentSelection({
        talentSlug: state.data.selectedTalent?.talentSlug ?? null,
        groupId,
      });
      setState(prev => ({
        ...prev,
        data: { ...prev.data, selectedGroupId: groupId },
      }));
    }, [setState, state.data.selectedTalent]),
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
