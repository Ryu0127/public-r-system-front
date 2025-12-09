import React, { useState } from 'react';
import { HololiveEvent, EventStatus } from '../../events-calendar/types';
import EventListTable from '../components/EventListTable';
import EventForm from '../components/EventForm';
import EventPreview from '../components/EventPreview';

interface EventAdminPresenterProps {
  events: HololiveEvent[];
  loading: boolean;
  error: string | null;
  onCreateEvent: (eventData: Partial<HololiveEvent>) => Promise<boolean>;
  onUpdateEvent: (id: string, eventData: Partial<HololiveEvent>) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<boolean>;
  onStatusChange: (id: string, status: EventStatus) => Promise<boolean>;
  getEventById: (id: string) => HololiveEvent | undefined;
}

type ViewMode = 'list' | 'create' | 'edit' | 'preview';

const EventAdminPresenter: React.FC<EventAdminPresenterProps> = ({
  events,
  loading,
  error,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onStatusChange,
  getEventById,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (id: string) => {
    setSelectedEventId(id);
    setViewMode('edit');
  };

  const handleDelete = async (id: string) => {
    const success = await onDeleteEvent(id);
    if (success) {
      alert('イベントを削除しました');
    }
  };

  const handlePreview = (id: string) => {
    setSelectedEventId(id);
    setViewMode('preview');
  };

  const handleSave = async (eventData: Partial<HololiveEvent>) => {
    let success = false;
    if (viewMode === 'create') {
      success = await onCreateEvent(eventData);
      if (success) {
        alert('イベントを作成しました');
        setViewMode('list');
      }
    } else if (viewMode === 'edit' && selectedEventId) {
      success = await onUpdateEvent(selectedEventId, eventData);
      if (success) {
        alert('イベントを更新しました');
        setViewMode('list');
        setSelectedEventId(null);
      }
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedEventId(null);
  };

  const handleClosePreview = () => {
    setViewMode('list');
    setSelectedEventId(null);
  };

  // フィルタリングと検索
  const filteredEvents = events.filter((event) => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.talentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // リストビュー
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">イベント管理</h1>
              <button
                onClick={() => setViewMode('create')}
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
                onDelete={handleDelete}
                onStatusChange={onStatusChange}
                onPreview={handlePreview}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // フォームビュー（新規作成・編集）
  if (viewMode === 'create' || viewMode === 'edit') {
    const editingEvent = selectedEventId ? getEventById(selectedEventId) : undefined;
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <EventForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
      </div>
    );
  }

  // プレビュービュー
  if (viewMode === 'preview' && selectedEventId) {
    const previewEvent = getEventById(selectedEventId);
    if (previewEvent) {
      return <EventPreview event={previewEvent} onClose={handleClosePreview} />;
    }
  }

  return null;
};

export default EventAdminPresenter;
