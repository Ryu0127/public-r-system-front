import { useState, useEffect } from 'react';
import {
  HololiveEvent,
  EventStatus,
  EventListResponse,
  EventMutationResponse,
  EventDeleteResponse,
} from '../../../events/events-calendar/types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useEventEdit = () => {
  const [events, setEvents] = useState<HololiveEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // イベント一覧を取得
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.events.list, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: EventListResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'イベントの取得に失敗しました');
      }

      // レスポンスからデータを取得
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
      const response = await fetch(API_ENDPOINTS.events.create, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: EventMutationResponse = await response.json();

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
      const response = await fetch(API_ENDPOINTS.events.update(id), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: EventMutationResponse = await response.json();

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
      const response = await fetch(API_ENDPOINTS.events.delete(id), {
        method: 'DELETE',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: EventDeleteResponse = await response.json();

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
