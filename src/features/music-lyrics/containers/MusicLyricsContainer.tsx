'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { MusicLyricsState, useMusicLyricsState } from '../hooks/useMusicLyricsState';
import { loadLyricsDisplaySettings } from '../utils/lyricsDisplayStorage';
import { buildLyricsPageTitle, parseMusicId } from '../utils/lyricsPageMeta';
import MusicLyricsPresenter from '../presenters/MusicLyricsPresenter';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const createInitialState = (): MusicLyricsState => ({
  config: {
    isLoading: true,
    errorKind: null,
    isDemo: false,
  },
  data: {
    music: null,
    lyrics: null,
  },
  ui: loadLyricsDisplaySettings(),
});

/**
 * 歌詞・コール確認画面
 *
 * title / description はページの generateMetadata でサーバー出力する。
 * ここでは取得後の楽曲名でタブタイトルを更新し、デモデータ時は noindex にする。
 */
const MusicLyricsContainer: React.FC = () => {
  const [state, setState] = useState<MusicLyricsState>(createInitialState);
  const { actions } = useMusicLyricsState(state, setState);
  const { musicId: musicIdParam } = useParams<{ musicId: string }>();
  const musicId = useMemo(() => parseMusicId(musicIdParam), [musicIdParam]);
  const { loadLyrics } = actions;

  useEffect(() => {
    if (musicId === null) {
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: false, errorKind: 'notFound' },
      }));
      return;
    }
    loadLyrics(musicId);
  }, [musicId, loadLyrics]);

  useDocumentTitle(buildLyricsPageTitle(state.data.music?.title));

  // デモデータ（API 未設定時）は検索エンジンに登録させない
  useEffect(() => {
    if (!state.config.isDemo) return;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) {
      robots.content = 'noindex';
    }
  }, [state.config.isDemo]);

  return (
    <MusicLyricsPresenter
      state={state}
      actions={actions}
      onRetry={musicId !== null ? () => loadLyrics(musicId) : undefined}
    />
  );
};

export default MusicLyricsContainer;
