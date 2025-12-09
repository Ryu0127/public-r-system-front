import React from 'react';
import { HololiveEvent } from '../../events-calendar/types';

interface EventListTableProps {
  events: HololiveEvent[];
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}

const EventListTable: React.FC<EventListTableProps> = ({
  events,
  onEdit,
  onPreview,
}) => {
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'published':
        return '公開';
      case 'draft':
        return '下書き';
      case 'archived':
        return 'アーカイブ';
      default:
        return '公開';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      anniversary: '記念配信',
      live: 'ライブ',
      concert: 'コンサート',
      meet: 'ミート',
      collab: 'コラボ',
      birthday: '誕生日',
      goods: 'グッズ',
      voice: 'ボイス',
      application: '申込',
      other: 'その他',
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">ID</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">タイトル</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">タレント</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">種別</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">日付</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">状態</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                イベントがありません
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm">{event.id.slice(0, 8)}</td>
                <td className="px-4 py-2 border-b text-sm font-medium">{event.title}</td>
                <td className="px-4 py-2 border-b text-sm">{event.talentNames?.join(', ') || '-'}</td>
                <td className="px-4 py-2 border-b text-sm">{getTypeLabel(event.type)}</td>
                <td className="px-4 py-2 border-b text-sm">
                  {event.date}
                  {event.startTime && ` ${event.startTime}`}
                </td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                      event.status
                    )}`}
                  >
                    {getStatusLabel(event.status)}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPreview(event.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      プレビュー
                    </button>
                    <button
                      onClick={() => onEdit(event.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                    >
                      編集
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventListTable;
