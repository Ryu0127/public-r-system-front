import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';

/**
 * ホーム画面の機能一覧データ（静的）
 */
export const HOME_FEATURES: HomeFeature[] = [
  {
    id: "talent-hashtag-support",
    title: "タレント別 ハッシュタグ投稿/検索 サポート",
    description: "タレントごとの応援ハッシュタグを選択して、ハッシュタグ投稿や検索をもっと楽しくできるようにサポートします！",
    icon: "Hash",
    link: "/talent-hashtag-support",
    color: "amber"
  },
  {
    id: "ego-search-support",
    title: "エゴサーチ サポート",
    description: "タレントごとのエゴサワードや詳細検索を設定でき、エゴサをもっと楽しくできるようにサポートします！",
    icon: "Search",
    link: "/ego-search-support",
    color: "amber"
  }
];

/**
 * ホーム画面の更新履歴データ（静的）
 */
export const HOME_CHANGE_LOGS: HomeChangeLog[] = [
  {
    id: "2",
    version: "v1.1.0",
    date: "2025-12-21",
    changes: [
      "「エゴサーチ サポート」機能を追加"
    ]
  },
  {
    id: "1",
    version: "v1.0.0",
    date: "2025-11-15",
    changes: [
      "サイトリリース",
      "「タレント別 ハッシュタグ投稿/検索 サポート」機能を追加"
    ]
  }
];
