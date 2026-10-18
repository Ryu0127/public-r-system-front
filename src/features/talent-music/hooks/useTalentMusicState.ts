import { useCallback, useRef, Dispatch, SetStateAction } from 'react';
import { Music, MusicPlaylist, MusicTalent, MusicTalentGroup, MusicFilterType, TalentMusicPagination, TalentMusicCounts } from '../types';
import { talentToMusicTalent } from '../utils/talentToMusicTalent';
import { TEMPORARY_PLAYLIST_MAX_VIDEOS } from '../utils/temporaryPlaylist';
import { toGroupSlug } from '../utils/toGroupSlug';
import {
  TALENT_MUSIC_DEFAULT_PER_PAGE,
  useTalentMusicGetApi,
} from 'hooks/api/talent-music/useTalentMusicGetApi';
import { useTalentsGetApi } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import { useMusicPlaylistsGetApi } from 'hooks/api/talent-music/useMusicPlaylistsGetApi';

export interface TalentMusicState {
  config: {
    isLoading: boolean;
    isMusicLoading: boolean;
    isMusicLoadingMore: boolean;
    isDropdownOpen: boolean;
    activeFilter: MusicFilterType;
    hasMoreMusic: boolean;
    /** 楽曲の複数選択モード（一時プレイリスト作成用） */
    isMultiSelectMode: boolean;
  };
  data: {
    talents: MusicTalent[];
    groups: MusicTalentGroup[];
    /** 楽曲一覧に表示する YouTube プレイリスト */
    playlists: MusicPlaylist[];
    musicList: Music[];
    musicPagination: TalentMusicPagination | null;
    musicCounts: TalentMusicCounts | null;
    selectedTalent: MusicTalent | null;
    /** グループ選択時にセット。タレント選択時はクリアされる */
    selectedGroup: MusicTalentGroup | null;
    /** 複数選択モードで選択した楽曲（選択順 = 再生順） */
    playlistSelection: Music[];
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
  startMultiSelect: () => void;
  cancelMultiSelect: () => void;
  toggleMusicSelection: (music: Music) => void;
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
  const { executeMusicPlaylistsGet } = useMusicPlaylistsGetApi();
  const musicFetchSeqRef = useRef(0);
  const playlistFetchSeqRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * プレイリストを取得し直す（タレント指定時はそのタレントが含まれるプレイリストのみ）
   * 選択の切り替えが連続した場合は、最後のリクエスト結果のみ反映する
   */
  const reloadPlaylists = useCallback(
    async (talentSlug?: string) => {
      const seq = ++playlistFetchSeqRef.current;
      const res = await executeMusicPlaylistsGet({ talentSlug });
      if (seq !== playlistFetchSeqRef.current) return;
      setState((prev) => ({ ...prev, data: { ...prev.data, playlists: res.playlists } }));
    },
    [setState, executeMusicPlaylistsGet]
  );

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
        const counts = musicRes.apiResponse.data.counts;
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
              musicCounts: counts,
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

    // タレント一覧とプレイリストは独立しているため並列取得（プレイリスト取得失敗時は非表示）
    ++playlistFetchSeqRef.current;
    const [talentsRes, playlistsRes] = await Promise.all([
      executeTalentsGet(),
      executeMusicPlaylistsGet(),
    ]);
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
        isMultiSelectMode: false,
      },
      data: {
        ...prev.data,
        talents,
        groups,
        playlists: playlistsRes.playlists,
        musicList: [],
        musicPagination: null,
        musicCounts: null,
        selectedTalent: null,
        selectedGroup: null,
        playlistSelection: [],
      },
    }));

    // URL に talent/group がある場合は Container 側の select が seq を更新してこちらをキャンセルする
    await fetchMusicPage({ page: 1, append: false, seq });
  }, [setState, executeTalentsGet, executeMusicPlaylistsGet, fetchMusicPage]);

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
        isMultiSelectMode: false,
      },
      data: {
        ...prev.data,
        selectedTalent: null,
        selectedGroup: null,
        playlistSelection: [],
        musicList: [],
        musicPagination: null,
        musicCounts: null,
      },
    }));
    await Promise.all([
      fetchMusicPage({ page: 1, append: false, seq }),
      reloadPlaylists(),
    ]);
  }, [setState, fetchMusicPage, reloadPlaylists]);

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
          isMultiSelectMode: false,
        },
        data: {
          ...prev.data,
          selectedTalent: talent,
          selectedGroup: null,
          playlistSelection: [],
          // 別タレントのプレイリストが一瞬表示されないよう、取得完了まで空にする
          playlists: [],
          musicList: [],
          musicPagination: null,
          musicCounts: null,
        },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));

      const slug = String(talent.talentSlug ?? '').trim();
      await Promise.all([
        fetchMusicPage({ talentSlug: slug, page: 1, append: false, seq }),
        reloadPlaylists(slug),
      ]);
    },
    [setState, fetchMusicPage, reloadPlaylists]
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
          isMultiSelectMode: false,
        },
        data: {
          ...prev.data,
          selectedGroup: group,
          selectedTalent: null,
          playlistSelection: [],
          musicList: [],
          musicPagination: null,
          musicCounts: null,
        },
        ui: { ...prev.ui, talentSearchQuery: '' },
      }));

      const slug = toGroupSlug(group.groupNameEn);
      // グループ選択時のプレイリストは絞り込まず全件
      await Promise.all([
        fetchMusicPage({ groupSlug: slug, page: 1, append: false, seq }),
        reloadPlaylists(),
      ]);
    },
    [setState, fetchMusicPage, reloadPlaylists]
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

  const startMultiSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isMultiSelectMode: true },
      data: { ...prev.data, playlistSelection: [] },
    }));
  }, [setState]);

  const cancelMultiSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isMultiSelectMode: false },
      data: { ...prev.data, playlistSelection: [] },
    }));
  }, [setState]);

  /** 選択/解除を切り替え（上限件数に達している場合は追加しない） */
  const toggleMusicSelection = useCallback(
    (music: Music) => {
      setState((prev) => {
        const current = prev.data.playlistSelection;
        const isSelected = current.some((m) => m.id === music.id);
        if (!isSelected && current.length >= TEMPORARY_PLAYLIST_MAX_VIDEOS) {
          return prev;
        }
        const next = isSelected
          ? current.filter((m) => m.id !== music.id)
          : current.concat(music);
        return { ...prev, data: { ...prev.data, playlistSelection: next } };
      });
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
      startMultiSelect,
      cancelMultiSelect,
      toggleMusicSelection,
    },
  };
};

function mergeUniqueMusic(existing: Music[], incoming: Music[]): Music[] {
  const seen = new Set(existing.map((m) => m.id));
  const appended = incoming.filter((m) => !seen.has(m.id));
  return existing.concat(appended);
}
