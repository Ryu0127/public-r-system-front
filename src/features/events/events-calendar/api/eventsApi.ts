import { API_ENDPOINTS, getApiHeaders } from '../../../../config/api';
import { EventListResponse } from '../types';

/**
 * パブリックイベント一覧を取得
 */
export const fetchPublicEvents = async (): Promise<EventListResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.publicEvents.list, {
      method: 'GET',
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: EventListResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch public events:', error);
    throw error;
  }
};
