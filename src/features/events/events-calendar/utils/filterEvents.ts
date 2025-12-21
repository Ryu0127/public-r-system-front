import { FilterCategory, EventsMap } from '../types';

/**
 * フィルターに基づいてイベントマップをフィルタリング
 * selectedFiltersに含まれているtypeのイベントのみを表示
 */
export const filterEventsMap = (
  eventsMap: EventsMap,
  selectedFilters: FilterCategory[]
): EventsMap => {
  const filteredMap: EventsMap = {};

  // フィルター対象のイベントタイプ
  const filterableTypes = ['イベント申込', 'イベント当落-入金', 'live-配信チケット', 'コラボイベント', 'ポップアップストア'];

  Object.keys(eventsMap).forEach((dateKey) => {
    const filteredEvents = eventsMap[dateKey].filter((event) => {
      // フィルター対象のtypeの場合、selectedFiltersに含まれているかチェック
      if (filterableTypes.includes(event.type)) {
        return selectedFilters.includes(event.type);
      }
      // フィルター対象外のtypeは常に表示
      return true;
    });

    if (filteredEvents.length > 0) {
      filteredMap[dateKey] = filteredEvents;
    }
  });

  return filteredMap;
};
