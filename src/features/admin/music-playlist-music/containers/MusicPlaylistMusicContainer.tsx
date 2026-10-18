import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMusicPlaylistMusic } from '../hooks/useMusicPlaylistMusic';
import MusicPlaylistMusicPresenter from '../presenters/MusicPlaylistMusicPresenter';

const LIST_PATH = '/admin/music-playlists';
const LEAVE_CONFIRM_MESSAGE = '保存していない変更があります。破棄して移動しますか？';

/**
 * プレイリスト管理 - 楽曲の紐付け
 * /admin/music-playlists/:id/music
 */
const MusicPlaylistMusicContainer: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useMusicPlaylistMusic(id);
  const { isDirty } = state;

  // 未保存の変更がある状態でのリロード・タブを閉じる操作を確認
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const navigateWithConfirm = (path: string) => {
    if (isDirty && !window.confirm(LEAVE_CONFIRM_MESSAGE)) return;
    navigate(path);
  };

  const handleReset = () => {
    if (window.confirm('保存していない変更を取り消して、保存済みの状態に戻しますか？')) {
      state.resetChanges();
    }
  };

  return (
    <MusicPlaylistMusicPresenter
      playlist={state.playlist}
      allMusic={state.allMusic}
      talentNameMap={state.talentNameMap}
      items={state.items}
      linkedIdSet={state.linkedIdSet}
      loading={state.loading}
      notFound={state.notFound}
      saving={state.saving}
      error={state.error}
      notice={state.notice}
      isDirty={isDirty}
      isMaxReached={state.isMaxReached}
      onAdd={state.addMusic}
      onRemove={state.removeMusic}
      onMove={state.moveMusic}
      onSetMusicTalents={state.setMusicTalents}
      onReset={handleReset}
      onSave={state.save}
      onBack={() => navigateWithConfirm(LIST_PATH)}
      onEditPlaylist={() => navigateWithConfirm(`${LIST_PATH}/${id}/edit`)}
    />
  );
};

export default MusicPlaylistMusicContainer;
