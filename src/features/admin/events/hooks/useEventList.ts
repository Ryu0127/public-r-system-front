import { useState, useEffect } from 'react';
import { HololiveEvent, EventListResponse } from '../../../events/events-calendar/types';
import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';

export const useEventList = () => {
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
