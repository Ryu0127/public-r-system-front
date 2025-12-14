import { EgoSearchFilters, MediaFilter, DateRangePreset } from '../types';

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
    case 'all':
      return {};
    case 'today':
      return {
        since: formatDate(today),
      };
    case 'yesterday':
      return {
        since: formatDate(yesterday),
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
 * Twitter高度検索URLを構築（エゴサーチ用）
 */
export const buildTwitterSearchUrl = (filters: EgoSearchFilters): string => {
  const searchParts: string[] = [];

  // 検索キーワード（必須）
  if (filters.searchKeyword.trim()) {
    searchParts.push(filters.searchKeyword.trim());
  }

  // 日付範囲フィルタ
  const { since } = filters.dateRange.preset === 'custom'
    ? {
        since: filters.dateRange.customStartDate,
      }
    : getDateRangeFromPreset(filters.dateRange.preset);

  if (since) {
    searchParts.push(`since:${since}`);
  }

  // メディアフィルタ
  const mediaOperator = getMediaFilterOperator(filters.mediaFilter);
  if (mediaOperator) {
    searchParts.push(mediaOperator);
  }

  // タレントアカウントフィルタ（全アカウントを検索）
  if (filters.talentAccounts.enabled && filters.talentAccounts.selectedAccounts.length > 0) {
    const talentAccounts = filters.talentAccounts.selectedAccounts;
    const fromParts: string[] = [];

    talentAccounts.forEach(talent => {
      talent.accounts.forEach(account => {
        if (account) {
          fromParts.push(`from:${account}`);
        }
      });
    });

    if (fromParts.length > 0) {
      if (fromParts.length === 1) {
        searchParts.push(fromParts[0]);
      } else {
        // 複数アカウントの場合はOR検索
        searchParts.push(`(${fromParts.join(' OR ')})`);
      }
    }
  }

  // リプライを除外
  if (filters.excludeReplies) {
    searchParts.push('-filter:replies');
  }

  // リツイートを除外
  if (filters.excludeRetweets) {
    searchParts.push('-filter:retweets');
  }

  // 最小いいね数
  if (filters.minLikes !== null && filters.minLikes > 0) {
    searchParts.push(`min_faves:${filters.minLikes}`);
  }

  // 最小リツイート数
  if (filters.minRetweets !== null && filters.minRetweets > 0) {
    searchParts.push(`min_retweets:${filters.minRetweets}`);
  }

  // 除外ワード
  if (filters.excludeWords.enabled && filters.excludeWords.selectedWords.length > 0) {
    const excludeParts = filters.excludeWords.selectedWords.map(
      item => `-${item.word}`
    );
    searchParts.push(...excludeParts);
  }

  // 検索クエリを結合
  const searchQuery = searchParts.join(' ');

  // Twitter検索URLを構築
  return `https://twitter.com/search?q=${encodeURIComponent(searchQuery)}&f=live`;
};

/**
 * 検索クエリのプレビューテキストを生成
 */
export const buildSearchQueryPreview = (filters: EgoSearchFilters): string => {
  const searchParts: string[] = [];

  if (filters.searchKeyword.trim()) {
    searchParts.push(filters.searchKeyword.trim());
  }

  const { since } = filters.dateRange.preset === 'custom'
    ? {
        since: filters.dateRange.customStartDate,
      }
    : getDateRangeFromPreset(filters.dateRange.preset);

  if (since) {
    searchParts.push(`since:${since}`);
  }

  const mediaOperator = getMediaFilterOperator(filters.mediaFilter);
  if (mediaOperator) {
    searchParts.push(mediaOperator);
  }

  if (filters.talentAccounts.enabled && filters.talentAccounts.selectedAccounts.length > 0) {
    const talentAccounts = filters.talentAccounts.selectedAccounts;
    const fromParts: string[] = [];

    talentAccounts.forEach(talent => {
      talent.accounts.forEach(account => {
        if (account) {
          fromParts.push(`from:${account}`);
        }
      });
    });

    if (fromParts.length > 0) {
      if (fromParts.length === 1) {
        searchParts.push(fromParts[0]);
      } else {
        searchParts.push(`(${fromParts.join(' OR ')})`);
      }
    }
  }

  if (filters.excludeReplies) {
    searchParts.push('-filter:replies');
  }

  if (filters.excludeRetweets) {
    searchParts.push('-filter:retweets');
  }

  if (filters.minLikes !== null && filters.minLikes > 0) {
    searchParts.push(`min_faves:${filters.minLikes}`);
  }

  if (filters.minRetweets !== null && filters.minRetweets > 0) {
    searchParts.push(`min_retweets:${filters.minRetweets}`);
  }

  if (filters.excludeWords.enabled && filters.excludeWords.selectedWords.length > 0) {
    const excludeParts = filters.excludeWords.selectedWords.map(
      item => `-${item.word}`
    );
    searchParts.push(...excludeParts);
  }

  return searchParts.join(' ');
};
