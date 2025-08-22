---
applyTo: "**"
---

# 幹事ナビ開発プロジェクトルール

## プロジェクト概要

**プロジェクト名**: 幹事ナビ（Kanji Navi）  
**コンセプト**: 飲み会の企画・管理における幹事の心理的負担を軽減する専用アプリ  
**ターゲット**: 企業・団体の飲み会で調整が困難な状況を抱える幹事

### 核となる価値提案

1. **負担削減**: 複雑な調整作業をアプリで一元管理
2. **ナレッジ蓄積**: 過去のイベント記録を資産として活用
3. **集合知**: 他の幹事の経験を共有・参照可能

## 技術スタック・アーキテクチャルール

### フロントエンド技術

- **ベースフレームワーク**: Expo + React Native（SDK 53）
- **ルーティング**: expo-router v5（ファイルベースルーティング）
- **スタイリング**: StyleSheet（React Native 標準）
- **状態管理**: React Hooks（必要に応じて Zustand 等を検討）
- **型安全性**: TypeScript（strict: true）

### 2. スタイリング規約

- `StyleSheet`による統一されたスタイリング（React Native 標準）
- デザイン定数（`constants/Colors.ts`等、将来的に`src/utils/constants/`へ移行）は必要に応じて参照
- React Native Reanimated によるネイティブアニメーション実装
- プラットフォーム固有の調整は`Platform.select()`を使用

### 3. SafeArea 実装規約

- **react-native-safe-area-context を必須使用**（React Native 標準の `SafeAreaView` は使用禁止）
- **ルートレベル設定**: `app/_layout.tsx` で `SafeAreaProvider` を設定
- **コンポーネントレベル**: 各画面・コンポーネントで `useSafeAreaInsets()` を使用
- **柔軟な制御**: 上部・下部・左右を個別に適用可能
  - `{ paddingTop: insets.top }`: 上部の SafeArea 適用
  - `{ paddingBottom: insets.bottom }`: 下部の SafeArea 適用
  - `{ paddingHorizontal: Math.max(insets.left, insets.right) }`: 横方向の SafeArea 適用
- **クロスプラットフォーム**: iOS/Android/Web で統一された動作

### 4. アニメーション規約

- **React Native Reanimated**を直接使用してアニメーションを実装
  - `Animated.View`や`useSharedValue`、`useAnimatedStyle`等を活用
  - コンポーネントレンダリング中の shared value アクセスを避ける
- パフォーマンスを重視したネイティブアニメーションの実装を心がける
- 再利用可能なアニメーションコンポーネント（`components/common/Animations.tsx`、将来的に`src/components/common/ui/Animations.tsx`）を活用

### 5. ファイル命名・構造規約

- **PascalCase**: コンポーネントファイル（例：`EventCard.tsx`）
- **camelCase**: フック、ユーティリティ関数（例：`useFrameworkReady.ts`）
- **kebab-case**: 画面ファイル（expo-router 規約に従う）
- **snake_case**: 定数ファイル（例：`EVENT_STATUS_TABS`）

### 6. テスト戦略

- 都度 lint を実行し、通ることを確認する
- 新しいカスタムフックや関数を追加した場合は、jest でテストを作成し、実行して通ることを確認する
- **テスト配置規約**:
  - コンポーネント・フック・ユーティリティ関数のテストは各ディレクトリ内の `__tests__/` に配置
  - テストファイル名は `{対象ファイル名}.test.tsx` または `{対象ファイル名}.test.ts`
  - グローバルテストは `frontend/__tests__/` に配置

### 7. アーキテクチャ原則

#### モジュール境界の明確化

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

#### バレルエクスポート戦略

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

### 8. 型定義戦略

#### 共通型と機能別型の分離

- **共通型定義**: `src/types/common/` に配置
  - `base.ts`: ID、Date、基本的なプリミティブ型
  - `api.ts`: API レスポンス・リクエストの共通型
  - `ui.ts`: UI コンポーネントの共通 Props 型

- **機能別型定義**: `src/types/features/` に配置
  - 各機能ドメインに特化した型定義
  - 共通型を import して拡張

- **型定義例**:
  ```typescript
  // src/types/common/base.ts
  export type ID = string;
  export type Timestamp = Date;
  
  // src/types/common/ui.ts
  export interface BaseComponentProps {
    testID?: string;
    style?: ViewStyle;
  }
  
  // src/types/features/event.ts
  import { ID, Timestamp } from '../common/base';
  import { BaseComponentProps } from '../common/ui';
  
  export interface Event {
    id: ID;
    name: string;
    createdAt: Timestamp;
  }
  
  export interface EventCardProps extends BaseComponentProps {
    event: Event;
    onPress: (event: Event) => void;
  }
  ```

## 機能実装ガイドライン

### 必須実装機能（MVP）

#### 1. イベント管理機能

- **イベント作成**: 基本情報（名前、日時、目的）の入力
- **メンバー管理**: 参加者リストの作成・編集
- **Web フォーム生成**: メンバー向け情報収集フォーム
- **日程調整**: 複数候補日での都合確認

#### 2. レストラン提案機能

- **エリア選定**: 地理的条件に基づく最適地点の算出
- **店舗検索**: ホットペッパーグルメ API 連携
- **推薦アルゴリズム**: メンバー情報に基づく候補提案
- **予約サポート**: 予約に必要な情報の集約表示

#### 3. 記録・共有機能

- **開催記録**: イベント終了後の主観的評価・メモ
- **ナレッジ共有**: 他の幹事向けの記録公開機能
- **プライバシー保護**: 個人情報の自動マスキング

## UI デザイン原則

### 1. デザインシステム

- **Spacing**: 8px グリッドシステム採用

### 2. UX 設計原則

- **直感的操作**: 3 タップ以内で主要機能にアクセス可能
- **エラー予防**: 入力検証・確認ダイアログによるミス防止
- **フィードバック**: 操作結果の明確な視覚的表示
- **アクセシビリティ**: 適切なコントラスト比・タップ領域確保

### 3. レスポンシブ対応

- スマートフォン優先設計（Mobile First）
- タブレット・Web 表示への段階的対応
- 横画面・縦画面の適切な対応

## SafeArea 実装例

```tsx
// ルートレベル設定（app/_layout.tsx）
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>{/* 画面定義 */}</Stack>
    </SafeAreaProvider>
  );
}

// 各画面・コンポーネントでの使用
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* コンテンツ */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        {/* フッター */}
      </View>
    </View>
  );
};

// Header コンポーネントでの標準実装
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

## バレルエクスポート実装例

```typescript
// components/common/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Animations } from './Animations';

// components/features/event/index.ts
export { EventCard } from './EventCard';
export { EventForm } from './EventForm';
export { EventsList } from './EventsList';

// types/index.ts
export * from './common';
export * from './features';

// 使用例
import { Button, Input, Card } from '@/components/common/ui';
import { EventCard, EventForm } from '@/components/features/event';
import { Event, EventCardProps } from '@/types';
```

## テスト実装例

```typescript
// components/features/event/__tests__/EventCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { EventCard } from '../EventCard';
import { Event } from '@/types';

const mockEvent: Event = {
  id: '1',
  name: 'テストイベント',
  createdAt: new Date(),
};

describe('EventCard', () => {
  it('イベント名が正しく表示される', () => {
    const { getByText } = render(
      <EventCard event={mockEvent} onPress={jest.fn()} />
    );
    
    expect(getByText('テストイベント')).toBeTruthy();
  });

  it('タップ時にonPressが呼ばれる', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <EventCard event={mockEvent} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('event-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockEvent);
  });
});
```
