'use client';

import React, { useEffect, useState } from 'react';
import { LAST_PLAYLIST_ACTION_FLASH_KEY, MusicPlaylistLastAction } from '../../music-playlist-edit/types';
import { useMusicPlaylistList } from '../hooks/useMusicPlaylistList';
import MusicPlaylistAdminPresenter from '../presenters/MusicPlaylistAdminPresenter';
import { consumeNavigationFlash } from 'utils/navigationFlash';

const isLastAction = (value: unknown): value is MusicPlaylistLastAction =>
  !!value && typeof (value as MusicPlaylistLastAction).message === 'string';

/**
 * プレイリスト管理（一覧）
 */
const MusicPlaylistAdminContainer: React.FC = () => {
  const { playlists, loading, error } = useMusicPlaylistList();
  const [lastAction, setLastAction] = useState<MusicPlaylistLastAction | null>(null);

  // 登録・更新・削除後の完了メッセージを受け取る（受け取り時に破棄されるため、再読み込みで再表示しない）
  useEffect(() => {
    const action = consumeNavigationFlash<unknown>(LAST_PLAYLIST_ACTION_FLASH_KEY);
    if (isLastAction(action)) {
      setLastAction(action);
    }
  }, []);

  return (
    <MusicPlaylistAdminPresenter
      playlists={playlists}
      loading={loading}
      error={error}
      lastAction={lastAction}
    />
  );
};

export default MusicPlaylistAdminContainer;
