'use client';

import { useEffect } from 'react';

/**
 * 画面内で取得したデータに応じてタブのタイトルを更新する。
 *
 * 初期タイトルはページの metadata（サーバー出力）で設定し、
 * データ取得後にタイトルを変えたい画面だけこのフックで上書きする。
 */
export const useDocumentTitle = (title: string | null | undefined): void => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
};
