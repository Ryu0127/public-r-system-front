import { TalentAccount } from '../types';

const STORAGE_KEY = 'ego-search-talent-accounts';

/**
 * タレントアカウント情報をLocalStorageに保存
 */
export const saveTalentAccount = (account: TalentAccount): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const accounts: TalentAccount[] = stored ? JSON.parse(stored) : [];

    // 既存のアカウント情報を更新または追加
    const index = accounts.findIndex(a => a.talentId === account.talentId);
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Failed to save talent account:', error);
  }
};

/**
 * 特定のタレントのアカウント情報をLocalStorageから取得
 */
export const getTalentAccount = (talentId: string): TalentAccount | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const accounts: TalentAccount[] = JSON.parse(stored);
    return accounts.find(a => a.talentId === talentId) || null;
  } catch (error) {
    console.error('Failed to get talent account:', error);
    return null;
  }
};

/**
 * すべてのタレントアカウント情報をLocalStorageから取得
 */
export const getAllTalentAccounts = (): TalentAccount[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get all talent accounts:', error);
    return [];
  }
};

/**
 * タレントアカウント情報をLocalStorageから削除
 */
export const removeTalentAccount = (talentId: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const accounts: TalentAccount[] = JSON.parse(stored);
    const filtered = accounts.filter(a => a.talentId !== talentId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove talent account:', error);
  }
};
