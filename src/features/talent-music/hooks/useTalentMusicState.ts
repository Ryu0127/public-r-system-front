import { useCallback, useRef, Dispatch, SetStateAction } from 'react';
import { Music, MusicTalent, MusicFilterType } from '../types';
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

    const talents =
      talentsRes.apiResponse?.status === true
        ? talentsRes.apiResponse.data.talents.map(talentToMusicTalent)
        : [];

    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: false },
      data: {
        ...prev.data,
        talents,
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
      setIsDropdownOpen,
      setTalentSearchQuery,
      setActiveFilter,
    },
  };
};
