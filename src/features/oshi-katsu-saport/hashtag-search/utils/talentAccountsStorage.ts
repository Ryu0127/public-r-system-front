import { TalentAccount } from '../types/advancedSearchFilters';

const STORAGE_KEY = 'hashtag-search-talent-accounts';

/**
 * タレントアカウント情報をローカルストレージから取得
 */
export const loadTalentAccounts = (): TalentAccount[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as TalentAccount[];
  } catch (error) {
    console.error('Failed to load talent accounts from localStorage:', error);
    return [];
  }
};

/**
 * タレントアカウント情報をローカルストレージに保存
 */
export const saveTalentAccounts = (accounts: TalentAccount[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Failed to save talent accounts to localStorage:', error);
  }
};

/**
 * タレントアカウントを追加または更新
 */
export const saveTalentAccount = (account: TalentAccount): void => {
  const accounts = loadTalentAccounts();
  const index = accounts.findIndex(a => a.talentId === account.talentId);

  if (index !== -1) {
    // 既存のアカウントを更新
    accounts[index] = account;
  } else {
    // 新規アカウントを追加
    accounts.push(account);
  }

  saveTalentAccounts(accounts);
};

/**
 * タレントIDからアカウント情報を取得
 */
export const getTalentAccount = (talentId: string): TalentAccount | null => {
  const accounts = loadTalentAccounts();
  return accounts.find(a => a.talentId === talentId) || null;
};

/**
 * タレントアカウントを削除
 */
export const removeTalentAccount = (talentId: string): void => {
  const accounts = loadTalentAccounts();
  const filtered = accounts.filter(a => a.talentId !== talentId);
  saveTalentAccounts(filtered);
};

/**
 * すべてのタレントアカウント情報をクリア
 */
export const clearTalentAccounts = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
