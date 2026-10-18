import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'components/atoms/Spinner';
import { AdminMusicPlaylist, MusicPlaylistLastAction } from '../../music-playlist-edit/types';
import MusicPlaylistListTable from '../components/MusicPlaylistListTable';

interface MusicPlaylistAdminPresenterProps {
  playlists: AdminMusicPlaylist[];
  loading: boolean;
  error: string | null;
  lastAction: MusicPlaylistLastAction | null;
}

const MusicPlaylistAdminPresenter: React.FC<MusicPlaylistAdminPresenterProps> = ({
  playlists,
  loading,
  error,
  lastAction,
}) => {
  const navigate = useNavigate();
  const visibleCount = playlists.filter((p) => p.isVisible).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">プレイリスト管理</h1>
            <button
              type="button"
              onClick={() => navigate('/admin/music-playlists/new')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新規登録
            </button>
          </div>
          <p className="text-sm text-gray-600">
            楽曲一覧画面（/music）に表示するYouTubeプレイリストを管理します。「表示」のものが登録順に並びます。
          </p>

          {/* 統計情報 */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="text-gray-600">
              全プレイリスト: <span className="font-bold">{playlists.length}</span>
            </div>
            <div className="text-gray-600">
              表示: <span className="font-bold">{visibleCount}</span>
            </div>
            <div className="text-gray-600">
              非表示: <span className="font-bold">{playlists.length - visibleCount}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {lastAction && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
            {lastAction.message}（ID: {lastAction.id}）
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <Spinner sizeClass="h-8 w-8" borderClass="border-b-2 border-blue-500" className="inline-block" />
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <MusicPlaylistListTable
              playlists={playlists}
              onEdit={(id) => navigate(`/admin/music-playlists/${id}/edit`)}
              onEditMusic={(id) => navigate(`/admin/music-playlists/${id}/music`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlaylistAdminPresenter;
