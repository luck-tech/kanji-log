## kanji-log 技術スタック / プロジェクト概要

このリポジトリは Expo（React Native）をベースに、`expo-router` を用いたファイルベースルーティングで画面遷移を実装したモバイル/ウェブ対応アプリです。共通 UI は React Native の `StyleSheet` とカスタムのデザイン定数（`Colors`/`Typography`/`Layout`）で統一されています。

### 主要バージョン
- **Expo SDK**: 53
- **React**: 19
- **React Native**: 0.79
- **TypeScript**: 5.8（`strict: true`）


## 技術スタック（カテゴリ別）

### ルーティング / ナビゲーション
- **expo-router**: `~5.0.2`
  - ルーティングエントリ: `package.json` の `main: "expo-router/entry"`
  - 画面スタック: `Stack`（`app/_layout.tsx`、`app/(onboarding)/_layout.tsx`）
  - タブナビゲーション: `Tabs`（`app/(tabs)/_layout.tsx`）
  - ルートグループ: `(onboarding)`, `(tabs)` で画面領域を分割
  - 型付きルート: `app.json` の `experiments.typedRoutes: true`
- **React Navigation 7** 系: `@react-navigation/native`, `@react-navigation/bottom-tabs`
  - expo-router が内部で React Navigation を利用（直接利用も可能）

### UI / スタイリング
- **React Native StyleSheet** による設計
  - `constants/Colors.ts`: カラーパレット（`primary`/`secondary`/`accent`/`gray` 等）
  - `constants/Typography.ts`: 見出し/本文/ボタン/ラベルのタイポグラフィ
  - `constants/Layout.ts`: スペーシング・パディング・角丸・画面サイズ
- 共通コンポーネント（`components/common`）
  - `Button`, `Card`, `Input`, `Header`, `TabBar`, `EmptyState`, `EventCard`, `FloatingActionButton`
  - シンプルな props 設計（variant/size/state など）とデザイン定数の一貫利用
- **アイコン**
  - `lucide-react-native` をメインで使用
  - `@expo/vector-icons` も依存に含まれる（必要に応じて使用可能）

### プラットフォーム / Expo モジュール
- コア: `expo`, `expo-status-bar`, `expo-system-ui`, `expo-constants`, `expo-splash-screen`
- UI/体験: `expo-linear-gradient`, `expo-blur`, `expo-haptics`
- デバイス: `expo-camera`
- Web/リンク: `expo-web-browser`, `expo-linking`
- RN 基盤: `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-webview`, `react-native-web`
- そのほか: `react-native-url-polyfill`
- 新アーキテクチャ: `app.json` の `newArchEnabled: true`

### 型 / ビルド / Lint
- **TypeScript**: `strict: true`、パスエイリアス `@/*`（`tsconfig.json`）
- **ESLint**: v9（Flat Config）+ `eslint-config-expo`
- **パッケージマネージャ**: pnpm（`pnpm-lock.yaml` あり）

### ディレクトリ構成（抜粋）
```
app/
  _layout.tsx                 // ルート Stack（onboarding/tabs/+not-found をマウント）
  (onboarding)/               // Onboarding フロー用の Stack グループ
    _layout.tsx
    splash.tsx
    welcome.tsx
    features.tsx
    auth.tsx
  (tabs)/                     // メインアプリのタブグループ
    _layout.tsx               // Tabs（index/members/records/settings）
    index.tsx                 // イベント一覧タブの実装
    members.tsx
    records.tsx
    settings.tsx
  +not-found.tsx

components/common/            // 再利用 UI コンポーネント
constants/                    // Colors / Typography / Layout / EventConstants / StatusIcons
hooks/                        // 共通フック（例: useFrameworkReady）
types/                        // 型定義（イベント、ユーザー等のドメイン型）
```


## ルーティング設計の要点
- 画面スタックは `app/_layout.tsx` の `Stack` で定義し、`(onboarding)`・`(tabs)` を子として読み込み
- タブは `app/(tabs)/_layout.tsx` の `Tabs` で構成（`index`, `members`, `records`, `settings`）
- Onboarding は `app/(onboarding)/_layout.tsx` の `Stack`
- 例: 画面登録
  - `app/_layout.tsx` に `Stack.Screen name="(onboarding)"`, `Stack.Screen name="(tabs)"` などを宣言
  - `router.push('/(onboarding)/features')` のようにグループつきパスで遷移
- `app.json` の `experiments.typedRoutes: true` によりルートの型補完を有効化
- Deep Link スキーム: `scheme: "myapp"`（`app.json`）


## 権限・プラットフォーム設定（`app.json`）
- iOS: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`
- Android: `CAMERA`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`
- Web: `bundler: "metro"`, `output: "single"`


## 開発・ビルド・Lint
```bash
# 開発サーバ（QR で実機/エミュレータ、Web も可）
pnpm dev

# Web ビルド（静的書き出し）
pnpm build:web

# Lint（Expo 推奨設定）
pnpm lint
```


## コーディング規約のポイント
- デザイン定数（`Colors`/`Typography`/`Layout`）を経由してスタイルを適用
- 共通 UI を `components/common` に集約し、画面側では組み合わせる方針
- TypeScript の型（`types/index.ts`）でドメイン構造を明確化（`Event`/`User` 等）
- ファイルベースルーティング（`app/` 直下）に従う


## 備考
- `react-native-reanimated` は Expo により自動設定されます（Expo SDK 53 以降）
- ルーティングは `expo-router` を第一級で採用。必要に応じて React Navigation の API を併用可能です。
