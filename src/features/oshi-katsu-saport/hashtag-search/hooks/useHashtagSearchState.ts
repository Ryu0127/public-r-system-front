import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useHashtagSearchApi } from './useHashtagSearchApi';
import { TalentHashtagsApiHashtag, TalentHashtagsApiEventHashtag } from 'hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi';

export interface HashtagSearchState {
  config: {
    isLoading: boolean;
    mode: 'post' | 'search';
    isDropdownOpen: boolean;
    isHelpModalOpen: boolean;
    includeEventUrl: boolean;
    showSelectedTags: boolean;
    showSearchPreview: boolean;
  };
  data: {
    talents: Talent[];
    selectedTalent: Talent | null;
    hashtags: TalentHashtagsApiHashtag[];
    eventHashtags: TalentHashtagsApiEventHashtag[];
  };
  ui: {
    selectedTags: string[];
    selectedEventHashtags: TalentHashtagsApiEventHashtag[];
    searchQuery: string;
    talentSearchQuery: string;
  };
}

export interface Talent {
  id: string;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
}

export interface HashtagSearchActions {
  // データ取得アクション
  fetchTalents: () => void;
  fetchTalentHashtags: (id: string) => void;

  // タレント選択
  selectTalent: (talent: Talent) => void;

  // モード切り替え
  setMode: (mode: 'post' | 'search') => void;

  // タグ選択
  toggleTag: (tag: string) => void;
  toggleEventHashtag: (eventHashtag: TalentHashtagsApiEventHashtag) => void;
  clearSelectedTags: () => void;

  // 検索クエリ
  setSearchQuery: (query: string) => void;
  setTalentSearchQuery: (query: string) => void;

  // UI制御
  setIsDropdownOpen: (isOpen: boolean) => void;
  setIsHelpModalOpen: (isOpen: boolean) => void;
  setIncludeEventUrl: (include: boolean) => void;
  setShowSelectedTags: (show: boolean) => void;
  setShowSearchPreview: (show: boolean) => void;

  // アクション
  handlePostToTwitter: () => void;
  handleSearchOnTwitter: () => void;
  handleQuickSearch: (tag: string) => void;
}

/**
 * 状態管理値のグループ更新
 */
