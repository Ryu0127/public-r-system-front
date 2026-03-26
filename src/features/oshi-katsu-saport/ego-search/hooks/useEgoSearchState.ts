import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useEgoSearchTalentsGetApi, Talent as ApiTalent, SearchWordGroup } from 'hooks/api/oshi-katsu-saport/useEgoSearchTalentsGetApi';
import {
  EgoSearchFilters,
  defaultEgoSearchFilters,
  ExcludeWord,
  TalentAccount,
  DateRangePreset,
} from '../types';
import { buildTwitterSearchUrl } from '../utils/buildTwitterSearchUrl';
import {
  saveTalentAccount,
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
  talentSlug?: string;
  talentNameJoin: string;
  groupName: string;
  groupId: number;
  twitterAccounts: string[];
  searchWordGroups: SearchWordGroup[];
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
  selectTalent: (talent: Talent) => void;
  resetTalentSelection: () => void;

  // 検索実行
  handleSearchOnTwitter: () => void;

  // 検索キーワード
  setSearchKeywords: (keywords: string[]) => void;
  appendKeywordsFromPresets: (keywords: string[]) => void;

  // タレント別検索ワード
  setTalentKeywordsByCategory: (selectedByCategory: Record<string, string[]>) => void;

  // 日付フィルタ
  setDateRangePreset: (preset: DateRangePreset) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;

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
  const talentsApi = useEgoSearchTalentsGetApi();

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

        const result = await talentsApi.executeEgoSearchTalentsGet();

        setState(prev => ({
          ...prev,
          config: { ...prev.config, isLoading: false },
          data: {
            ...prev.data,
            talents: result.apiResponse?.data?.talents?.map((talent: ApiTalent) => ({
              id: talent.id,
              talentName: talent.talentName,
              talentNameEn: talent.talentNameEn,
              talentSlug: talent.talentSlug,
              talentNameJoin: talent.talentName + '（' + talent.talentNameEn + '）',
              groupName: talent.groupName,
              groupId: talent.groupId,
              twitterAccounts: talent.twitterAccounts,
              searchWordGroups: talent.searchWordGroups ?? [],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [talentsApi, setState]),

    /**
     * タレント選択（UIの選択操作を集約）
     */
    selectTalent: useCallback((talent: Talent) => {
      setState(prev => {
        const current = prev.filters.talentAccounts.selectedAccounts[0];
        const alreadySame = current?.talentId === talent.id;
        const nextSelectedAccounts = alreadySame
          ? prev.filters.talentAccounts.selectedAccounts
          : [
              {
                talentId: talent.id,
                talentName: talent.talentName,
                accounts: talent.twitterAccounts,
              },
            ];

        return {
          ...prev,
          filters: {
            ...prev.filters,
            talentAccounts: {
              ...prev.filters.talentAccounts,
              selectedAccounts: nextSelectedAccounts,
            },
          },
          ui: {
            ...prev.ui,
            talentSearchQuery: '',
            isDropdownOpen: false,
          },
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * タレント選択リセット
     */
    resetTalentSelection: useCallback(() => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          talentAccounts: {
            ...prev.filters.talentAccounts,
            enabled: false,
            selectedAccounts: [],
          },
        },
        ui: {
          ...prev.ui,
          talentSearchQuery: '',
          isDropdownOpen: false,
        },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * タレント別検索ワード設定（カテゴリごと）
     */
    setTalentKeywordsByCategory: useCallback((selectedByCategory: Record<string, string[]>) => {
      setState(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          talentKeywords: { selectedByCategory },
        },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * リプライ除外設定
     */
    setExcludeReplies: useCallback((exclude: boolean) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, excludeReplies: exclude },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * リツイート除外設定
     */
    setExcludeRetweets: useCallback((exclude: boolean) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, excludeRetweets: exclude },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * フィルタリセット
     */
    resetFilters: useCallback(() => {
      setState(prev => ({
        ...prev,
        filters: defaultEgoSearchFilters,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * ヘルプモーダル開閉
     */
    setIsHelpModalOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, isHelpModalOpen: isOpen },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * タレント検索クエリ設定
     */
    setTalentSearchQuery: useCallback((query: string) => {
      setState(prev => ({
        ...prev,
        ui: { ...prev.ui, talentSearchQuery: query },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * ドロップダウン開閉
     */
    setIsDropdownOpen: useCallback((isOpen: boolean) => {
      setState(prev => ({
        ...prev,
        ui: { ...prev.ui, isDropdownOpen: isOpen },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),

    /**
     * 検索プレビュー表示/非表示
     */
    setShowSearchPreview: useCallback((show: boolean) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, showSearchPreview: show },
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]),
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
