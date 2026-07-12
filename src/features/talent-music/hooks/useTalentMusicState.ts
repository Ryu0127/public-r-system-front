import { useCallback, useRef, Dispatch, SetStateAction } from 'react';
import { Music, MusicTalent, MusicTalentGroup, MusicFilterType, TalentMusicPagination } from '../types';
import { talentToMusicTalent } from '../utils/talentToMusicTalent';
import { toGroupSlug } from '../utils/toGroupSlug';
import {
  TALENT_MUSIC_DEFAULT_PER_PAGE,
  useTalentMusicGetApi,
} from 'hooks/api/talent-music/useTalentMusicGetApi';
import { useTalentsGetApi } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

export interface TalentMusicState {
  config: {
    isLoading: boolean;
    isMusicLoading: boolean;
    isMusicLoadingMore: boolean;
    isDropdownOpen: boolean;
    activeFilter: MusicFilterType;
    hasMoreMusic: boolean;
  };
  data: {
    talents: MusicTalent[];
    groups: MusicTalentGroup[];
    musicList: Music[];
    musicPagination: TalentMusicPagination | null;
    selectedTalent: MusicTalent | null;
    /** グループ選択時にセット。タレント選択時はクリアされる */
    selectedGroup: MusicTalentGroup | null;
  };
  ui: {
    talentSearchQuery: string;
  };
}

export interface TalentMusicActions {
  loadData: () => void;
  loadInitialMusic: () => void;
  clearSelection: () => void;
  selectTalent: (talent: MusicTalent) => void;
  selectGroup: (group: MusicTalentGroup) => void;
  loadMoreMusic: () => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  setTalentSearchQuery: (query: string) => void;
  setActiveFilter: (filter: MusicFilterType) => void;
}

const emptyPagination = (page = 1): TalentMusicPagination => ({
  total: 0,
  perPage: TALENT_MUSIC_DEFAULT_PER_PAGE,
  currentPage: page,
  lastPage: 1,
  from: null,
  to: null,
});

