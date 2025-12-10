import { useState, useEffect } from 'react';
import { HololiveEvent, EventStatus } from '../../../events/events-calendar/types';

// モックデータのインポート（後でAPI呼び出しに置き換え）
import { mockEvents } from '../../../events/events-calendar/data/mockEvents';

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
      // const data = await response.json();

      // モックデータを使用（statusを追加）
      const eventsWithStatus = mockEvents.map((event, index) => ({
        ...event,
        status: (index % 3 === 0 ? 'draft' : index % 3 === 1 ? 'published' : 'archived') as EventStatus,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      }));

      setEvents(eventsWithStatus);
    } catch (err) {
      setError('イベントの取得に失敗しました');
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
