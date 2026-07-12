const SKIP_HOME_LOADING_KEY = 'skipHomeLoadingScreen';

/**
 * 次回のホーム画面表示でロード画面をスキップするようマークする
 * （サイト内の「ホームに戻る」遷移時に使用）
 */
export const markSkipHomeLoading = (): void => {
  try {
    sessionStorage.setItem(SKIP_HOME_LOADING_KEY, '1');
  } catch {
    // sessionStorage が使えない環境では通常どおりロード画面を表示する
  }
};

// ページロード内で結果を固定する（StrictMode の二重呼び出しでも同じ値を返す）
let consumedResult: boolean | null = null;

/**
 * ロード画面スキップのマークを消費（取得して削除）する
 * 同一ページロード内では常に同じ結果を返す
 * @returns スキップすべきなら true
 */
export const consumeSkipHomeLoading = (): boolean => {
  if (consumedResult !== null) {
    return consumedResult;
  }
  try {
    const marked = sessionStorage.getItem(SKIP_HOME_LOADING_KEY) != null;
    if (marked) {
      sessionStorage.removeItem(SKIP_HOME_LOADING_KEY);
    }
    consumedResult = marked;
  } catch {
    consumedResult = false;
  }
  return consumedResult;
};
