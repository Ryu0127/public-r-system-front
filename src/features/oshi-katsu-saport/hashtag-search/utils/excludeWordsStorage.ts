import { ExcludeWord } from '../types/advancedSearchFilters';

const STORAGE_KEY = 'hashtag-search-exclude-words';

/**
 * 除外ワードリストをローカルストレージから取得
 */
export const loadExcludeWords = (): ExcludeWord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as ExcludeWord[];
  } catch (error) {
    console.error('Failed to load exclude words from localStorage:', error);
    return [];
  }
};

/**
 * 除外ワードリストをローカルストレージに保存
 */
export const saveExcludeWords = (words: ExcludeWord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Failed to save exclude words to localStorage:', error);
  }
};

/**
 * 除外ワードを追加
 */
export const addExcludeWord = (word: string, category?: string): ExcludeWord => {
  const words = loadExcludeWords();
  const newWord: ExcludeWord = {
    id: Date.now().toString(),
    word,
    category,
  };
  words.push(newWord);
  saveExcludeWords(words);
  return newWord;
};

/**
 * 除外ワードを削除
 */
export const removeExcludeWord = (id: string): void => {
  const words = loadExcludeWords();
  const filtered = words.filter(w => w.id !== id);
  saveExcludeWords(filtered);
};

/**
 * 除外ワードを更新
 */
export const updateExcludeWord = (id: string, word: string, category?: string): void => {
  const words = loadExcludeWords();
  const index = words.findIndex(w => w.id === id);
  if (index !== -1) {
    words[index] = { ...words[index], word, category };
    saveExcludeWords(words);
  }
};

/**
 * すべての除外ワードをクリア
 */
export const clearExcludeWords = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
