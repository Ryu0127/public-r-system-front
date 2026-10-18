import React from 'react';
import Spinner from 'components/atoms/Spinner';
import { AdminMusicPlaylist, MusicPlaylistFormData } from '../types';
import MusicPlaylistForm from '../components/MusicPlaylistForm';

interface MusicPlaylistFormPresenterProps {
  playlist?: AdminMusicPlaylist;
  isEditMode: boolean;
  loading: boolean;
  saving: boolean;
  /** 編集対象の取得に失敗（404 の場合 error は null） */
  loadFailed: boolean;
  error: string | null;
  onSave: (data: MusicPlaylistFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const MusicPlaylistFormPresenter: React.FC<MusicPlaylistFormPresenterProps> = ({
  playlist,
  isEditMode,
  loading,
  saving,
  loadFailed,
  error,
  onSave,
  onCancel,
  onDelete,
}) => {
  if (isEditMode && loadFailed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error ?? '指定されたプレイリストが見つかりませんでした'}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      )}

      {loading || (isEditMode && !playlist) ? (
        <div className="text-center py-8">
          <Spinner sizeClass="h-8 w-8" borderClass="border-b-2 border-blue-500" className="inline-block" />
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <MusicPlaylistForm
          playlist={playlist}
          saving={saving}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default MusicPlaylistFormPresenter;
