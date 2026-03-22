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
  },
  // {
  //   id: "talent-music",
  //   title: "タレント別 楽曲一覧",
  //   description: "タレントごとのオリジナル曲・カバー曲をYouTubeサムネイルで一覧表示。推しの楽曲をまとめてチェックできます！",
  //   icon: "Music",
  //   link: "/talent-music",
  //   color: "rose"
  // }
];

/**
 * ホーム画面の更新履歴データ（静的）
 */
export const HOME_CHANGE_LOGS: HomeChangeLog[] = [
  // {
  //   id: "3",
  //   version: "v1.2.0",
  //   date: "2026-03-15",
  //   changes: [
  //     "「タレント別 楽曲一覧」機能を追加"
  //   ]
  // },
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
