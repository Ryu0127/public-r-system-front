import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HololiveEvent, EventStatus } from '../../../events/events-calendar/types';
import EventListTable from '../components/EventListTable';
import EventPreview from '../../event-edit/components/EventPreview';

interface EventAdminPresenterProps {
  events: HololiveEvent[];
  loading: boolean;
  error: string | null;
  getEventById: (id: string) => HololiveEvent | undefined;
}

const EventAdminPresenter: React.FC<EventAdminPresenterProps> = ({
  events,
  loading,
  error,
  getEventById,
}) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewEventId, setPreviewEventId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/admin/events/${id}/edit`);
  };

  const handlePreview = (id: string) => {
    setPreviewEventId(id);
  };

  const handleClosePreview = () => {
    setPreviewEventId(null);
  };

  // フィルタリングと検索
  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.talentNames?.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">イベント管理</h1>
            <button
              onClick={() => navigate('/admin/events/new')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新規作成
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as EventStatus | 'all')}
                className="px-4 py-2 border rounded"
              >
                <option value="all">すべて</option>
                <option value="draft">下書き</option>
                <option value="published">公開</option>
                <option value="archived">アーカイブ</option>
              </select>
            </div>

          {/* 統計情報 */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="text-gray-600">
              全イベント: <span className="font-bold">{events.length}</span>
            </div>
            <div className="text-gray-600">
              公開: <span className="font-bold">{events.filter((e) => e.status === 'published').length}</span>
            </div>
            <div className="text-gray-600">
              下書き: <span className="font-bold">{events.filter((e) => e.status === 'draft').length}</span>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        )}

        {/* イベント一覧テーブル */}
        {!loading && (
          <div className="bg-white rounded-lg shadow">
            <EventListTable
              events={filteredEvents}
              onEdit={handleEdit}
              onPreview={handlePreview}
            />
          </div>
        )}

        {/* プレビューモーダル */}
        {previewEventId && (() => {
          const previewEvent = getEventById(previewEventId);
          return previewEvent ? (
            <EventPreview event={previewEvent} onClose={handleClosePreview} />
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default EventAdminPresenter;
