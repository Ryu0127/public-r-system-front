import { useState, useCallback, useEffect } from 'react';
import { useTalentsGetApi } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import { useCollaboratorsGetApi } from './useCollaboratorsGetApi';
import { useCollabVideosGetApi } from './useCollabVideosGetApi';
import { CollabSearchState, Talent, Collaborator, CollabVideo } from '../types';

export interface CollabSearchActions {
  // データ取得
  fetchTalents: () => void;
  fetchCollaborators: (talentId: string) => void;
  fetchCollabVideos: (talentId: string, collaboratorId: string) => void;

  // タレント選択
  selectBaseTalent: (talent: Talent) => void;
  selectCollaborator: (collaborator: Collaborator) => void;

  // 検索クエリ
  setBaseTalentSearchQuery: (query: string) => void;
  setCollaboratorSearchQuery: (query: string) => void;

  // ドロップダウン制御
  setIsBaseTalentDropdownOpen: (isOpen: boolean) => void;
  setIsCollaboratorDropdownOpen: (isOpen: boolean) => void;
}

/**
 * コラボ検索の状態管理フック
 */
export const useCollabSearchState = () => {
  // 初期状態
  const initialState: CollabSearchState = {
    config: {
      isLoading: false,
      isBaseTalentDropdownOpen: false,
      isCollaboratorDropdownOpen: false,
    },
    data: {
      talents: [],
      selectedBaseTalent: null,
      collaborators: [],
      selectedCollaborator: null,
      videos: [],
    },
    ui: {
      baseTalentSearchQuery: '',
      collaboratorSearchQuery: '',
    },
  };

  const [state, setState] = useState<CollabSearchState>(initialState);

  // APIフック
  const { executeTalentsGet } = useTalentsGetApi();
  const { executeCollaboratorsGet } = useCollaboratorsGetApi();
  const { executeCollabVideosGet } = useCollabVideosGetApi();

  /**
   * タレント一覧を取得
   */
  const fetchTalents = useCallback(async () => {
    // setState((prev) => ({
    //   ...prev,
    //   config: { ...prev.config, isLoading: true },
    // }));

    const { apiResponse } = await executeTalentsGet();

    if (apiResponse?.status && apiResponse.data.talents) {
      const talentsWithJoinName = apiResponse.data.talents.map((talent) => ({
        ...talent,
        talentNameJoin: `${talent.talentName}（${talent.talentNameEn}）`,
      }));

      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: false },
        data: { ...prev.data, talents: talentsWithJoinName },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: false },
      }));
    }
  }, [executeTalentsGet]);

  /**
   * コラボレーター一覧を取得
   */
  const fetchCollaborators = useCallback(
    async (talentId: string) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: true },
      }));

      const { apiResponse } = await executeCollaboratorsGet(talentId);

      if (apiResponse?.status && apiResponse.data.collaborators) {
        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            ...prev.data,
            collaborators: apiResponse.data.collaborators,
            selectedCollaborator: null,
            videos: [],
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            ...prev.data,
            collaborators: [],
            selectedCollaborator: null,
            videos: [],
          },
        }));
      }
    },
    [executeCollaboratorsGet]
  );

  /**
   * コラボ動画一覧を取得
   */
  const fetchCollabVideos = useCallback(
    async (talentId: string, collaboratorId: string) => {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: true },
      }));

      const { apiResponse } = await executeCollabVideosGet(talentId, collaboratorId);

      if (apiResponse?.status && apiResponse.data.videos) {
        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: { ...prev.data, videos: apiResponse.data.videos },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: { ...prev.data, videos: [] },
        }));
      }
    },
    [executeCollabVideosGet]
  );

  /**
   * メインタレントを選択
   */
  const selectBaseTalent = useCallback(
    (talent: Talent) => {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          selectedBaseTalent: talent,
          collaborators: [],
          selectedCollaborator: null,
          videos: [],
        },
        ui: {
          ...prev.ui,
          baseTalentSearchQuery: '',
          collaboratorSearchQuery: '',
        },
        config: {
          ...prev.config,
          isBaseTalentDropdownOpen: false,
        },
      }));

      // コラボレーター一覧を取得
      fetchCollaborators(talent.id);
    },
    [fetchCollaborators]
  );

  /**
   * コラボレーターを選択
   */
  const selectCollaborator = useCallback(
    (collaborator: Collaborator) => {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          selectedCollaborator: collaborator,
          videos: [],
        },
        ui: {
          ...prev.ui,
          collaboratorSearchQuery: '',
        },
        config: {
          ...prev.config,
          isCollaboratorDropdownOpen: false,
        },
      }));

      // コラボ動画一覧を取得
      if (state.data.selectedBaseTalent) {
        fetchCollabVideos(state.data.selectedBaseTalent.id, collaborator.id);
      }
    },
    [state.data.selectedBaseTalent, fetchCollabVideos]
  );

  /**
   * メインタレント検索クエリを設定
   */
  const setBaseTalentSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, baseTalentSearchQuery: query },
    }));
  }, []);

  /**
   * コラボレーター検索クエリを設定
   */
  const setCollaboratorSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      ui: { ...prev.ui, collaboratorSearchQuery: query },
    }));
  }, []);

  /**
   * メインタレントドロップダウンの開閉を設定
   */
  const setIsBaseTalentDropdownOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isBaseTalentDropdownOpen: isOpen },
    }));
  }, []);

  /**
   * コラボレータードロップダウンの開閉を設定
   */
  const setIsCollaboratorDropdownOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, isCollaboratorDropdownOpen: isOpen },
    }));
  }, []);

  // 初回マウント時にタレント一覧を取得し、デフォルト選択を実行
  useEffect(() => {
    const initializeDefaultSelection = async () => {
      // タレント一覧を取得
      await fetchTalents();

      // デフォルトでときのそらを選択
      const defaultBaseTalent: Talent = {
        id: 'tokino-sora',
        talentName: 'ときのそら',
        talentNameEn: 'Tokino Sora',
        talentNameJoin: 'ときのそら（Tokino Sora）',
      };

      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          selectedBaseTalent: defaultBaseTalent,
        },
      }));

      // コラボレーター一覧を取得
      const { apiResponse: collaboratorsResponse } = await executeCollaboratorsGet(defaultBaseTalent.id);

      if (collaboratorsResponse?.status && collaboratorsResponse.data.collaborators.length > 0) {
        const defaultCollaborator = collaboratorsResponse.data.collaborators[0]; // ロボ子さん

        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            collaborators: collaboratorsResponse.data.collaborators,
            selectedCollaborator: defaultCollaborator,
          },
        }));

        // コラボ動画を取得
        const { apiResponse: videosResponse } = await executeCollabVideosGet(defaultBaseTalent.id, defaultCollaborator.id);

        if (videosResponse?.status && videosResponse.data.videos) {
          setState((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              videos: videosResponse.data.videos,
            },
          }));
        }
      }
    };

    initializeDefaultSelection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const actions: CollabSearchActions = {
    fetchTalents,
    fetchCollaborators,
    fetchCollabVideos,
    selectBaseTalent,
    selectCollaborator,
    setBaseTalentSearchQuery,
    setCollaboratorSearchQuery,
    setIsBaseTalentDropdownOpen,
    setIsCollaboratorDropdownOpen,
  };

  return {
    state,
    actions,
  };
};
