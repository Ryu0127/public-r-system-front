import { useCallback, useMemo, useRef, Dispatch, SetStateAction } from 'react';
import { LyricsDisplayMode, LyricsFontSize, LyricsMusic, MusicLyrics } from '../types';
import { saveLyricsDisplaySettings } from '../utils/lyricsDisplayStorage';
import {
  MusicLyricsErrorKind,
  useMusicLyricsGetApi,
} from 'hooks/api/talent-music/useMusicLyricsGetApi';

export interface MusicLyricsState {
  config: {
    isLoading: boolean;
    errorKind: MusicLyricsErrorKind | null;
    isDemo: boolean;
  };
  data: {
    music: LyricsMusic | null;
    lyrics: MusicLyrics | null;
  };
  ui: {
    mode: LyricsDisplayMode;
    fontSize: LyricsFontSize;
    isVideoVisible: boolean;
  };
}

export interface MusicLyricsActions {
  loadLyrics: (musicId: number) => void;
  setMode: (mode: LyricsDisplayMode) => void;
  setFontSize: (fontSize: LyricsFontSize) => void;
  toggleVideoVisible: () => void;
}

export const useMusicLyricsState = (
  state: MusicLyricsState,
  setState: Dispatch<SetStateAction<MusicLyricsState>>
): { actions: MusicLyricsActions } => {
  const { executeMusicLyricsGet } = useMusicLyricsGetApi();
  const fetchSeqRef = useRef(0);

  const loadLyrics = useCallback(
    async (musicId: number) => {
      const seq = ++fetchSeqRef.current;
      setState((prev) => ({
        ...prev,
        config: { ...prev.config, isLoading: true, errorKind: null, isDemo: false },
        data: { music: null, lyrics: null },
      }));

      const { apiResponse, errorKind } = await executeMusicLyricsGet(musicId);
      if (seq !== fetchSeqRef.current) return;

      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          isLoading: false,
          errorKind,
          isDemo: apiResponse?.data.isDemo === true,
        },
        data: {
          music: apiResponse?.data.music ?? null,
          lyrics: apiResponse?.data.lyrics ?? null,
        },
      }));
    },
    [setState, executeMusicLyricsGet]
  );

  /** UI 設定を更新し、localStorage にも保存 */
  const updateUi = useCallback(
    (patch: (ui: MusicLyricsState['ui']) => Partial<MusicLyricsState['ui']>) => {
      setState((prev) => {
        const nextUi = { ...prev.ui, ...patch(prev.ui) };
        saveLyricsDisplaySettings(nextUi);
        return { ...prev, ui: nextUi };
      });
    },
    [setState]
  );

  const setMode = useCallback(
    (mode: LyricsDisplayMode) => updateUi(() => ({ mode })),
    [updateUi]
  );

  const setFontSize = useCallback(
    (fontSize: LyricsFontSize) => updateUi(() => ({ fontSize })),
    [updateUi]
  );

  const toggleVideoVisible = useCallback(
    () => updateUi((ui) => ({ isVideoVisible: !ui.isVideoVisible })),
    [updateUi]
  );

  const actions = useMemo<MusicLyricsActions>(
    () => ({
      loadLyrics,
      setMode,
      setFontSize,
      toggleVideoVisible,
    }),
    [loadLyrics, setMode, setFontSize, toggleVideoVisible]
  );

  return { actions };
};