const updateStateGroup = {
  /**
   * ローディング状態の更新
   */
  toLoading: (
    setState: Dispatch<SetStateAction<HashtagSearchState>>,
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
   * タレント一覧の更新
   */
  toTalents: (
    prev: HashtagSearchState,
    talents: Talent[]
  ) => ({
    data: {
      ...prev.data,
      talents: talents,
      selectedTalent: talents.length > 0 ? talents[0] : null,
    },
  }),

  /**
   * ハッシュタグの更新
   */
  toHashtags: (
    prev: HashtagSearchState,
    hashtags: TalentHashtagsApiHashtag[],
    eventHashtags: TalentHashtagsApiEventHashtag[]
  ) => ({
    data: {
      ...prev.data,
      hashtags: hashtags,
      eventHashtags: eventHashtags,
    },
  }),

  /**
   * ローディング状態の更新
   */
  toLoading: (prev: HashtagSearchState, isLoading: boolean) => ({
    config: {
      ...prev.config,
      isLoading: isLoading,
    },
  }),
};

/**
 * ハッシュタグ検索画面 State Hooks
 *
 * @param state 状態
 * @param setState 状態更新関数
 * @returns アクション
 */
export const useHashtagSearchState = (
  state: HashtagSearchState,
  setState: Dispatch<SetStateAction<HashtagSearchState>>
): {
  actions: HashtagSearchActions;
} => {
  // API Hooks
  const api = useHashtagSearchApi();

  // アクション実装
  const actions: HashtagSearchActions = {
    /**
     * タレント一覧取得
     */
    fetchTalents: useCallback(async () => {
      try {
        updateStateGroup.toLoading(setState, true);

        const result = await api.executeTalentsGet();

        setState(prev => ({
          ...prev,
          ...updateState.toLoading(prev, false),
          ...updateState.toTalents(prev, result.data?.talents?.map(talent => ({
            id: talent.id,
            talentName: talent.talentName,
            talentNameEn: talent.talentNameEn,
            talentNameJoin: talent.talentName + '（' + talent.talentNameEn + '）',
          })) ?? []),
        }));

        // 最初のタレントのハッシュタグを取得
        if (result.data?.talents && result.data.talents.length > 0) {
          actions.fetchTalentHashtags(result.data.talents[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch talents:', error);
        updateStateGroup.toLoading(setState, false);
      }
    }, [api]),

    /**
     * タレント別ハッシュタグ取得
     */
    fetchTalentHashtags: useCallback(async (id: string) => {
      try {
        updateStateGroup.toLoading(setState, true);

        const result = await api.executeTalentHashtagsGet(id);

        setState(prev => ({
          ...prev,
          ...updateState.toLoading(prev, false),
          ...updateState.toHashtags(
            prev,
            result.data?.hashtags ?? [],
            result.data?.eventHashtags ?? []
          ),
        }));
      } catch (error) {
        console.error('Failed to fetch hashtags:', error);
        updateStateGroup.toLoading(setState, false);
      }
    }, [api]),

    /**
     * タレント選択
     */
    selectTalent: useCallback((talent: Talent) => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          selectedTalent: talent,
        },
        ui: {
          ...prev.ui,
          selectedTags: [],
          selectedEventHashtags: [],
          talentSearchQuery: '',
        },
        config: {
          ...prev.config,
          isDropdownOpen: false,
        },
      }));
      actions.fetchTalentHashtags(talent.id);
    }, []),

    /**
     * モード切り替え
     */
    setMode: useCallback((mode: 'post' | 'search') => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          mode: mode,
        },
      }));
    }, []),

    /**
     * タグ選択/解除
     */
    toggleTag: useCallback((tag: string) => {
      setState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          selectedTags: prev.ui.selectedTags.includes(tag)
            ? prev.ui.selectedTags.filter(t => t !== tag)
            : [...prev.ui.selectedTags, tag],
        },
      }));
    }, []),

    /**
     * イベントハッシュタグ選択/解除
     */
    toggleEventHashtag: useCallback((eventHashtag: TalentHashtagsApiEventHashtag) => {
      setState(prev => {
        const isSelected = prev.ui.selectedTags.includes(eventHashtag.tag);
        return {
          ...prev,
          ui: {
            ...prev.ui,
            selectedTags: isSelected
              ? prev.ui.selectedTags.filter(t => t !== eventHashtag.tag)
              : [...prev.ui.selectedTags, eventHashtag.tag],
            selectedEventHashtags: isSelected
              ? prev.ui.selectedEventHashtags.filter(e => e.id !== eventHashtag.id)
              : [...prev.ui.selectedEventHashtags, eventHashtag],
          },
        };
      });
    }, []),

    /**
     * 選択タグクリア
     */
    clearSelectedTags: useCallback(() => {
      setState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          selectedTags: [],
          selectedEventHashtags: [],
        },
      }));
    }, []),

    /**
     * 検索クエリ設定
     */
    setSearchQuery: useCallback((query: string) => {
      setState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          searchQuery: query,
        },
      }));
    }, []),

    /**
     * タレント検索クエリ設定
     */
    setTalentSearchQuery: useCallback((query: string) => {
      setState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          talentSearchQuery: query,
        },
      }));
    }, []),

    /**
     * ドロップダウン開閉
     */
    setIsDropdownOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          isDropdownOpen: isOpen,
        },
      }));
    }, []),

    /**
     * ヘルプモーダル開閉
     */
    setIsHelpModalOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          isHelpModalOpen: isOpen,
        },
      }));
    }, []),

    /**
     * イベントURL含める/含めない
     */
    setIncludeEventUrl: useCallback((include: boolean) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          includeEventUrl: include,
        },
      }));
    }, []),

    /**
     * 選択中のハッシュタグ表示/非表示
     */
    setShowSelectedTags: useCallback((show: boolean) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          showSelectedTags: show,
        },
      }));
    }, []),

    /**
     * 検索プレビュー表示/非表示
     */
    setShowSearchPreview: useCallback((show: boolean) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          showSearchPreview: show,
        },
      }));
    }, []),

    /**
     * Xに投稿
     */
    handlePostToTwitter: useCallback(() => {
      if (state.ui.selectedTags.length === 0) {
        alert('ハッシュタグを1つ以上選択してください');
        return;
      }

      const hashtags = state.ui.selectedTags.map(tag => `#${tag}`).join('\n');
      const eventUrls = state.config.includeEventUrl && state.ui.selectedEventHashtags.length > 0
        ? state.ui.selectedEventHashtags.map(event => event.url).join('\n')
        : '';

      const tweetText = eventUrls
        ? `${eventUrls}\n${hashtags}`
        : hashtags;

      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(tweetUrl, '_blank');
    }, [state]),

    /**
     * Xで検索
     */
    handleSearchOnTwitter: useCallback(() => {
      if (!state.ui.searchQuery.trim()) {
        alert('検索したいハッシュタグを入力してください');
        return;
      }

      const searchUrl = `https://twitter.com/search?q=${encodeURIComponent('#' + state.ui.searchQuery.trim())}`;
      window.open(searchUrl, '_blank');
    }, [state]),

    /**
     * クイック検索
     */
    handleQuickSearch: useCallback((tag: string) => {
      setState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          searchQuery: tag,
        },
      }));
    }, []),
  };

  /**
   * 初期データ取得
   */
  useEffect(() => {
    actions.fetchTalents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { actions };
};
