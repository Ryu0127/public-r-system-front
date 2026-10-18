import React from 'react';
import { AdminMusicPlaylist } from '../../music-playlist-edit/types';
import { buildYoutubePlaylistUrl } from '../../music-playlist-edit/utils/youtubePlaylistCode';

interface MusicPlaylistListTableProps {
  playlists: AdminMusicPlaylist[];
  onEdit: (id: number) => void;
  onEditMusic: (id: number) => void;
}

const formatDateTime = (raw?: string | null): string => {
  if (!raw) return '-';
  const date = new Date(raw.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return raw;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const MusicPlaylistListTable: React.FC<MusicPlaylistListTableProps> = ({ playlists, onEdit, onEditMusic }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">ID</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">プレイリスト名</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">YouTubeプレイリストID</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">楽曲数</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">表示</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">更新日時</th>
          <th className="px-4 py-2 border-b text-left text-sm font-medium">操作</th>
        </tr>
      </thead>
      <tbody>
        {playlists.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
              プレイリストがありません
            </td>
          </tr>
        ) : (
          playlists.map((playlist) => (
            <tr key={playlist.id} className={`hover:bg-gray-50 ${playlist.isVisible ? '' : 'text-gray-400'}`}>
              <td className="px-4 py-2 border-b text-sm">{playlist.id}</td>
              <td className="px-4 py-2 border-b text-sm font-medium">{playlist.name}</td>
              <td className="px-4 py-2 border-b text-sm">
                <a
                  href={buildYoutubePlaylistUrl(playlist.youtubePlaylistCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 hover:underline break-all"
                >
                  {playlist.youtubePlaylistCode}
                </a>
              </td>
              <td className="px-4 py-2 border-b text-sm">
                {playlist.musicCount != null ? `${playlist.musicCount}曲` : '-'}
              </td>
              <td className="px-4 py-2 border-b">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    playlist.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {playlist.isVisible ? '表示' : '非表示'}
                </span>
              </td>
              <td className="px-4 py-2 border-b text-sm whitespace-nowrap">{formatDateTime(playlist.updatedAt)}</td>
              <td className="px-4 py-2 border-b text-sm whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(playlist.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => onEditMusic(playlist.id)}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  楽曲の紐付け
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default MusicPlaylistListTable;
