## kanji-log 技術スタック / プロジェクト概要

このリポジトリは Expo（React Native）をベースに、`expo-router` を用いたファイルベースルーティングで画面遷移を実装したモバイル/ウェブ対応アプリです。StyleSheet スタイリングで統一されています。

プロジェクト構造は、**フロントエンド**（モバイル画面）を `frontend/` ディレクトリに集約し、将来的な API 実装や AWS 管理などの**バックエンド**機能との分離を考慮した設計になっています。

### 主要バージョン

- **Expo SDK**: 53
- **React**: 19
- **React Native**: 0.79
- **TypeScript**: 5.8（`strict: true`）
- **React Native Reanimated**: ネイティブアニメーション

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

- **StyleSheet ベースのスタイリング**
  - React Native の標準的な `StyleSheet.create()` を使用
  - TypeScript 対応で型安全性を確保
  - プラットフォーム固有のスタイル調整に対応
- **React Native Reanimated** によるアニメーション実装
  - パフォーマンス重視のネイティブアニメーション
  - `useSharedValue`, `useAnimatedStyle`, `Animated.View` などを活用
  - コンポーネントレンダリング中の shared value アクセスを避ける
- **SafeArea 設定**
  - **react-native-safe-area-context** を統一使用（React Native 標準の SafeAreaView は使用禁止）
  - `SafeAreaProvider` を `app/_layout.tsx` でルートレベルに設定
  - 各コンポーネントで `useSafeAreaInsets()` を使用して柔軟に SafeArea を制御
  - 上部・下部・左右を個別に適用可能（例：`{ paddingTop: insets.top, paddingBottom: insets.bottom }`）
  - iOS/Android/Web でクロスプラットフォーム対応
- **デザイン定数**（全コンポーネントで統一使用）
  - `constants/Colors.ts`: カラーパレット（`primary`/`secondary`/`accent`/`gray`/`blue`/`green`/`purple` 等）
  - `constants/Styles.ts`: 共通スタイルパターン（ボタン、カード、入力フィールド等）
  - `constants/Layout.ts`: スペーシング・パディング・角丸・画面サイズ

## ディレクトリ構造

```
frontend/
├── app/                    # ルーティング
│   ├── _layout.tsx         # ルートレイアウト
│   ├── (onboarding)/       # オンボーディング画面群
│   └── (main)/             # アプリメイン画面群
├── components/             # UIコンポーネント
│   ├── common/             # 汎用コンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   └── layout/         # レイアウトコンポーネント
│   └── features/           # 機能別コンポーネント
│       ├── event/          # イベント機能
│       ├── member/         # メンバー機能
│       ├── record/         # 記録機能
│       └── settings/       # 設定機能
├── hooks/                  # カスタムフック
├── types/                  # 型定義
│   ├── common/             # 共通型定義
│   └── features/           # 機能別型定義
└── utils/                  # ユーティリティ・定数
│   └── constants/          # 定数定義
│       ├── design/     # デザイン定数
│       └── business/   # ビジネス定数
├── assets/                 # 静的アセット
└── docs/                   # ドキュメント
```

- `SkeletonLoader`: スケルトンローディング状態
- シンプルな props 設計（variant/size/state など）
- **バレルエクスポート対応**: 統一された import パターン
- **機能別コンポーネント**（`src/components/features`）
  - **event**: イベント機能コンポーネント (list/detail/form-setup/schedule-results/restaurant-suggestions/reservation-support)
  - **member**: メンバー機能コンポーネント (list/detail)
  - **record**: レコード機能コンポーネント (list)
  - **settings**: 設定機能コンポーネント (list)
  - ドメイン別バレルエクスポートによる統一された import
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

### バレルエクスポート使用例

現在の中規模対応構造では、統一されたバレルエクスポートパターンを採用しています：

#### 基本パターン

```typescript
// 共通UIコンポーネント
import { Button, Card, Input } from '@/components/common';

// 機能別コンポーネント（特定機能）
import { EventListCard } from '@/components/features/event/list';

// 機能別コンポーネント（ドメイン全体）
import { EventListCard, EventOverviewCard } from '@/components/features/event';

// 機能別コンポーネント（全ドメイン）
import { EventListCard, MemberCard, RecordCard } from '@/components/features';

// 型定義
import { EventPurpose, BaseModalProps } from '@/types';
import type { FilterOptions } from '@/components/common/ui/FilterModal';

// 定数
import { Colors, Layout, EventConstants } from '@/constants';
```

#### 推奨 import パターン

```typescript
// ✅ 推奨: 統一されたバレルエクスポート
import { Button, Input, Card } from '@/components/common';
import { EventListCard, MemberCard } from '@/components/features';

// ❌ 非推奨: 個別ファイル指定（バレルエクスポートを回避）
import { Button } from '@/components/common/ui/Button';
import { Input } from '@/components/common/ui/Input';
```

#### アーキテクチャ原則

##### 1. モジュール境界の明確化

- **機能間の依存関係ルール**:

  - `features/` 内の機能は相互に直接依存しない
  - 共通機能は `common/` または `utils/` 経由で提供
  - 上位層（`hooks/`, `services/`）から下位層（`components/`）への一方向依存

