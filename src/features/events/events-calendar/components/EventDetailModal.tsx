import React, { useEffect } from 'react';
import { HololiveEvent } from '../types';

interface EventDetailModalProps {
  event: HololiveEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * イベントタイプのアイコンを取得
 */
const getEventTypeIcon = (type: HololiveEvent['type']): string => {
  switch (type) {
    case 'anniversary':
      return '🎉';
    case 'live':
      return '🎤';
    case 'concert':
      return '🎵';
    case 'meet':
      return '🤝';
    case 'collab':
      return '👥';
    case 'birthday':
      return '🎂';
    case 'goods':
      return '🛍️';
    case 'voice':
      return '🎧';
    case 'application':
      return '📝';
    default:
      return '📅';
  }
};

/**
 * イベントタイプの表示名を取得
 */
const getEventTypeName = (type: HololiveEvent['type']): string => {
  switch (type) {
    case 'anniversary':
      return '記念配信';
    case 'live':
      return 'ライブ';
    case 'concert':
      return 'コンサート';
    case 'meet':
      return 'リアルイベント';
    case 'collab':
      return 'コラボ配信';
    case 'birthday':
      return '誕生日配信';
    case 'goods':
      return 'グッズ';
    case 'voice':
      return 'ボイス';
    case 'application':
      return 'イベント申込';
    default:
      return 'その他';
  }
};

/**
 * 日付をフォーマット（yyyy年MM月dd日）
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * イベント詳細モーダルコンポーネント
 */
const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  // モーダル表示中のbodyスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="relative">
          {/* サムネイル画像 */}
          {event.thumbnailUrl ? (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-3xl overflow-hidden">
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-full h-64 rounded-t-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${event.color}40, ${event.color}80)`,
              }}
            >
              <span className="text-8xl">{getEventTypeIcon(event.type)}</span>
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* モーダルボディ */}
        <div className="p-6">
          {/* イベントタイプバッジ */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: event.color + '20',
                color: event.color,
              }}
            >
              <span>{getEventTypeIcon(event.type)}</span>
              <span>{getEventTypeName(event.type)}</span>
            </span>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>

          {/* タレント名 */}
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700 font-medium">{event.talentName}</span>
          </div>

          {/* 日時情報 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-gray-700">
                {event.endDate ? (
                  <>
                    {formatDate(event.date)} 〜 {formatDate(event.endDate)}
                  </>
                ) : (
                  formatDate(event.date)
                )}
                {event.startTime && (
                  <div className="text-sm text-gray-600 mt-1">
                    {event.startTime}
                    {event.endTime && ` 〜 ${event.endTime}`}
                  </div>
                )}
              </div>
            </div>

            {/* 場所 */}
            {event.location && (
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1">
                  <span className="text-gray-700">{event.location}</span>
                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      MAPで確認
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 説明文 */}
          {event.description && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* 注意事項 */}
          {event.type === 'application' && event.applicationDetails?.notes && event.applicationDetails.notes.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>重要なお知らせ</span>
              </h3>
              <div className="space-y-1">
                {event.applicationDetails.notes.map((note, index) => (
                  <p key={index} className="text-red-700 text-sm leading-relaxed">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* イベント申込詳細情報 */}
          {event.type === 'application' && event.applicationDetails && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span>
                <span>申込詳細情報</span>
              </h3>

              <div className="space-y-2 text-sm">
                {event.applicationDetails.eventDate && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">イベント開催:</span>
                    <span className="text-gray-800">{event.applicationDetails.eventDate}</span>
                  </div>
                )}

                {event.applicationDetails.applicationStart && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">申込開始:</span>
                    <span className="text-gray-800">{event.applicationDetails.applicationStart}</span>
                  </div>
                )}

                {event.applicationDetails.applicationEnd && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">申込終了:</span>
                    <span className="text-gray-800">{event.applicationDetails.applicationEnd}</span>
                  </div>
                )}

                {event.applicationDetails.firstLottery && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">1次抽選:</span>
                    <span className="text-gray-800">{event.applicationDetails.firstLottery}</span>
                  </div>
                )}

                {event.applicationDetails.secondLottery && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">2次抽選:</span>
                    <span className="text-gray-800">{event.applicationDetails.secondLottery}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          {(event.url || event.applicationDetails?.eventSiteUrl) && (
            <div className="flex">
              {/* イベントサイトへのリンクボタン */}
              <a
                href={event.applicationDetails?.eventSiteUrl || event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: event.color,
                }}
              >
                <span>
                  {event.type === 'application' ? 'イベントサイトへ' : '詳細を見る'}
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
