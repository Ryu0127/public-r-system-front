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
  // デフォルトデータ
  const defaultBaseTalent: Talent = {
    id: 'tokino-sora',
    talentName: 'ときのそら',
    talentNameEn: 'Tokino Sora',
    talentNameJoin: 'ときのそら（Tokino Sora）',
  };

  const defaultCollaborator: Collaborator = {
    id: 'roboco',
    talentName: 'ロボ子さん',
    talentNameEn: 'Roboco',
    collaborationCount: 25,
  };

  const defaultCollaborators: Collaborator[] = [
    defaultCollaborator,
    {
      id: 'azki',
      talentName: 'AZKi',
      talentNameEn: 'AZKi',
      collaborationCount: 18,
    },
  ];

  const defaultVideos: CollabVideo[] = [
    {
      id: 'tokino-sora-roboco-1',
      videoCode: 'UrxbELTadIU',
      videoTitle: '【Minecraft】ときのそら×ロボ子さん コラボ配信',
      videoUrl: 'https://www.youtube.com/watch?v=UrxbELTadIU',
      videoImgPath: 'https://i.ytimg.com/vi/UrxbELTadIU/mqdefault.jpg',
      videoTime: '1:30:25',
      publishedAt: '2024-03-20T20:00:00Z',
      favoriteFlag: false,
    },
  ];

  // 初期状態（デフォルトデータを設定）
  const initialState: CollabSearchState = {
    config: {
      isLoading: false,
      isBaseTalentDropdownOpen: false,
      isCollaboratorDropdownOpen: false,
    },
    data: {
      talents: [],
      selectedBaseTalent: defaultBaseTalent,
      collaborators: defaultCollaborators,
      selectedCollaborator: defaultCollaborator,
      videos: defaultVideos,
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

  // 初回マウント時にタレント一覧を取得（デフォルトデータは初期状態で設定済み）
  useEffect(() => {
    fetchTalents();
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
