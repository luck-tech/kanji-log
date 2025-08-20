## kanji-log 技術スタック / プロジェクト概要

このリポジトリは Expo（React Native）をベースに、`expo-router` を用いたファイルベースルーティングで画面遷移を実装したモバイル/ウェブ対応アプリです。StyleSheet スタイリングで統一されています。

プロジェクト構造は、**フロントエンド**（モバイル画面）を `frontend/` ディレクトリに集約し、将来的な API 実装や AWS 管理などの**バックエンド**機能との分離を考慮した設計になっています。

### 主要バージョン

- **Expo SDK**: 53
- **React**: 19
- **React Native**: 0.79
- **TypeScript**: 5.8（`strict: true`）
- **NativeWind**: 4.1.23（TailwindCSS for React Native）

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

- **React Native Reanimated** によるアニメーション実装
  - パフォーマンス重視のネイティブアニメーション
  - `useSharedValue`, `useAnimatedStyle`, `Animated.View` などを活用
  - コンポーネントレンダリング中の shared value アクセスを避ける
- **デザイン定数**（一部コンポーネントで参照）
  - `constants/Colors.ts`: カラーパレット（`primary`/`secondary`/`accent`/`gray` 等）
  - `constants/Typography.ts`: 見出し/本文/ボタン/ラベルのタイポグラフィ定義
  - `constants/Layout.ts`: スペーシング・パディング・角丸・画面サイズ
- 共通コンポーネント（`components/common`）
  - `Button`, `Card`, `Input`, `Header`, `TabBar`, `EmptyState`, `EventCard`, `FloatingActionButton`
  - シンプルな props 設計（variant/size/state など）
- **アイコン**
  - `@expo/vector-icons` をメインで使用

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
- **NativeWind v4 設定**:
  - `babel.config.js`: NativeWind babel preset 追加
  - `metro.config.js`: NativeWind Metro 統合
  - `tailwind.config.js`: コンテンツパス設定と NativeWind preset

### ディレクトリ構成

```
kanji-log/                    // プロジェクトルート
├── frontend/                 // モバイルアプリ（フロントエンド）部分
│   ├── app/                  // expo-router画面定義
│   │   ├── _layout.tsx       // ルート Stack
│   │   ├── (onboarding)/     // Onboarding フロー用の Stack グループ
│   │   │   ├── _layout.tsx
│   │   │   ├── splash.tsx
│   │   │   ├── welcome.tsx
│   │   │   ├── features.tsx
│   │   │   └── auth.tsx
│   │   ├── (tabs)/           // メインアプリのタブグループ
│   │   │   ├── _layout.tsx   // Tabs（index/members/records/settings）
│   │   │   ├── index.tsx     // イベント一覧タブ
│   │   │   ├── members.tsx
│   │   │   ├── records.tsx
│   │   │   └── settings.tsx
│   │   └── +not-found.tsx
│   ├── components/common/    // 再利用 UI コンポーネント
│   ├── constants/            // Colors / Typography / Layout / EventConstants / StatusIcons
│   ├── hooks/                // 共通フック（例: useFrameworkReady）
│   ├── types/                // 型定義（イベント、ユーザー等のドメイン型）
│   ├── assets/               // 画像やアイコンなどのアセット
│   ├── app.json              // Expo設定
│   ├── babel.config.js       // Babel設定
│   ├── metro.config.js       // Metro設定
│   ├── tailwind.config.js    // TailwindCSS設定
│   ├── tsconfig.json         // TypeScript設定
│   ├── eslint.config.js      // ESLint設定
│   ├── global.css            // TailwindCSSスタイル
│   └── *.d.ts                // 型定義ファイル
├── package.json              // パッケージ管理（ルートプロジェクト）
├── pnpm-lock.yaml            // 依存関係ロック
└── README.md                 // プロジェクト概要

// 将来予定のディレクトリ:
// ├── api/                   // API実装
// ├── aws/                   // AWS管理コード
// ├── backend/               // バックエンドロジック
// └── infrastructure/        // インフラ設定
```

## ルーティング設計の要点

- 画面スタックは `frontend/app/_layout.tsx` の `Stack` で定義し、`(onboarding)`・`(tabs)` を子として読み込み
- タブは `frontend/app/(tabs)/_layout.tsx` の `Tabs` で構成（`index`, `members`, `records`, `settings`）
- Onboarding は `frontend/app/(onboarding)/_layout.tsx` の `Stack`
- 例: 画面登録
  - `frontend/app/_layout.tsx` に `Stack.Screen name="(onboarding)"`, `Stack.Screen name="(tabs)"` などを宣言
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

# Lint（Expo 推奨設定、frontend/内で実行）
pnpm lint
```

**注意**: すべてのフロントエンド関連ファイルは `frontend/` ディレクトリに配置されており、ルートの `package.json` スクリプトが適切にパスを指定します。

## コーディング規約のポイント

- StyleSheet スタイリングを主軸とする
- **アニメーション**: React Native Reanimated を直接使用し、Tailwind アニメーションクラスは使用禁止
- デザイン定数（`frontend/constants/` の `Colors`/`Typography`/`Layout`）は必要に応じて参照
- 共通 UI を `frontend/components/common` に集約し、画面側では組み合わせる方針
- TypeScript の型（`frontend/types/index.ts`）でドメイン構造を明確化（`Event`/`User` 等）
- ファイルベースルーティング（`frontend/app/` 直下）に従う
- **フロントエンド**（モバイル画面）は `frontend/` 配下で管理
- **バックエンド**（API、AWS 管理等）は将来的に別ディレクトリで分離予定

## 備考

- `react-native-reanimated` は Expo により自動設定されます（Expo SDK 53 以降）
- ルーティングは `expo-router` を第一級で採用。必要に応じて React Navigation の API を併用可能です。

### アニメーション実装例（React Native Reanimated）

```tsx
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

// フェードインアニメーション
<Animated.View entering={FadeIn.delay(100)}>
  <Card>内容</Card>
</Animated.View>;

// カスタムアニメーション
const opacity = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

<Animated.View style={animatedStyle}>
  <Content />
</Animated.View>;
```
