import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useTalentsGetApi, Talent as ApiTalent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import {
  EgoSearchFilters,
  defaultEgoSearchFilters,
  ExcludeWord,
  TalentAccount,
  DateRangePreset,
  MediaFilter,
} from '../types';
import { buildTwitterSearchUrl } from '../utils/buildTwitterSearchUrl';
import {
  getTalentAccount,
  saveTalentAccount,
  getAllTalentAccounts,
} from '../utils/talentAccountsStorage';
import {
  getExcludeWords,
  addExcludeWord as addExcludeWordToStorage,
  removeExcludeWord as removeExcludeWordFromStorage,
} from '../utils/excludeWordsStorage';

/**
 * タレント情報
 */
export interface Talent {
  id: string;
  talentName: string;
  talentNameEn: string;
  talentNameJoin: string;
}

/**
 * エゴサーチ画面の状態
 */
export interface EgoSearchState {
  config: {
    isLoading: boolean;
    isHelpModalOpen: boolean;
    showSearchPreview: boolean;
  };
  data: {
    talents: Talent[];
    excludeWords: ExcludeWord[];
  };
  filters: EgoSearchFilters;
  ui: {
    talentSearchQuery: string;
    isDropdownOpen: boolean;
  };
}

/**
 * エゴサーチ画面のアクション
 */
export interface EgoSearchActions {
  // データ取得
  fetchTalents: () => void;

  // 検索実行
  handleSearchOnTwitter: () => void;

  // 検索キーワード
  setSearchKeywords: (keywords: string[]) => void;
  appendKeywordsFromPresets: (keywords: string[]) => void;

  // 日付フィルタ
  setDateRangePreset: (preset: DateRangePreset) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;

  // メディアフィルタ
  setMediaFilter: (filter: MediaFilter) => void;

  // タレントアカウントフィルタ
  setTalentAccountsEnabled: (enabled: boolean) => void;
  toggleTalentAccount: (account: TalentAccount) => void;
  saveTalentAccountInfo: (talentId: string, talentName: string, accounts: string[]) => void;

  // 除外ワードフィルタ
  setExcludeWordsEnabled: (enabled: boolean) => void;
  toggleExcludeWord: (word: ExcludeWord) => void;
  addExcludeWord: (word: string) => void;
  removeExcludeWord: (id: string) => void;

  // その他のフィルタ
  setExcludeReplies: (exclude: boolean) => void;
  setExcludeRetweets: (exclude: boolean) => void;
  setMinLikes: (count: number | null) => void;
  setMinRetweets: (count: number | null) => void;

  // フィルタリセット
  resetFilters: () => void;

  // UI制御
  setIsHelpModalOpen: (isOpen: boolean) => void;
  setTalentSearchQuery: (query: string) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  setShowSearchPreview: (show: boolean) => void;
}

/**
 * エゴサーチ画面 State Hooks
 */
