import React, { useCallback, useState } from 'react';
import Spinner from 'components/atoms/Spinner';
import { AdminMusicPlaylist, PlaylistMusicItem } from '../../music-playlist-edit/types';
import { AdminMusic } from '../../talent-music-edit/types';
import PlaylistMusicList from '../components/PlaylistMusicList';
import MusicCandidateList from '../components/MusicCandidateList';
import PlaylistMusicTalentModal from '../components/PlaylistMusicTalentModal';
import { PLAYLIST_MUSIC_MAX_COUNT } from '../hooks/useMusicPlaylistMusic';

interface MusicPlaylistMusicPresenterProps {
  playlist: AdminMusicPlaylist | null;
  allMusic: AdminMusic[];
  talentNameMap: Record<number, string>;
  items: PlaylistMusicItem[];
  linkedIdSet: Set<number>;
  loading: boolean;
  notFound: boolean;
  saving: boolean;
  error: string | null;
  notice: string | null;
  isDirty: boolean;
  isMaxReached: boolean;
  onAdd: (music: AdminMusic) => void;
  onRemove: (musicId: number) => void;
  onMove: (index: number, to: number) => void;
  onSetMusicTalents: (musicId: number, talentIds: number[]) => void;
  onReset: () => void;
  onSave: () => void;
  onBack: () => void;
  onEditPlaylist: () => void;
}

const MusicPlaylistMusicPresenter: React.FC<MusicPlaylistMusicPresenterProps> = ({
  playlist,
  allMusic,
  talentNameMap,
  items,
  linkedIdSet,
  loading,
  notFound,
  saving,
  error,
  notice,
  isDirty,
  isMaxReached,
  onAdd,
  onRemove,
  onMove,
  onSetMusicTalents,
  onReset,
  onSave,
  onBack,
  onEditPlaylist,
}) => {
  /** タレント編集モーダルの対象楽曲ID */
  const [editingMusicId, setEditingMusicId] = useState<number | null>(null);
  const closeTalentModal = useCallback(() => setEditingMusicId(null), []);
  const editingItem = editingMusicId != null ? items.find((m) => m.musicId === editingMusicId) ?? null : null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            指定されたプレイリストが見つかりませんでした
          </div>
          <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <Spinner sizeClass="h-8 w-8" borderClass="border-b-2 border-blue-500" className="inline-block" />
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">楽曲の紐付け</h1>
              {playlist && (
                <p className="mt-2 text-gray-700">
                  プレイリスト: <span className="font-bold">{playlist.name}</span>
                  <span className="ml-2 text-xs font-mono text-gray-500">{playlist.youtubePlaylistCode}</span>
                  {!playlist.isVisible && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">非表示</span>
                  )}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                右の楽曲一覧から追加し、左の一覧で並び順やタレントを調整して「保存」してください（最大{PLAYLIST_MUSIC_MAX_COUNT}曲）。
                追加した楽曲のタレントは、楽曲管理で紐付いているタレントが初期設定されます。
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onEditPlaylist} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">
                プレイリスト情報を編集
              </button>
              <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
                一覧へ戻る
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        {notice && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">{notice}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 紐付け済み */}
          <section className="bg-white rounded-lg shadow" aria-labelledby="linked-music-heading">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 id="linked-music-heading" className="font-bold">
                紐付けた楽曲 <span className="text-sm font-normal text-gray-500">（{items.length}曲）</span>
              </h2>
              {isDirty && <span className="text-xs font-semibold text-amber-600">未保存の変更があります</span>}
            </div>
            <PlaylistMusicList
              items={items}
              talentNameMap={talentNameMap}
              disabled={saving}
              onMove={onMove}
              onRemove={onRemove}
              onEditTalents={setEditingMusicId}
            />
          </section>

          {/* 候補 */}
          <section className="bg-white rounded-lg shadow" aria-labelledby="candidate-music-heading">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 id="candidate-music-heading" className="font-bold">
                楽曲一覧 <span className="text-sm font-normal text-gray-500">（登録済み {allMusic.length}曲）</span>
              </h2>
              {isMaxReached && (
                <p className="mt-1 text-xs text-amber-600">紐付けできる上限（{PLAYLIST_MUSIC_MAX_COUNT}曲）に達しています</p>
              )}
            </div>
            <MusicCandidateList
              allMusic={allMusic}
              talentNameMap={talentNameMap}
              linkedIdSet={linkedIdSet}
              disabled={saving}
              isMaxReached={isMaxReached}
              onAdd={onAdd}
            />
          </section>
        </div>
      </div>

      {/* 楽曲ごとのタレント編集 */}
      <PlaylistMusicTalentModal
        item={editingItem}
        talentNameMap={talentNameMap}
        onApply={onSetMusicTalents}
        onClose={closeTalentModal}
      />

      {/* 保存バー */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
          <span className="mr-auto text-sm text-gray-600">
            {isDirty ? '変更は「保存」するまで反映されません' : '保存済みの状態です'}
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={saving || !isDirty}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            変更を取り消す
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !isDirty}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlaylistMusicPresenter;
