import React from 'react';
import { HololiveEvent } from '../../../events/events-calendar/types';
import { EVENT_TYPE_LABELS } from '../../../events/events-calendar/types/eventColors';

interface EventPreviewProps {
  event: HololiveEvent;
  onClose: () => void;
}

const EventPreview: React.FC<EventPreviewProps> = ({ event, onClose }) => {
  const getTypeLabel = (type: string) => {
    return EVENT_TYPE_LABELS[type as keyof typeof EVENT_TYPE_LABELS] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">イベントプレビュー</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-4">
          {/* サムネイル */}
          {event.thumbnailUrl && (
            <div className="w-full">
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* タイトル */}
          <div>
            <h3 className="text-2xl font-bold" style={{ color: event.color }}>
              {event.title}
            </h3>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">タレント:</span>{' '}
              <span>{event.talentNames?.join(', ') || '-'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">種別:</span>{' '}
              <span>{getTypeLabel(event.type)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">日付:</span>{' '}
              <span>
                {event.date}
                {event.endDate && ` 〜 ${event.endDate}`}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">時刻:</span>{' '}
              <span>
                {event.startTime || '未定'}
                {event.endTime && ` 〜 ${event.endTime}`}
              </span>
            </div>
          </div>

          {/* 場所 */}
          {event.location && (
            <div className="text-sm">
              <span className="font-medium text-gray-600">開催場所:</span>{' '}
              <span>{event.location}</span>
            </div>
          )}

          {/* 説明 */}
          {event.description && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">説明</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* URL */}
          {event.url && (
            <div>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                詳細はこちら →
              </a>
            </div>
          )}

          {/* 注意事項 */}
          {event.notes && event.notes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">注意事項</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {event.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* イベント申込詳細 */}
          {event.type === 'application' && event.applicationDetails && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-3">申込情報</h4>
              <div className="space-y-2 text-sm">
                {event.applicationDetails.eventDate && (
                  <div>
                    <span className="font-medium text-gray-600">イベント開催日時:</span>{' '}
                    <span>{event.applicationDetails.eventDate}</span>
                  </div>
                )}
                {event.applicationDetails.applicationStart && (
                  <div>
                    <span className="font-medium text-gray-600">申込期間:</span>{' '}
                    <span>
                      {event.applicationDetails.applicationStart}
                      {event.applicationDetails.applicationEnd &&
                        ` 〜 ${event.applicationDetails.applicationEnd}`}
                    </span>
                  </div>
                )}
                {event.applicationDetails.firstLottery && (
                  <div>
                    <span className="font-medium text-gray-600">1次抽選:</span>{' '}
                    <span>{event.applicationDetails.firstLottery}</span>
                  </div>
                )}
                {event.applicationDetails.secondLottery && (
                  <div>
                    <span className="font-medium text-gray-600">2次抽選:</span>{' '}
                    <span>{event.applicationDetails.secondLottery}</span>
                  </div>
                )}
                {event.applicationDetails.eventSiteUrl && (
                  <div>
                    <a
                      href={event.applicationDetails.eventSiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      イベントサイト →
                    </a>
                  </div>
                )}
                {event.applicationDetails.notes && event.applicationDetails.notes.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">申込注意事項:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {event.applicationDetails.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* メタ情報 */}
          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <div>ID: {event.id}</div>
            {event.createdAt && <div>作成日時: {new Date(event.createdAt).toLocaleString('ja-JP')}</div>}
            {event.updatedAt && <div>更新日時: {new Date(event.updatedAt).toLocaleString('ja-JP')}</div>}
          </div>
        </div>

        {/* フッター */}
        <div className="border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