export const useEgoSearchState = (
  state: EgoSearchState,
  setState: Dispatch<SetStateAction<EgoSearchState>>
): {
  actions: EgoSearchActions;
} => {
  // API Hooks
  const talentsApi = useTalentsGetApi();

  // アクション実装
  const actions: EgoSearchActions = {
    /**
     * タレント一覧取得
     */
    fetchTalents: useCallback(async () => {
      try {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: true },
        }));

        const result = await talentsApi.executeTalentsGet();

        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            ...prev.data,
            talents: result.apiResponse?.data?.talents?.map((talent: ApiTalent) => ({
              id: talent.id,
              talentName: talent.talentName,
              talentNameEn: talent.talentNameEn,
              talentNameJoin: talent.talentName + '（' + talent.talentNameEn + '）',
            })) ?? [],
          },
        }));
      } catch (error) {
        console.error('Failed to fetch talents:', error);
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
        }));
      }
    }, [talentsApi]),

    /**
     * Xで検索
     */
    handleSearchOnTwitter: useCallback(() => {
      const searchUrl = buildTwitterSearchUrl(state.filters);
      window.open(searchUrl, '_blank');
    }, [state.filters]),

    /**
     * 検索キーワード設定
     */
    setSearchKeywords: useCallback((keywords: string[]) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, searchKeywords: keywords },
      }));
    }, []),

    /**
     * プリセットからキーワードを追加
     */
    appendKeywordsFromPresets: useCallback((keywords: string[]) => {
      setState(prev => {
        const currentKeywords = prev.filters.searchKeywords.filter(k => k.trim() !== '');

        // 現在のキーワードが空の場合はプリセットのキーワードをそのまま設定
        if (currentKeywords.length === 0) {
          return {
            ...prev,
            filters: { ...prev.filters, searchKeywords: keywords },
          };
        }

        // 既存のキーワードにプリセットのキーワードを追加
        return {
          ...prev,
          filters: { ...prev.filters, searchKeywords: [...currentKeywords, ...keywords] },
        };
      });
    }, []),

    /**
     * 日付範囲プリセット設定
     */
    setDateRangePreset: useCallback((preset: DateRangePreset) => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          dateRange: { preset },
        },
      }));
    }, []),

    /**
     * カスタム日付範囲設定
     */
    setCustomDateRange: useCallback((startDate: string, endDate: string) => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          dateRange: {
            preset: 'custom',
            customStartDate: startDate,
            customEndDate: endDate,
          },
        },
      }));
    }, []),

    /**
     * メディアフィルタ設定
     */
    setMediaFilter: useCallback((filter: MediaFilter) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, mediaFilter: filter },
      }));
    }, []),

    /**
     * タレントアカウントフィルタ有効/無効
     */
    setTalentAccountsEnabled: useCallback((enabled: boolean) => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          talentAccounts: { ...prev.filters.talentAccounts, enabled },
        },
      }));
    }, []),

    /**
     * タレントアカウント選択/解除
     */
    toggleTalentAccount: useCallback((account: TalentAccount) => {
      setState(prev => {
        const isSelected = prev.filters.talentAccounts.selectedAccounts.some(
          a => a.talentId === account.talentId
        );
        return {
          ...prev,
          filters: {
            ...prev.filters,
            talentAccounts: {
              ...prev.filters.talentAccounts,
              selectedAccounts: isSelected
                ? prev.filters.talentAccounts.selectedAccounts.filter(
                    a => a.talentId !== account.talentId
                  )
                : [...prev.filters.talentAccounts.selectedAccounts, account],
            },
          },
        };
      });
    }, []),

    /**
     * タレントアカウント情報を保存
     */
    saveTalentAccountInfo: useCallback((
      talentId: string,
      talentName: string,
      accounts: string[]
    ) => {
      const account: TalentAccount = {
        talentId,
        talentName,
        accounts,
      };
      saveTalentAccount(account);
    }, []),

    /**
     * 除外ワードフィルタ有効/無効
     */
    setExcludeWordsEnabled: useCallback((enabled: boolean) => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          excludeWords: { ...prev.filters.excludeWords, enabled },
        },
      }));
    }, []),

    /**
     * 除外ワード選択/解除
     */
    toggleExcludeWord: useCallback((word: ExcludeWord) => {
      setState(prev => {
        const isSelected = prev.filters.excludeWords.selectedWords.some(
          w => w.id === word.id
        );
        return {
          ...prev,
          filters: {
            ...prev.filters,
            excludeWords: {
              ...prev.filters.excludeWords,
              selectedWords: isSelected
                ? prev.filters.excludeWords.selectedWords.filter(w => w.id !== word.id)
                : [...prev.filters.excludeWords.selectedWords, word],
            },
          },
        };
      });
    }, []),

    /**
     * 除外ワード追加
     */
    addExcludeWord: useCallback((word: string) => {
      const newWord: ExcludeWord = {
        id: Date.now().toString(),
        word: word.trim(),
      };
      addExcludeWordToStorage(newWord);

      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          excludeWords: [...prev.data.excludeWords, newWord],
        },
      }));
    }, []),

    /**
     * 除外ワード削除
     */
    removeExcludeWord: useCallback((id: string) => {
      removeExcludeWordFromStorage(id);

      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          excludeWords: prev.data.excludeWords.filter(w => w.id !== id),
        },
        filters: {
          ...prev.filters,
          excludeWords: {
            ...prev.filters.excludeWords,
            selectedWords: prev.filters.excludeWords.selectedWords.filter(
              w => w.id !== id
            ),
          },
        },
      }));
    }, []),

    /**
     * リプライ除外設定
     */
    setExcludeReplies: useCallback((exclude: boolean) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, excludeReplies: exclude },
      }));
    }, []),

    /**
     * リツイート除外設定
     */
    setExcludeRetweets: useCallback((exclude: boolean) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, excludeRetweets: exclude },
      }));
    }, []),

    /**
     * 最小いいね数設定
     */
    setMinLikes: useCallback((count: number | null) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, minLikes: count },
      }));
    }, []),

    /**
     * 最小リツイート数設定
     */
    setMinRetweets: useCallback((count: number | null) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, minRetweets: count },
      }));
    }, []),

    /**
     * フィルタリセット
     */
    resetFilters: useCallback(() => {
      setState(prev => ({
        ...prev,
        filters: defaultEgoSearchFilters,
      }));
    }, []),

    /**
     * ヘルプモーダル開閉
     */
    setIsHelpModalOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, isHelpModalOpen: isOpen },
      }));
    }, []),

    /**
     * タレント検索クエリ設定
     */
    setTalentSearchQuery: useCallback((query: string) => {
      setState(prev => ({
        ...prev,
        ui: { ...prev.ui, talentSearchQuery: query },
      }));
    }, []),

    /**
     * ドロップダウン開閉
     */
    setIsDropdownOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        ui: { ...prev.ui, isDropdownOpen: isOpen },
      }));
    }, []),

    /**
     * 検索プレビュー表示/非表示
     */
    setShowSearchPreview: useCallback((show: boolean) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, showSearchPreview: show },
      }));
    }, []),
  };

  /**
   * 初期データ取得
   */
  useEffect(() => {
    // タレント一覧取得
    actions.fetchTalents();

    // 除外ワード取得
    const storedExcludeWords = getExcludeWords();
    setState(prev => ({
      ...prev,
      data: { ...prev.data, excludeWords: storedExcludeWords },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { actions };
};
