import { useState, useEffect } from 'react';
import { HololiveEvent, EventStatus } from '../../events-calendar/types';

// モックデータのインポート（後でAPI呼び出しに置き換え）
import { mockEvents } from '../../events-calendar/data/mockEvents';

export const useEventAdmin = () => {
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

  // イベントを作成
  const createEvent = async (eventData: Partial<HololiveEvent>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // const response = await fetch('/api/admin/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData),
      // });
      // const newEvent = await response.json();

      // モックの実装：新しいIDを生成して追加
      const newEvent: HololiveEvent = {
        id: `event-${Date.now()}`,
        title: eventData.title || '',
        date: eventData.date || '',
        type: eventData.type || 'other',
        talentNames: eventData.talentNames || [],
        color: eventData.color || '#000000',
        ...eventData,
      } as HololiveEvent;

      setEvents((prev) => [newEvent, ...prev]);
      return true;
    } catch (err) {
      setError('イベントの作成に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // イベントを更新
  const updateEvent = async (
    id: string,
    eventData: Partial<HololiveEvent>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // const response = await fetch(`/api/admin/events/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData),
      // });
      // const updatedEvent = await response.json();

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
            : event
        )
      );
      return true;
    } catch (err) {
      setError('イベントの更新に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // イベントを削除
  const deleteEvent = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // await fetch(`/api/admin/events/${id}`, {
      //   method: 'DELETE',
      // });

      setEvents((prev) => prev.filter((event) => event.id !== id));
      return true;
    } catch (err) {
      setError('イベントの削除に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // イベントのステータスを変更
  const changeEventStatus = async (id: string, status: EventStatus): Promise<boolean> => {
    return updateEvent(id, { status });
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
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    getEventById,
  };
};
