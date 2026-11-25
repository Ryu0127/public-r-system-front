# public-r-system-front

ホロリスの推し活サポート フロントエンド（Next.js App Router）

## 動作環境

- Node.js 20.9 以上（Docker イメージは node:22-alpine）

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番ビルド（`.next/`） |
| `npm run start` | 本番ビルドの起動 |
| `npm run lint` | ESLint（eslint-config-next） |

## 環境変数

`.env.example` を参照。`NEXT_PUBLIC_*` はビルド時に埋め込まれる。

| 変数 | 内容 |
|---|---|
| `NEXT_PUBLIC_API_DOMAIN` | API のベースURL（例: `http://localhost:8000/api`） |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google アナリティクスの測定ID |

CRA 時代の `REACT_APP_API_DOMAIN` / `REACT_APP_GA_MEASUREMENT_ID` も `next.config.mjs` でフォールバックとして読み込む（移行期間の互換措置）。

## ディレクトリ構成

```
src/
  app/          ルーティング（page.tsx = 画面、layout.tsx = 共通レイアウト、メタデータ）
  features/     画面ごとの Container / Presenter / hooks（従来どおり）
  components/   共通コンポーネント（ClientOnly, AnalyticsTracker など）
  hooks/        API・認証・ナビゲーション用フック
  config/       API 設定、サイト定数、メタデータ生成
  og/           /music の OGP 定義
public/         静的ファイル（event/ の静的HTML、OGP 画像、sitemap.xml、robots.txt）
```

## 実装方針

- **メタデータ（title / description / OGP / canonical）はサーバー側で出力する**
  - 各 `src/app/**/page.tsx` の `metadata` / `generateMetadata`（共通処理は `config/metadata.ts`）
  - `/music?talent=...` はクエリに応じた OGP を返す（旧 vercel.json の User-Agent 判定 + `public/og/*.html` は廃止）
  - `/music/[musicId]/lyrics` は API から楽曲名を取得してタイトルに含める（取得失敗時は汎用タイトル）
- **画面本体は `ClientOnly` でブラウザ描画する**
  - 既存画面は描画時に localStorage / window / 現在時刻を参照するため、サーバー描画するとハイドレーション不一致になる
  - `/event/[slug]` のみサーバー描画（ビルド時に静的生成）
- **画面遷移**: `next/navigation`（`useRouter` / `useParams`）、クエリ操作は `hooks/navigation/useSearchParamsState`
- **遷移時の一回限りメッセージ**（旧 `navigate(path, { state })`）: `utils/navigationFlash`
- **ログイン後の戻り先**: `/login?from=/admin/...`（`utils/redirectPath` でサイト内パスのみ許可）
- **リダイレクト**: `next.config.mjs` の `redirects()`（`/talent-music` → `/music` など）

## イベントページの追加

1. `public/event/<slug>/index.html` を配置
2. `src/features/simple-pages/data/simplePages.ts` にエントリを追加（ビルド時に `/event/<slug>` が静的生成される）
