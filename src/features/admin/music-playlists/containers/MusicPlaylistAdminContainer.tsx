import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MusicPlaylistLastAction } from '../../music-playlist-edit/types';
import { useMusicPlaylistList } from '../hooks/useMusicPlaylistList';
import MusicPlaylistAdminPresenter from '../presenters/MusicPlaylistAdminPresenter';

const readLastAction = (state: unknown): MusicPlaylistLastAction | null => {
  const action = (state as { lastPlaylistAction?: MusicPlaylistLastAction } | null)?.lastPlaylistAction;
  return action && typeof action.message === 'string' ? action : null;
};

/**
 * プレイリスト管理（一覧）
 */
const MusicPlaylistAdminContainer: React.FC = () => {
  const { playlists, loading, error } = useMusicPlaylistList();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState<MusicPlaylistLastAction | null>(() =>
    readLastAction(location.state)
  );

  // 登録・更新・削除後の完了メッセージを受け取り、location.state はクリア（再読み込みで再表示しない）
  useEffect(() => {
    const action = readLastAction(location.state);
    if (!action) return;
    setLastAction(action);
    navigate('/admin/music-playlists', { replace: true, state: {} });
  }, [location.state, navigate]);

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
