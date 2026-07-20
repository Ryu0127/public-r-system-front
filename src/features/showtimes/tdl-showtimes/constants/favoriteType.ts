/** お気に入り種別（API favoriteType と一致） */
export const FAVORITE_TYPE = {
  SHOW_PARADE: 1,
  ATTRACTION: 2,
  FOOD_MENU: 3,
} as const;

export type FavoriteType = (typeof FAVORITE_TYPE)[keyof typeof FAVORITE_TYPE];
