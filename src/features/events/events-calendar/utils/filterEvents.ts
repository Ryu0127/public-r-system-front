import { EventType, FilterCategory, EventsMap } from '../types';

/**
 * イベントタイプからフィルターカテゴリへのマッピング
 */
export const getEventCategory = (eventType: EventType): FilterCategory => {
  switch (eventType) {
    case 'anniversary':
    case 'birthday':
    case 'collab':
      return 'streaming';
    case 'live':
    case 'concert':
    case 'meet':
    case 'application': // イベント申込はイベントカテゴリに含める
      return 'event';
    case 'goods':
    case 'voice':
      return 'goods';
    case 'other':
    default:
      return 'streaming'; // デフォルトは配信イベント
  }
};

/**
 * フィルターに基づいてイベントマップをフィルタリング
 */
export const filterEventsMap = (
  eventsMap: EventsMap,
  selectedFilters: FilterCategory[]
): EventsMap => {
  // フィルターが選択されていない場合はすべて表示
  if (selectedFilters.length === 0) {
    return eventsMap;
  }

  const filteredMap: EventsMap = {};

  Object.keys(eventsMap).forEach((dateKey) => {
    const filteredEvents = eventsMap[dateKey].filter((event) => {
      const category = getEventCategory(event.type);
      return selectedFilters.includes(category);
    });

    if (filteredEvents.length > 0) {
      filteredMap[dateKey] = filteredEvents;
    }
  });

  return filteredMap;
};
