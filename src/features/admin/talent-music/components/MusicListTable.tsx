import React from 'react';
import { AdminMusic, MUSIC_TYPE_LABELS } from '../../talent-music-edit/types';

interface MusicListTableProps {
  musicList: AdminMusic[];
  talentNameMap: Record<number, string>;
  onEdit: (id: string) => void;
}

const MusicListTable: React.FC<MusicListTableProps> = ({
  musicList,
  talentNameMap,
  onEdit,
}) => {
  const YOUTUBE_THUMBNAIL_URL = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  const handleThumbError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const wrapper = img.closest('div[data-thumb-wrapper]');
    if (!wrapper) return;
    const fallback = wrapper.querySelector('div[data-thumb-fallback]') as HTMLDivElement | null;
    if (fallback) {
      fallback.style.display = 'flex';
    }
    img.style.display = 'none';
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'original':
        return 'bg-blue-100 text-blue-800';
      case 'cover':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTalentNames = (talentIds: number[]): string => {
    if (!talentIds || talentIds.length === 0) return '-';
    return talentIds
      .map((id) => talentNameMap[id] || `ID:${id}`)
      .join(', ');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">ID</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">YouTube動画</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">タイトル</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">リリース日</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">種別</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">タレント</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {musicList.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                楽曲がありません
              </td>
            </tr>
          ) : (
            musicList.map((music) => (
              <tr key={music.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm">{music.id}</td>
                <td className="px-4 py-2 border-b text-sm">
                  {music.youtubeVideoId ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.youtube.com/watch?v=${music.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div
                          data-thumb-wrapper
                          className="w-20 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200"
                        >
                          <img
                            src={YOUTUBE_THUMBNAIL_URL(music.youtubeVideoId)}
                            alt={music.title}
                            className="w-full h-full object-cover"
                            onError={handleThumbError}
                          />
                          <div
                            data-thumb-fallback
                            className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 text-xs text-red-500"
                          >
                            YouTube
                          </div>
                        </div>
                      </a>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-2 border-b text-sm font-medium">{music.title}</td>
                <td className="px-4 py-2 border-b text-sm">{music.releaseDate}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(music.type)}`}
                  >
                    {MUSIC_TYPE_LABELS[music.type] || music.type}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-sm">{getTalentNames(music.talentIds)}</td>
                <td className="px-4 py-2 border-b text-sm">
                  <button
                    onClick={() => onEdit(music.id.toString())}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  >
                    編集
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MusicListTable;
