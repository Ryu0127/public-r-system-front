import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';
import { EventListResponse, HololiveEvent } from '../types';

/**
 * パブリックイベント一覧を取得
 */
export const fetchPublicEvents = async (): Promise<EventListResponse> => {
  try {
    console.log('🔍 API呼び出し - URL:', API_ENDPOINTS.publicEvents.list);

    const response = await fetch(API_ENDPOINTS.publicEvents.list, {
      method: 'GET',
      headers: getApiHeaders(),
    });

    console.log('🔍 APIレスポンス - ステータス:', response.status);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const rawData = await response.json();
    console.log('🔍 APIレスポンス - 生データ:', rawData);

    // レスポンスの形式を柔軟に処理
    let eventsData: HololiveEvent[];

    if (Array.isArray(rawData)) {
      // 直接配列が返される場合
      eventsData = rawData;
      console.log('🔍 レスポンス形式: 直接配列');
    } else if (rawData.data && Array.isArray(rawData.data)) {
      // { data: [...] } 形式の場合
      eventsData = rawData.data;
      console.log('🔍 レスポンス形式: data プロパティ内の配列');
    } else {
      console.error('🔍 予期しないレスポンス形式:', rawData);
      throw new Error('Unexpected API response format');
    }

    console.log('🔍 抽出したイベントデータ:', eventsData);

    // イベントデータを正規化（IDを文字列に変換）
    const normalizedEvents: HololiveEvent[] = eventsData.map((event: any) => ({
      ...event,
      id: String(event.id), // IDを文字列に変換
    }));

    console.log('🔍 正規化したイベントデータ:', normalizedEvents);

    // EventListResponse形式に変換して返す
    const result: EventListResponse = {
      success: true,
      data: normalizedEvents,
      message: rawData.message || 'イベント一覧を取得しました',
    };

    return result;
  } catch (error) {
    console.error('Failed to fetch public events:', error);
    throw error;
  }
};
