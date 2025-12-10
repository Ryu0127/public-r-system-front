import { useState, useEffect } from 'react';
import { HololiveEvent, EventStatus, EventListResponse } from '../../../events/events-calendar/types';

// モックデータのインポート（後でAPI呼び出しに置き換え）
import { mockEventListResponse } from '../../../events/events-calendar/data/mockEvents';

export const useEventList = () => {
  const [events, setEvents] = useState<HololiveEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // イベント一覧を取得
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // const response = await fetch('/api/admin/events');
      // const apiResponse: EventListResponse = await response.json();

      // モックAPIレスポンスを使用
      const apiResponse: EventListResponse = mockEventListResponse;

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'イベントの取得に失敗しました');
      }

      // レスポンスからデータを取得し、statusを追加
      const eventsWithStatus = apiResponse.data.map((event, index) => ({
        ...event,
        status: (index % 3 === 0 ? 'draft' : index % 3 === 1 ? 'published' : 'archived') as EventStatus,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      }));

      setEvents(eventsWithStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベントの取得に失敗しました';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // IDでイベントを取得
  const getEventById = (id: string): HololiveEvent | undefined => {
    return events.find((event) => event.id === id);
  };

  // 初期データの取得
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    getEventById,
  };
};
