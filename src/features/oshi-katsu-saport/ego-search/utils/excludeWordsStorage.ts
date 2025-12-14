import { ExcludeWord } from '../types';

const STORAGE_KEY = 'ego-search-exclude-words';

/**
 * 除外ワードをLocalStorageに保存
 */
export const saveExcludeWords = (words: ExcludeWord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Failed to save exclude words:', error);
  }
};

/**
 * 除外ワードをLocalStorageから取得
 */
export const getExcludeWords = (): ExcludeWord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get exclude words:', error);
    return [];
  }
};

/**
 * 除外ワードを追加
 */
export const addExcludeWord = (word: ExcludeWord): void => {
  try {
    const words = getExcludeWords();
    words.push(word);
    saveExcludeWords(words);
  } catch (error) {
    console.error('Failed to add exclude word:', error);
  }
};

/**
 * 除外ワードを削除
 */
export const removeExcludeWord = (id: string): void => {
  try {
    const words = getExcludeWords();
    const filtered = words.filter(w => w.id !== id);
    saveExcludeWords(filtered);
  } catch (error) {
    console.error('Failed to remove exclude word:', error);
  }
};
