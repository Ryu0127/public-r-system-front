'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AdminMusicPlaylist,
  LAST_PLAYLIST_ACTION_FLASH_KEY,
  MusicPlaylistFormData,
  MusicPlaylistLastAction,
} from '../types';
import { useMusicPlaylistEdit } from '../hooks/useMusicPlaylistEdit';
import MusicPlaylistFormPresenter from '../presenters/MusicPlaylistFormPresenter';
import { setNavigationFlash } from 'utils/navigationFlash';

const LIST_PATH = '/admin/music-playlists';

/**
 * プレイリスト管理（新規登録 / 編集）
 * - /admin/music-playlists/new
 * - /admin/music-playlists/:id/edit
 */
const MusicPlaylistFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { loading, saving, error, fetchPlaylistById, createPlaylist, updatePlaylist, deletePlaylist } =
    useMusicPlaylistEdit();
  const [playlist, setPlaylist] = useState<AdminMusicPlaylist | undefined>(undefined);
  /** 編集対象の取得に失敗（404 / 通信エラー）。この場合はフォームを表示しない（誤って新規登録させない） */
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const fetched = await fetchPlaylistById(id);
      if (cancelled) return;
      if (fetched) {
        setPlaylist(fetched);
      } else {
        setLoadFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchPlaylistById]);

  const backToList = (lastPlaylistAction?: MusicPlaylistLastAction) => {
    if (lastPlaylistAction) {
      setNavigationFlash(LAST_PLAYLIST_ACTION_FLASH_KEY, lastPlaylistAction);
    }
    router.push(LIST_PATH);
  };

  const handleSave = async (data: MusicPlaylistFormData) => {
    const savedId = id ? await updatePlaylist(id, data) : await createPlaylist(data);
    if (savedId != null) {
      backToList({ message: id ? 'プレイリストを更新しました' : 'プレイリストを登録しました', id: savedId });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const deletedId = await deletePlaylist(id);
    if (deletedId != null) {
      backToList({ message: 'プレイリストを削除しました', id: deletedId });
    }
  };

  return (
    <MusicPlaylistFormPresenter
      playlist={playlist}
      isEditMode={!!id}
      loading={loading}
      saving={saving}
      loadFailed={loadFailed}
      error={error}
      onSave={handleSave}
      onCancel={() => backToList()}
      onDelete={id ? handleDelete : undefined}
    />
  );
};

export default MusicPlaylistFormContainer;