- **依存関係の例**:

  ```typescript
  // ✅ 良い例
  import { Button } from '@/components/common/ui';
  import { useEventData } from '@/hooks/features/event';

  // ❌ 悪い例（機能間の直接依存）
  import { MemberCard } from '@/components/features/member';
  ```

##### 2. バレルエクスポート戦略

- **各ディレクトリの `index.ts`** でエクスポートを統一
- **インポート文の簡潔性**を保つ
- **tree shaking** に配慮した named export

- **実装例**:

  ```typescript
  // src/components/common/ui/index.ts
  export { Button } from './Button';
  export { Input } from './Input';
  export { Card } from './Card';

  // src/components/features/event/index.ts
  export { EventCard } from './EventCard';
  export { EventForm } from './EventForm';

  // 使用側
  import { Button, Input } from '@/components/common/ui';
  import { EventCard } from '@/components/features/event';
  ```

#### 移行のメリット

- **単一責任**: 各ファイルが明確な役割を持つ
- **テスタビリティ**: ビジネスロジック（hooks/services）と UI（components）が分離
- **再利用性**: 機能別コンポーネントを他の場所でも使用可能
- **保守性**: 変更時の影響範囲が限定される
- **チーム開発**: 機能別で作業分担しやすい
- **スケーラビリティ**: 大規模アプリケーションへの成長に対応
- **型安全性**: 共通型と機能別型の適切な分離
- **テスト品質**: 機能単位でのテストカバレッジ向上

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

## 開発・ビルド・Lint・テスト

```bash
# 開発サーバ（QR で実機/エミュレータ、Web も可）
pnpm dev

# Web ビルド（静的書き出し）
pnpm build:web

# Lint（Expo 推奨設定、frontend/内で実行）
pnpm lint

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# テストカバレッジ
pnpm test:coverage
```

**注意**: すべてのフロントエンド関連ファイルは `frontend/` ディレクトリに配置されており、ルートの `package.json` スクリプトが適切にパスを指定します。

## コーディング規約のポイント

- **StyleSheet スタイリング**を主軸とする
  - React Native 標準の `StyleSheet.create()` を使用
  - デザイン定数（`constants/Colors.ts`, `constants/Styles.ts`, `constants/Layout.ts`）を必須で参照
  - プラットフォーム固有のスタイル調整には `Platform.select()` を使用
- **SafeArea 実装規約**
  - **react-native-safe-area-context** を必須使用（React Native 標準の `SafeAreaView` は使用禁止）
  - ルートレベル（`app/_layout.tsx`）で `SafeAreaProvider` を設定
  - 各画面・コンポーネントで `useSafeAreaInsets()` を使用
  - 上部・下部を個別制御：`{ paddingTop: insets.top }`, `{ paddingBottom: insets.bottom }`
  - Header コンポーネントでの標準的な使用例を参考にする
- **アニメーション**: React Native Reanimated を直接使用
  - `Animated.View` と `entering`/`exiting` プロパティでシンプルなアニメーション
  - 複雑なアニメーションには `useSharedValue` と `useAnimatedStyle` を使用
  - `components/common/Animations.tsx` の再利用可能なコンポーネントを活用
- **共通 UI** を `frontend/components/common` に集約し、画面側では組み合わせる方針
  - 各コンポーネントは適切な variant/size/state props を提供
  - アニメーション機能は標準で組み込み済み
- **TypeScript の型**（`frontend/types/index.ts`）でドメイン構造を明確化（`Event`/`User` 等）
- **ファイルベースルーティング**（`frontend/app/` 直下）に従う
- **フロントエンド**（モバイル画面）は `frontend/` 配下で管理
- **バックエンド**（API、AWS 管理等）は将来的に別ディレクトリで分離予定
- **バレルエクスポート**: 各ディレクトリの `index.ts` でエクスポートを統一
- **モジュール境界**: 機能間の直接依存を避け、共通層を経由

## 備考

- `react-native-reanimated` は Expo により自動設定されます（Expo SDK 53 以降）
- ルーティングは `expo-router` を第一級で採用。必要に応じて React Navigation の API を併用可能です。

### CustomDateTimePicker 使用方法

`CustomDateTimePicker`は、iOS/Android/Web で統一された UI を提供するカスタム日付・時間選択コンポーネントです。ネイティブの DateTimePicker とは異なり、プラットフォーム間での実装の違いを意識する必要がありません。

#### 基本的な使用方法

```tsx
import { CustomDateTimePicker } from '@/components/common/CustomDateTimePicker';

const MyComponent = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (time: Date) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  return (
    <>
      {/* 日付選択 */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>日付: {selectedDate.toLocaleDateString('ja-JP')}</Text>
      </TouchableOpacity>

      {/* 時間選択 */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text>
          時間:{' '}
          {selectedTime.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>

      {/* 日付ピッカー */}
      <CustomDateTimePicker
        isVisible={showDatePicker}
        mode="date"
        value={selectedDate}
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        title="開催日を選択"
      />

      {/* 時間ピッカー */}
      <CustomDateTimePicker
        isVisible={showTimePicker}
        mode="time"
        value={selectedTime}
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
        title="開始時間を選択"
      />
    </>
  );
};
```

