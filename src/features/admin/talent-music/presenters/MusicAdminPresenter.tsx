import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminMusic, MUSIC_TYPE_LABELS } from '../../talent-music-edit/types';
import { MusicType } from '../../../talent-music/types';
import MusicListTable from '../components/MusicListTable';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

interface MusicAdminPresenterProps {
  musicList: AdminMusic[];
  loading: boolean;
  error: string | null;
}

type SortType =
  | 'createdAtDesc'
  | 'createdAtAsc'
  | 'releaseDateDesc'
  | 'releaseDateAsc';

const MusicAdminPresenter: React.FC<MusicAdminPresenterProps> = ({
  musicList,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filterType, setFilterType] = useState<MusicType | 'all'>('all');
  const [sortType, setSortType] = useState<SortType>('createdAtDesc');
  const [searchQuery, setSearchQuery] = useState('');
  const [talentNameMap, setTalentNameMap] = useState<Record<number, string>>({});
  const [lastMusicAction, setLastMusicAction] = useState<
    { message: string; id: number } | null
  >(() => ((location.state as any)?.lastMusicAction as { message: string; id: number } | null) ?? null);

  useEffect(() => {
    const action = (location.state as any)?.lastMusicAction as
      | { message: string; id: number }
      | undefined;
    if (!action) return;
    setLastMusicAction(action);
    // URLは維持しつつ location.state のみクリア
    navigate('/admin/talent-music', { replace: true, state: {} });
  }, [location.state, navigate]);

  const toTimestamp = (rawDate?: string): number => {
    if (!rawDate) return 0;
    const date = new Date(rawDate);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  // タレント一覧を取得してIDと名前のマップを作成
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.talents.list, {
          method: 'GET',
          headers: getApiHeaders(),
        });
        if (!response.ok) return;
        const apiResponse = await response.json();
        if (apiResponse.success) {
          const talentData: { id: string; talentName: string }[] = apiResponse.data;
          const map: Record<number, string> = {};
          talentData.forEach((t) => {
            map[Number(t.id)] = t.talentName;
          });
          setTalentNameMap(map);
        }
      } catch (err) {
        console.error('タレント取得エラー:', err);
      }
    };
    fetchTalents();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin/talent-music/${id}/edit`);
  };

  // フィルタリングと検索
  const filteredMusicList = musicList.filter((music) => {
    const matchesType = filterType === 'all' || music.type === filterType;
    const talentNames = (music.talentIds || [])
      .map((id) => talentNameMap[id] || '')
      .join(' ');
    const matchesSearch =
      searchQuery === '' ||
      music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talentNames.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedMusicList = [...filteredMusicList].sort((a, b) => {
    switch (sortType) {
      case 'createdAtAsc':
        return toTimestamp(a.createdAt) - toTimestamp(b.createdAt) || a.id - b.id;
      case 'createdAtDesc':
        return toTimestamp(b.createdAt) - toTimestamp(a.createdAt) || b.id - a.id;
      case 'releaseDateAsc':
        return toTimestamp(a.releaseDate) - toTimestamp(b.releaseDate) || a.id - b.id;
      case 'releaseDateDesc':
        return toTimestamp(b.releaseDate) - toTimestamp(a.releaseDate) || b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">楽曲管理</h1>
            <button
              onClick={() => navigate('/admin/talent-music/new')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新規登録
            </button>
          </div>

          {/* 検索とフィルター */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="タイトルまたはタレント名で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MusicType | 'all')}
              className="px-4 py-2 border rounded"
            >
              <option value="all">すべて</option>
              <option value="original">{MUSIC_TYPE_LABELS.original}</option>
              <option value="cover">{MUSIC_TYPE_LABELS.cover}</option>
            </select>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="px-4 py-2 border rounded"
            >
              <option value="createdAtDesc">登録日: 新しい順</option>
              <option value="createdAtAsc">登録日: 古い順</option>
              <option value="releaseDateDesc">リリース日: 新しい順</option>
              <option value="releaseDateAsc">リリース日: 古い順</option>
            </select>
          </div>

          {/* 統計情報 */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="text-gray-600">
              全楽曲: <span className="font-bold">{musicList.length}</span>
            </div>
            <div className="text-gray-600">
              オリジナル曲: <span className="font-bold">{musicList.filter((m) => m.type === 'original').length}</span>
            </div>
            <div className="text-gray-600">
              カバー曲: <span className="font-bold">{musicList.filter((m) => m.type === 'cover').length}</span>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 完了メッセージ */}
        {lastMusicAction && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
            {lastMusicAction.message}（ID: {lastMusicAction.id}）
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        )}

        {/* 楽曲一覧テーブル */}
        {!loading && (
          <div className="bg-white rounded-lg shadow">
            <MusicListTable
              musicList={sortedMusicList}
              talentNameMap={talentNameMap}
              onEdit={handleEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicAdminPresenter;
