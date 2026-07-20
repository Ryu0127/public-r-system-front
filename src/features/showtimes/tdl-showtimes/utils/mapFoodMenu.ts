import { FoodMenuApiItem } from 'hooks/api/showtimes/useFoodMenusGetApi';
import { FoodCategory, FoodData, FoodItem } from '../types';

const DEFAULT_FOOD_NOTES = [
  '価格・内容・販売店舗は予告なく変更される場合があります。',
  '売切れ・販売休止・モバイルオーダー対応状況は、当日東京ディズニーリゾート・アプリのメニュー検索で確認するのがおすすめです。',
];

const mapCategory = (categoryType: number): FoodCategory => {
  // 1=定番 / 2=期間限定
  return categoryType === 1 ? 'std' : 'limited';
};

const formatPrice = (priceYen: number | null): string => {
  if (priceYen == null) return '';
  return `¥${priceYen.toLocaleString('ja-JP')}`;
};

/**
 * DBマスタのフードメニューを画面表示用に変換
 */
export const mapFoodMenusToFoodData = (
  foodMenus: FoodMenuApiItem[]
): FoodData => {
  const items: FoodItem[] = foodMenus
    .filter((menu) => menu.pauseFlag !== 1)
    .map((menu) => ({
      id: String(menu.id),
      category: mapCategory(menu.categoryType),
      icon: 'plate',
      name: menu.menuName,
      price: formatPrice(menu.priceYen),
      area: menu.areaTypeLabel ?? '',
      shop: menu.shopName ?? '',
      timeLimit: menu.timeLimitNote ?? '',
      thumbUrl: menu.thumbUrl ?? '',
      officialUrl: menu.officialUrl ?? '',
      contents: (menu.contents ?? [])
        .filter((content) => content.pauseFlag !== 1)
        .map((content) => content.contentName),
      publishStartDate: menu.publishStartDate,
      publishEndDate: menu.publishEndDate,
    }));

  return {
    notes: DEFAULT_FOOD_NOTES,
    items,
  };
};
