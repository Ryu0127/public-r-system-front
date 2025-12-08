import { AdvancedSearchFilters, MediaFilter, DateRangePreset } from '../types/advancedSearchFilters';

/**
 * 日付をYYYY-MM-DD形式に変換
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 日付範囲プリセットから具体的な日付を取得
 */
const getDateRangeFromPreset = (preset: DateRangePreset): { since?: string; until?: string } => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  switch (preset) {
    case 'today':
      return {
        since: formatDate(today),
        until: formatDate(today),
      };
    case 'yesterday':
      return {
        since: formatDate(yesterday),
        until: formatDate(yesterday),
      };
    case 'last7days': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return {
        since: formatDate(sevenDaysAgo),
      };
    }
    case 'last30days': {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return {
        since: formatDate(thirtyDaysAgo),
      };
    }
    default:
      return {};
  }
};

/**
 * メディアフィルタをTwitter検索演算子に変換
 */
const getMediaFilterOperator = (mediaFilter: MediaFilter): string => {
  switch (mediaFilter) {
    case 'images':
      return 'filter:images';
    case 'videos':
      return 'filter:videos';
    case 'media':
      return 'filter:media';
    default:
      return '';
  }
};

/**
 * Twitter高度検索URLを構築
 */
export const buildTwitterSearchUrl = (
  hashtag: string,
  filters?: AdvancedSearchFilters
): string => {
  const searchParts: string[] = [];

  // ハッシュタグ（必須）
  searchParts.push(`#${hashtag.replace(/^#/, '')}`);

  if (filters) {
    // イラストタグの追加
    if (filters.includeIllustTag) {
      searchParts.push('#イラスト');
    }

    // 日付範囲フィルタ
    const { since, until } = filters.dateRange.preset === 'custom'
      ? {
          since: filters.dateRange.customStartDate,
          until: filters.dateRange.customEndDate,
        }
      : getDateRangeFromPreset(filters.dateRange.preset);

    if (since) {
      searchParts.push(`since:${since}`);
    }
    if (until) {
      searchParts.push(`until:${until}`);
    }

    // メディアフィルタ
    const mediaOperator = getMediaFilterOperator(filters.mediaFilter);
    if (mediaOperator) {
      searchParts.push(mediaOperator);
    }

    // タレントアカウントフィルタ
    if (filters.talentAccounts.enabled && filters.talentAccounts.selectedAccounts.length > 0) {
      const accounts = filters.talentAccounts.selectedAccounts;
      const searchType = filters.talentAccounts.searchType;

      if (accounts.length === 1) {
        // 1アカウントの場合
        const handle = accounts[0].twitterHandle;
        if (searchType === 'from') {
          searchParts.push(`from:${handle}`);
        } else if (searchType === 'to') {
          searchParts.push(`to:${handle}`);
        } else if (searchType === 'mentions') {
          // メンション検索（@アカウント名を含む）
          searchParts.push(`@${handle}`);
        }
      } else {
        // 複数アカウントの場合
        if (searchType === 'from') {
          // 複数アカウントからの投稿（OR検索）
          const fromParts = accounts.map(acc => `from:${acc.twitterHandle}`).join(' OR ');
          searchParts.push(`(${fromParts})`);
        } else if (searchType === 'mentions') {
          // 複数アカウント間のやりとり（すべてのアカウントをメンション）
          const mentionParts = accounts.map(acc => `@${acc.twitterHandle}`);
          searchParts.push(...mentionParts);
        }
      }
    }

    // 除外ワード
    if (filters.excludeWords.enabled && filters.excludeWords.selectedWords.length > 0) {
      const excludeParts = filters.excludeWords.selectedWords.map(
        item => `-${item.word}`
      );
      searchParts.push(...excludeParts);
    }
  }

  // 検索クエリを結合
  const searchQuery = searchParts.join(' ');

  // Twitter検索URLを構築
  return `https://twitter.com/search?q=${encodeURIComponent(searchQuery)}`;
};

/**
 * 検索クエリのプレビューテキストを生成
 */
export const buildSearchQueryPreview = (
  hashtag: string,
  filters?: AdvancedSearchFilters
): string => {
  const searchParts: string[] = [];

  searchParts.push(`#${hashtag.replace(/^#/, '')}`);

  if (filters) {
    if (filters.includeIllustTag) {
      searchParts.push('#イラスト');
    }

    const { since, until } = filters.dateRange.preset === 'custom'
      ? {
          since: filters.dateRange.customStartDate,
          until: filters.dateRange.customEndDate,
        }
      : getDateRangeFromPreset(filters.dateRange.preset);

    if (since) {
      searchParts.push(`since:${since}`);
    }
    if (until) {
      searchParts.push(`until:${until}`);
    }

    const mediaOperator = getMediaFilterOperator(filters.mediaFilter);
    if (mediaOperator) {
      searchParts.push(mediaOperator);
    }

    if (filters.talentAccounts.enabled && filters.talentAccounts.selectedAccounts.length > 0) {
      const accounts = filters.talentAccounts.selectedAccounts;
      const searchType = filters.talentAccounts.searchType;

      if (accounts.length === 1) {
        const handle = accounts[0].twitterHandle;
        if (searchType === 'from') {
          searchParts.push(`from:${handle}`);
        } else if (searchType === 'to') {
          searchParts.push(`to:${handle}`);
        } else if (searchType === 'mentions') {
          searchParts.push(`@${handle}`);
        }
      } else {
        if (searchType === 'from') {
          const fromParts = accounts.map(acc => `from:${acc.twitterHandle}`).join(' OR ');
          searchParts.push(`(${fromParts})`);
        } else if (searchType === 'mentions') {
          const mentionParts = accounts.map(acc => `@${acc.twitterHandle}`);
          searchParts.push(...mentionParts);
        }
      }
    }

    if (filters.excludeWords.enabled && filters.excludeWords.selectedWords.length > 0) {
      const excludeParts = filters.excludeWords.selectedWords.map(
        item => `-${item.word}`
      );
      searchParts.push(...excludeParts);
    }
  }

  return searchParts.join(' ');
};
