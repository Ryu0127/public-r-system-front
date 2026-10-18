import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { MusicLyricsState, useMusicLyricsState } from '../hooks/useMusicLyricsState';
import { loadLyricsDisplaySettings } from '../utils/lyricsDisplayStorage';
import MusicLyricsPresenter from '../presenters/MusicLyricsPresenter';

const SITE_NAME = 'ホロリスの推し活サポート';

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

/** URL パラメータを正の整数の楽曲IDに変換（不正値は null） */
const parseMusicId = (raw: string | undefined): number | null => {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};

/**
 * 歌詞・コール確認画面
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

  const musicTitle = state.data.music?.title;
  const pageTitle = musicTitle
    ? `${musicTitle} 歌詞・コール | ${SITE_NAME}`
    : `歌詞・コール確認 | ${SITE_NAME}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="楽曲の歌詞とライブで入れるコールを一緒に確認できます。表示モードの切り替えや文字サイズの変更にも対応。"
        />
        <meta name="robots" content={state.config.isDemo ? 'noindex' : 'index, follow'} />
      </Helmet>
      <MusicLyricsPresenter
        state={state}
        actions={actions}
        onRetry={musicId !== null ? () => loadLyrics(musicId) : undefined}
      />
    </>
  );
};

export default MusicLyricsContainer;
