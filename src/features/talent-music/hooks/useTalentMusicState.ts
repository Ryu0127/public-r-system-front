import { useCallback, useRef, Dispatch, SetStateAction } from 'react';
import { Music, MusicTalent, MusicTalentGroup, MusicFilterType } from '../types';
import { talentToMusicTalent } from '../utils/talentToMusicTalent';
import { useTalentMusicGetApi } from 'hooks/api/talent-music/useTalentMusicGetApi';
import { useTalentsGetApi } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

export interface TalentMusicState {
  config: {
    isLoading: boolean;
    /** タレント選択後の楽曲一覧取得中 */
    isMusicLoading: boolean;
    isDropdownOpen: boolean;
    activeFilter: MusicFilterType;
  };
  data: {
    talents: MusicTalent[];
    /** API の data.groups を変換したグループ一覧（モーダルのグループ別表示に使用） */
    groups: MusicTalentGroup[];
    /** 選択タレントの楽曲（将来は複数タレント選択時も同一配列にマージ） */
    musicList: Music[];
    /** 現状は単一選択のみ（複数選択は将来拡張） */
    selectedTalent: MusicTalent | null;
  };
  ui: {
    talentSearchQuery: string;
  };
}

export interface TalentMusicActions {
  loadData: () => void;
  selectTalent: (talent: MusicTalent) => void;
  selectGroup: (group: MusicTalentGroup) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  setTalentSearchQuery: (query: string) => void;
  setActiveFilter: (filter: MusicFilterType) => void;
}

export const useTalentMusicState = (
  state: TalentMusicState,
  setState: Dispatch<SetStateAction<TalentMusicState>>
): { actions: TalentMusicActions } => {
  const { executeTalentMusicGetByTalentSlug } = useTalentMusicGetApi();
  const { executeTalentsGet } = useTalentsGetApi();
  /** 楽曲取得の非同期競合で古いレスポンスが上書きしないようにする */
  const musicFetchSeqRef = useRef(0);

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true },
    }));

    const talentsRes = await executeTalentsGet();
    const apiData = talentsRes.apiResponse?.data;

    const talents =
      apiData?.talents != null
        ? apiData.talents.map(talentToMusicTalent)
        : [];

    // API の groups を MusicTalentGroup に変換
    // グループ内タレントには親グループの groupId / groupName を注入する
    const groups: MusicTalentGroup[] =
      apiData?.groups != null
        ? apiData.groups.map((g) => ({
            groupId: g.groupId,
            groupName: g.groupName,
            talents: g.talents.map((t) => {
              const ja = t.talentName ?? '';
              const en = t.talentNameEn ?? '';
              return {
                id: String(t.id ?? ''),
                talentName: ja,
                talentNameEn: en,
                talentSlug: t.talentSlug,
                talentNameJoin: ja && en ? `${ja}（${en}）` : ja || en,
                groupId: g.groupId,
                groupName: g.groupName,
                iconImgUrl: t.iconImgUrl ?? undefined,
              };
            }),
          }))
        : [];

    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: false },
      data: {
        ...prev.data,
        talents,
        groups,
        musicList: [],
        selectedTalent: null,
      },
    }));
  }, [setState, executeTalentsGet]);

  const selectTalent = useCallback(
    async (talent: MusicTalent) => {
      const seq = ++musicFetchSeqRef.current;
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isDropdownOpen: false,
          isMusicLoading: true,
          activeFilter: 'all',
        },
        data: { ...prev.data, selectedTalent: talent, musicList: [] },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));

      try {
        const slug = String(talent.talentSlug ?? '').trim();
        const musicRes = await executeTalentMusicGetByTalentSlug(slug);
        if (seq !== musicFetchSeqRef.current) {
          return;
        }
        const musicList =
          musicRes.apiResponse?.status === true ? musicRes.apiResponse.data.musicList : [];

        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isMusicLoading: false },
          data: { ...prev.data, musicList },
        }));
      } catch {
        if (seq !== musicFetchSeqRef.current) {
          return;
        }
        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isMusicLoading: false },
        }));
      }
    },
    [setState, executeTalentMusicGetByTalentSlug]
  );

  const setIsDropdownOpen = useCallback(
    (isOpen: boolean) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isDropdownOpen: isOpen },
      }));
    },
    [setState]
  );

  const setTalentSearchQuery = useCallback(
    (query: string) => {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, talentSearchQuery: query },
      }));
    },
    [setState]
  );

  const setActiveFilter = useCallback(
    (filter: MusicFilterType) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, activeFilter: filter },
      }));
    },
    [setState]
  );

  return {
    actions: {
      loadData,
      selectTalent,
      /** URL更新はコンテナ側で担うため、フック内では何もしない */
      selectGroup: (_group: MusicTalentGroup) => {},
      setIsDropdownOpen,
      setTalentSearchQuery,
      setActiveFilter,
    },
  };
};
