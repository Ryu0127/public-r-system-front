import { useCallback, Dispatch, SetStateAction } from 'react';
import { Music, MusicTalent, MusicFilterType } from '../types';
import { useTalentMusicGetApi } from 'hooks/api/talent-music/useTalentMusicGetApi';

export interface TalentMusicState {
  config: {
    isLoading: boolean;
    isDropdownOpen: boolean;
    activeFilter: MusicFilterType;
  };
  data: {
    talents: MusicTalent[];
    musicList: Music[];
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
  const { executeTalentMusicGet } = useTalentMusicGetApi();

  const loadData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isLoading: true },
    }));

    const { apiResponse } = await executeTalentMusicGet();

    if (apiResponse?.status) {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: false },
        data: {
          ...prev.data,
          talents: apiResponse.data.talents,
          musicList: apiResponse.data.musicList,
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: false },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTalent = useCallback(
    (talent: MusicTalent) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isDropdownOpen: false },
        data: { ...prev.data, selectedTalent: talent },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));
    },
    [setState]
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