export const useTalentMusicState = (
  state: TalentMusicState,
  setState: Dispatch<SetStateAction<TalentMusicState>>
): { actions: TalentMusicActions } => {
  const { executeTalentMusicGetByParams } = useTalentMusicGetApi();
  const { executeTalentsGet } = useTalentsGetApi();
  const musicFetchSeqRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const fetchMusicPage = useCallback(
    async (options: {
      talentSlug?: string;
      groupSlug?: string;
      page: number;
      append: boolean;
      seq: number;
    }) => {
      const { talentSlug, groupSlug, page, append, seq } = options;

      try {
        const musicRes = await executeTalentMusicGetByParams({
          talentSlug,
          groupSlug,
          page,
          perPage: TALENT_MUSIC_DEFAULT_PER_PAGE,
        });
        if (seq !== musicFetchSeqRef.current) return;

        if (musicRes.apiResponse?.status !== true) {
          setState((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              isMusicLoading: false,
              isMusicLoadingMore: false,
              hasMoreMusic: false,
            },
          }));
          return;
        }

        const nextList = musicRes.apiResponse.data.musicList;
        const pagination = musicRes.apiResponse.data.pagination;
        const hasMore = pagination.currentPage < pagination.lastPage;

        setState((prev) => {
          const mergedList = append
            ? mergeUniqueMusic(prev.data.musicList, nextList)
            : nextList;
          return {
            ...prev,
            config: {
              ...prev.config,
              isMusicLoading: false,
              isMusicLoadingMore: false,
              hasMoreMusic: hasMore,
            },
            data: {
              ...prev.data,
              musicList: mergedList,
              musicPagination: pagination,
            },
          };
        });
      } catch {
        if (seq !== musicFetchSeqRef.current) return;
        setState((prev) => ({
          ...prev,
          config: {
            ...prev.config,
            isMusicLoading: false,
            isMusicLoadingMore: false,
          },
        }));
      }
    },
    [setState, executeTalentMusicGetByParams]
  );

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

    const groups: MusicTalentGroup[] =
      apiData?.groups != null
        ? apiData.groups.map((g) => ({
            groupId: g.groupId,
            groupName: g.groupName,
            groupNameEn: g.groupNameEn,
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

    const seq = ++musicFetchSeqRef.current;
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        isLoading: false,
        isMusicLoading: true,
        isMusicLoadingMore: false,
        hasMoreMusic: false,
        activeFilter: 'all',
      },
      data: {
        ...prev.data,
        talents,
        groups,
        musicList: [],
        musicPagination: null,
        selectedTalent: null,
        selectedGroup: null,
      },
    }));

    // URL に talent/group がある場合は Container 側の select が seq を更新してこちらをキャンセルする
    await fetchMusicPage({ page: 1, append: false, seq });
  }, [setState, executeTalentsGet, fetchMusicPage]);

  const loadInitialMusic = useCallback(async () => {
    const seq = ++musicFetchSeqRef.current;
    setState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        isMusicLoading: true,
        isMusicLoadingMore: false,
        hasMoreMusic: false,
        activeFilter: 'all',
      },
      data: {
        ...prev.data,
        selectedTalent: null,
        selectedGroup: null,
        musicList: [],
        musicPagination: null,
      },
    }));
    await fetchMusicPage({ page: 1, append: false, seq });
  }, [setState, fetchMusicPage]);

  const clearSelection = useCallback(async () => {
    await loadInitialMusic();
  }, [loadInitialMusic]);

  const selectTalent = useCallback(
    async (talent: MusicTalent) => {
      const seq = ++musicFetchSeqRef.current;
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isDropdownOpen: false,
          isMusicLoading: true,
          isMusicLoadingMore: false,
          hasMoreMusic: false,
          activeFilter: 'all',
        },
        data: {
          ...prev.data,
          selectedTalent: talent,
          selectedGroup: null,
          musicList: [],
          musicPagination: null,
        },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));

      const slug = String(talent.talentSlug ?? '').trim();
      await fetchMusicPage({ talentSlug: slug, page: 1, append: false, seq });
    },
    [setState, fetchMusicPage]
  );

  const selectGroup = useCallback(
    async (group: MusicTalentGroup) => {
      const seq = ++musicFetchSeqRef.current;
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isDropdownOpen: false,
          isMusicLoading: true,
          isMusicLoadingMore: false,
          hasMoreMusic: false,
          activeFilter: 'all',
        },
        data: {
          ...prev.data,
          selectedGroup: group,
          selectedTalent: null,
          musicList: [],
          musicPagination: null,
        },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));

      const slug = toGroupSlug(group.groupNameEn);
      await fetchMusicPage({ groupSlug: slug, page: 1, append: false, seq });
    },
    [setState, fetchMusicPage]
  );

  const loadMoreMusic = useCallback(() => {
    const current = stateRef.current;
    if (
      current.config.isMusicLoading ||
      current.config.isMusicLoadingMore ||
      !current.config.hasMoreMusic
    ) {
      return;
    }

    const pagination = current.data.musicPagination ?? emptyPagination();
    const nextPage = pagination.currentPage + 1;
    if (nextPage > pagination.lastPage) {
      return;
    }

    const seq = musicFetchSeqRef.current;
    const talentSlug = current.data.selectedTalent
      ? String(current.data.selectedTalent.talentSlug ?? '').trim()
      : undefined;
    const groupSlug = current.data.selectedGroup
      ? toGroupSlug(current.data.selectedGroup.groupNameEn)
      : undefined;

    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isMusicLoadingMore: true },
    }));

    void fetchMusicPage({
      talentSlug,
      groupSlug,
      page: nextPage,
      append: true,
      seq,
    });
  }, [setState, fetchMusicPage]);

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
      loadInitialMusic,
      clearSelection,
      selectTalent,
      selectGroup,
      loadMoreMusic,
      setIsDropdownOpen,
      setTalentSearchQuery,
      setActiveFilter,
    },
  };
};

function mergeUniqueMusic(existing: Music[], incoming: Music[]): Music[] {
  const seen = new Set(existing.map((m) => m.id));
  const appended = incoming.filter((m) => !seen.has(m.id));
  return existing.concat(appended);
}