#### プロパティ

| プロパティ    | 型                     | 必須 | デフォルト値                    | 説明                                      |
| ------------- | ---------------------- | ---- | ------------------------------- | ----------------------------------------- |
| `isVisible`   | `boolean`              | ✅   | -                               | モーダルの表示/非表示                     |
| `mode`        | `'date' \| 'time'`     | ✅   | -                               | 選択モード（日付または時間）              |
| `value`       | `Date`                 | ✅   | -                               | 現在選択されている値                      |
| `minimumDate` | `Date`                 | ❌   | `new Date(1900, 0, 1)`          | 選択可能な最小日付（`mode="date"`時のみ） |
| `maximumDate` | `Date`                 | ❌   | `new Date(2100, 11, 31)`        | 選択可能な最大日付（`mode="date"`時のみ） |
| `onConfirm`   | `(date: Date) => void` | ✅   | -                               | 決定ボタン押下時のコールバック            |
| `onCancel`    | `() => void`           | ✅   | -                               | キャンセルボタン押下時のコールバック      |
| `title`       | `string`               | ❌   | `'日付を選択'` / `'時間を選択'` | モーダルのタイトル                        |

#### 特徴

- **統一された UI**: iOS/Android/Web で同じデザインと UX
- **滑らかなアニメーション**: React Native Reanimated によるネイティブアニメーション
- **直感的な操作**: スクロールホイール形式で選択
- **日本語対応**: 日本語のラベルとフォーマット
- **アクセシビリティ**: タップによる直接選択も可能

#### 時間選択の仕様

- **時間**: 0-23 時（24 時間形式）
- **分**: 5 分刻み（0, 5, 10, 15, ..., 55 分）
- **表示形式**: `HH:MM`（例：`19:30`）

#### 日付選択の仕様

- **年**: `minimumDate` から `maximumDate` の範囲
- **月**: 1-12 月
- **日**: 各月の実際の日数に応じて動的に調整
- **表示形式**: `YYYY年MM月DD日`（例：`2025年08月22日`）

### SafeArea 実装例（react-native-safe-area-context）

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 基本的な使用方法
const MyScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header部分 - 上部SafeAreaを適用 */}
      <View style={styles.header}>
        <Text>ヘッダー</Text>
      </View>

      {/* Content部分 */}
      <ScrollView style={styles.content}>
        <Text>コンテンツ</Text>
      </ScrollView>

      {/* Footer部分 - 下部SafeAreaを適用 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button title="決定" />
      </View>
    </View>
  );
};

// モーダルでの使用例
const MyModal = () => {
  const insets = useSafeAreaInsets();

  return (
    <Modal>
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* モーダルコンテンツ */}
      </View>
    </Modal>
  );
};

// Header コンポーネントでの標準的な実装
const Header = ({ applySafeArea = true }) => {
  const insets = useSafeAreaInsets();
  const safeAreaStyle = applySafeArea ? { paddingTop: insets.top } : {};

  return (
    <View style={[styles.header, safeAreaStyle]}>
      {/* ヘッダーコンテンツ */}
    </View>
  );
};
```

### アニメーション実装例（React Native Reanimated）

```tsx
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FadeInView, SlideInView, StaggeredList, usePressAnimation } from '@/components/common/Animations';

// シンプルなフェードインアニメーション
<Animated.View entering={FadeIn.delay(100)}>
  <Card>内容</Card>
</Animated.View>

// 再利用可能なアニメーションコンポーネント
<FadeInView delay={200}>
  <EventCard event={event} />
</FadeInView>

<SlideInView direction="up" delay={300}>
  <Button title="詳細を見る" />
</SlideInView>

// リストアイテムのスタガーアニメーション
<StaggeredList data={events} staggerDelay={100}>
  {(event, index) => (
    <EventCard key={event.id} event={event} />
  )}
</StaggeredList>

// プレスアニメーション（カスタムフック）
const pressStyle = usePressAnimation();
<Animated.View style={[styles.button, pressStyle]}>
  <Pressable onPressIn={pressStyle.onPressIn} onPressOut={pressStyle.onPressOut}>
    <Text>押してください</Text>
  </Pressable>
</Animated.View>

// カスタムアニメーション
const opacity = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

<Animated.View style={animatedStyle}>
  <Content />
</Animated.View>
```

### StyleSheet 実装例

```tsx
import { StyleSheet, Platform } from 'react-native';
import { Colors, Layout, Styles } from '@/constants';

const styles = StyleSheet.create({
  container: {
    ...Styles.container,
    backgroundColor: Colors.background,
    padding: Layout.spacing.md,
  },
  title: {
    ...Styles.text.heading,
    color: Colors.primary.main,
    marginBottom: Layout.spacing.sm,
  },
  button: {
    ...Styles.button.primary,
    borderRadius: Layout.borderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
```
