import { HomeFeature } from 'hooks/api/home/useHomeFeaturesGetApi';
import { HomeChangeLog } from 'hooks/api/home/useHomeChangeLogsGetApi';

/**
 * ホーム画面の機能一覧データ（静的）
 */
export const HOME_FEATURES: HomeFeature[] = [
  {
    id: "talent-hashtag-support",
    title: "タレント別 ハッシュタグ投稿/検索 サポート",
    description: "各タレントごとの応援ハッシュタグを選択して投稿/検索のサポートができます",
    icon: "Hash",
    link: "/talent-hashtag-support",
    color: "amber"
  },
  {
    id: "ego-search-support",
    title: "エゴサーチ サポート",
    description: "タレントのエゴサーチをサポートします。検索ワードやアカウント情報を確認できます",
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
