import { useState, useEffect } from 'react';
import {
  HololiveEvent,
  EventStatus,
  EventListResponse,
  EventMutationResponse,
  EventDeleteResponse,
} from '../../../events/events-calendar/types';

// モックデータのインポート（後でAPI呼び出しに置き換え）
import {
  mockEventListResponse,
  createMockEventResponse,
  updateMockEventResponse,
  deleteMockEventResponse,
} from '../../../events/events-calendar/data/mockEvents';

export const useEventEdit = () => {
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

      // レスポンスからデータを取得（statusは既にモックデータに設定済み）
      setEvents(apiResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベントの取得に失敗しました';
      setError(errorMessage);
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
      // const apiResponse: EventMutationResponse = await response.json();

      // モックAPIレスポンスを使用
      const apiResponse: EventMutationResponse = createMockEventResponse(eventData);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'イベントの作成に失敗しました');
      }

      // レスポンスからデータを取得して state に追加
      setEvents((prev) => [apiResponse.data, ...prev]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベントの作成に失敗しました';
      setError(errorMessage);
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
      // const apiResponse: EventMutationResponse = await response.json();

      // モックAPIレスポンスを使用
      const apiResponse: EventMutationResponse = updateMockEventResponse(id, eventData);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'イベントの更新に失敗しました');
      }

      // レスポンスからデータを取得して state を更新
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? apiResponse.data : event))
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベントの更新に失敗しました';
      setError(errorMessage);
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
      // const response = await fetch(`/api/admin/events/${id}`, {
      //   method: 'DELETE',
      // });
      // const apiResponse: EventDeleteResponse = await response.json();

      // モックAPIレスポンスを使用
      const apiResponse: EventDeleteResponse = deleteMockEventResponse(id);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'イベントの削除に失敗しました');
      }

      // レスポンスから削除されたIDを確認して state を更新
      setEvents((prev) => prev.filter((event) => event.id !== apiResponse.data.id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベントの削除に失敗しました';
      setError(errorMessage);
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
