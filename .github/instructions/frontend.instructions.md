---
applyTo: "/frontend"
---

## ディレクトリ構造とファイル配置基準

### 現在の/frontend 下のディレクトリ構造

```
frontend/
├── app/                     # expo-router画面定義
│   ├── _layout.tsx         # ルートレイアウト
│   ├── (onboarding)/       # オンボーディング画面群
│   └── (main)/             # メインアプリケーション
│       ├── _layout.tsx     # タブナビゲーション設定
│       ├── (events)/       # イベント機能グループ
│       │   ├── index.tsx   # /events (イベント一覧)
│       │   ├── [id].tsx    # /events/[id] (イベント詳細)
│       │   ├── [id]/       # イベント詳細サブ画面
│       │   │   ├── form-setup.tsx
│       │   │   ├── restaurant-suggestions.tsx
│       │   │   ├── reservation-support.tsx
│       │   │   └── schedule-results.tsx
│       │   └── _layout.tsx # イベント系画面の共通レイアウト
│       ├── (members)/      # メンバー機能グループ
│       │   ├── index.tsx   # /members (メンバー一覧)
│       │   ├── [id].tsx    # /members/[id] (メンバー詳細)
│       │   └── _layout.tsx # メンバー系画面の共通レイアウト
│       ├── (records)/      # 記録機能グループ
│       │   ├── index.tsx   # /records (記録一覧)
│       │   └── _layout.tsx
│       └── (settings)/     # 設定機能グループ
│           ├── index.tsx   # /settings (設定一覧)
│           └── _layout.tsx
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
│   ├── common/             # 汎用フック
│   └── features/           # 機能別フック（将来拡張）
├── types/                  # 型定義
│   ├── common/             # 共通型定義
│   └── features/           # 機能別型定義
└── utils/                  # ユーティリティ・定数
    └── constants/          # 定数定義
        ├── design/         # デザイン定数
        └── business/       # ビジネス定数
├── assets/                 # 静的アセット
└── docs/                   # ドキュメント
```

### ファイル追加時の配置基準

#### 🎯 画面ファイル（app/）

- **メイン機能の一覧画面**: `app/(main)/(domain)/index.tsx`
- **メイン機能の詳細画面**: `app/(main)/(domain)/[id].tsx`
- **メイン機能のサブ画面**: `app/(main)/(domain)/[id]/sub-screen.tsx`
- **オンボーディング画面**: `app/(onboarding)/screen-name.tsx`

```typescript
// 例：新しいイベント機能画面
app/(main)/(events)/
├── index.tsx              # /events (イベント一覧)
├── [id].tsx              # /events/[id] (イベント詳細)
├── [id]/
│   ├── edit.tsx          # /events/[id]/edit (イベント編集)
│   └── participants.tsx  # /events/[id]/participants (参加者管理)
└── _layout.tsx           # イベント系画面の共通設定
```

#### 🧩 コンポーネントファイル（components/）

新しいコンポーネントを追加する際の判断基準：

##### ✅ components/common/ui/ に追加すべきもの

- **再利用性**: 3 つ以上の異なる機能で使用される
- **汎用性**: 特定の機能に依存しない
- **基本性**: Button、Input、Card 等の基本 UI 要素

```typescript
// 例：汎用的なコンポーネント
components/common/ui/
├── Button.tsx         # 汎用ボタン
├── Modal.tsx          # 汎用モーダル
├── DatePicker.tsx     # 汎用日付選択
└── LoadingSpinner.tsx # 汎用ローディング
```

##### ✅ components/common/layout/ に追加すべきもの

- **レイアウト関連**: ヘッダー、フッター、ナビゲーション
- **画面構造**: SafeArea、Container 等

```typescript
// 例：レイアウトコンポーネント
components/common/layout/
├── Header.tsx         # 汎用ヘッダー
├── TabBar.tsx         # タブバー
├── Container.tsx      # 画面コンテナ
└── SafeAreaContainer.tsx # SafeAreaラッパー
```

##### ✅ components/features/[domain]/ に追加すべきもの

- **機能固有性**: 特定の機能ドメインでのみ使用
- **複合性**: 複数の common コンポーネントを組み合わせ
- **ビジネスロジック**: 機能固有の状態管理・ロジック

```typescript
// 例：イベント機能コンポーネント
components/features/event/
├── list/
│   ├── EventCard.tsx           # イベントカード
│   ├── EventFilter.tsx         # イベントフィルター
│   └── index.ts               # バレルエクスポート
├── detail/
│   ├── EventOverview.tsx       # イベント概要
│   ├── EventActions.tsx        # イベントアクション
│   └── index.ts               # バレルエクスポート
└── index.ts                   # ドメイン全体エクスポート
```

#### 🎣 カスタムフック（hooks/）

新しいフックを追加する際の判断基準：

##### ✅ hooks/common/ に追加すべきもの

- **汎用性**: 複数の機能で再利用される
- **基本性**: API 通信、ストレージ、デバイス機能等

```typescript
// 例：汎用フック
hooks/common/
├── useFrameworkReady.ts    # フレームワーク初期化
├── useAsyncStorage.ts      # ローカルストレージ
├── useDeviceInfo.ts        # デバイス情報
└── index.ts               # バレルエクスポート
```

##### ✅ hooks/features/ に追加すべきもの（将来拡張）

- **機能固有性**: 特定の機能ドメインでのみ使用
- **複雑性**: 複雑な状態管理やビジネスロジック

```typescript
// 例：機能別フック（将来拡張時）
hooks/features/
├── event/
│   ├── useEventData.ts     # イベントデータ管理
│   ├── useEventForm.ts     # イベントフォーム
│   └── index.ts           # バレルエクスポート
└── index.ts               # 全体エクスポート
```

#### 📝 型定義（types/）

新しい型を定義する際の判断基準：

##### ✅ types/common/ に追加すべき型

- **基本型**: ID、Date、基本プリミティブ型
- **API 型**: レスポンス・リクエストの共通型
- **UI 型**: コンポーネントの共通 Props 型

```typescript
// 例：共通型定義
types/common/
├── base.ts            # 基本型定義
├── ui.ts              # UI関連型
├── api.ts             # API関連型（将来拡張）
└── index.ts           # バレルエクスポート
```

##### ✅ types/features/ に追加すべき型

- **ドメインオブジェクト**: Event、Member、Record 等
- **機能固有型**: 特定機能でのみ使用される型
- **複数コンポーネント使用**: 同一機能内の複数コンポーネントで使用

```typescript
// 例：機能別型定義
types/features/
├── event.ts           # イベント関連型
├── member.ts          # メンバー関連型
├── record.ts          # 記録関連型
├── setting.ts         # 設定関連型
└── index.ts           # バレルエクスポート
```

#### 🔧 ユーティリティ・定数（utils/）

新しいユーティリティや定数を追加する際の判断基準：

##### ✅ utils/constants/design/ に追加すべきもの

- **デザイン定数**: 色、サイズ、レイアウト関連
- **UI 関連**: スタイリングに関する定数

```typescript
// 例：デザイン定数
utils/constants/design/
├── colors.ts          # カラーパレット
├── layout.ts          # レイアウト定数
├── styles.ts          # 共通スタイル
└── index.ts           # バレルエクスポート
```

##### ✅ utils/constants/business/ に追加すべきもの

- **ビジネス定数**: ステータス、カテゴリ、設定値
- **アプリロジック**: 機能に関する定数

```typescript
// 例：ビジネス定数
utils/constants/business/
├── event.ts           # イベント関連定数
├── member.ts          # メンバー関連定数
├── app.ts             # アプリ設定定数
└── index.ts           # バレルエクスポート
```

### ファイル追加時のチェックリスト

新しいファイルを追加する前に以下を確認：

#### 🔍 追加前チェック

- [ ] **既存ファイルで対応できないか？**

  - 同様の機能が既に存在していないか確認
  - 既存ファイルの拡張で対応できないか検討

- [ ] **適切な配置場所か？**

  - 上記の配置基準に従っているか
  - 将来的な保守性を考慮しているか

- [ ] **バレルエクスポートの更新は必要か？**

  - 該当ディレクトリの `index.ts` を更新
  - 上位ディレクトリのエクスポートも確認

- [ ] **型定義は適切か？**
  - 型定義の配置基準に従っているか
  - 既存の型を再利用できないか確認

#### ✅ 追加後チェック

- [ ] **import 文の確認**

  - パスエイリアス `@/` を使用しているか
  - バレルエクスポートを活用しているか

- [ ] **TypeScript エラーの確認**

  - `npx tsc --noEmit` でコンパイルエラーがないか
  - `npm run lint` でリントエラーがないか

- [ ] **テストの作成**
  - 新しいロジックにはテストを作成
  - `__tests__/` ディレクトリに配置

### 命名規則

- **ファイル名**:

  - コンポーネント: `PascalCase.tsx` (例: `EventCard.tsx`)
  - フック: `camelCase.ts` (例: `useFrameworkReady.ts`)
  - 画面: `kebab-case.tsx` (例: `form-setup.tsx`)
  - 型定義: `camelCase.ts` (例: `event.ts`)
  - 定数: `camelCase.ts` (例: `colors.ts`)

- **エクスポート名**:
  - コンポーネント: `PascalCase` (例: `EventCard`)
  - フック: `camelCase` (例: `useFrameworkReady`)
  - 型: `PascalCase` (例: `Event`, `EventCardProps`)
  - 定数: `PascalCase` または `SCREAMING_SNAKE_CASE`

### パスエイリアス規約

- **必須使用**: すべてのインポート文で `@/` パスエイリアスを使用する
- **相対パス禁止**: `../../../` のような長い相対パスは使用禁止
- **利点**:

  - ファイル移動時にインポートパスの修正が不要
  - 可読性の向上
  - IDE での自動補完とリファクタリング支援
  - プロジェクト構造の把握が容易

- **パスエイリアス設定**:

  - `@/*`: プロジェクトルート（`./*`）
  - `@/constants`: `./utils/constants`
  - `@/constants/*`: `./utils/constants/*`
  - `@/constants/Colors`: `./utils/constants/design/colors`
  - `@/constants/Layout`: `./utils/constants/design/layout`
  - `@/constants/EventConstants`: `./utils/constants/business/event`

- **推奨インポート例**:

  ```typescript
  // ✅ 良い例（パスエイリアス使用）
  import { Button, Input } from "@/components/common/ui";
  import { EventCard } from "@/components/features/event";
  import { Event } from "@/types/features/event";
  import { Colors } from "@/utils/constants/design/colors";

  // ❌ 悪い例（長い相対パス）
  import { Button } from "../../../common/ui";
  import { Event } from "../../../../types/features/event";
  ```

- **例外規則**:

  - 同一ディレクトリ内の相対インポートは `./` を使用可能
  - 一つ上の階層のみの場合は `../` を使用可能
  - 2 階層以上（`../../`）の相対パスは禁止

- **強制ルール**:
  - 新規ファイル作成時は必ずパスエイリアスを使用
  - コードレビューでは相対パスの使用をチェック
  - リファクタリング時は既存の相対パスもパスエイリアスに変更

## 技術スタック・アーキテクチャルール

### フロントエンド技術

- **ベースフレームワーク**: Expo + React Native（SDK 53）
- **ルーティング**: expo-router v5（ファイルベースルーティング）
- **スタイリング**: StyleSheet（React Native 標準）
- **状態管理**: React Hooks（必要に応じて Zustand 等を検討）
- **型安全性**: TypeScript（strict: true）

### 2. スタイリング規約

- `StyleSheet`による統一されたスタイリング（React Native 標準）
- デザイン定数は必要に応じて参照
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
- 再利用可能なアニメーションコンポーネント

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
  import { Button } from "@/components/common/ui";
  import { useEventData } from "@/hooks/features/event";

  // ❌ 悪い例（機能間の直接依存）
  import { MemberCard } from "@/components/features/member";
  ```

#### コンポーネント設計原則

- **YAGNI（You Aren't Gonna Need It）の徹底**: 実際に必要になるまで抽象化しない

  ```typescript
  // ❌ 悪い例（不要なラッパーコンポーネント）
  const EventListCard = ({ event, onPress }) => (
    <EventCard event={event} onPress={onPress} />
  );

  // ✅ 良い例（直接既存コンポーネントを使用）
  <EventCard event={event} onPress={onPress} />;
  ```

- **機能別コンポーネント作成の判断基準**:

  - **独自の状態管理**が必要か？
  - **機能固有のロジック**があるか？
  - **既存の共通コンポーネントでは表現できない UI**があるか？
  - **将来的な拡張**が明確に見込まれるか？

- **作成すべきでない機能別コンポーネント**:

  - 既存コンポーネントの単純なラッパー
  - props をそのまま渡すだけのコンポーネント
  - 機能固有の価値を提供しないコンポーネント

- **作成すべき機能別コンポーネント**:
  - 複数の共通コンポーネントを組み合わせる複合コンポーネント
  - 機能固有の状態やロジックを持つコンポーネント
  - 機能固有の UI パターンを実現するコンポーネント

#### バレルエクスポート戦略

- **各ディレクトリの `index.ts`** でエクスポートを統一
- **インポート文の簡潔性**を保つ
- **tree shaking** に配慮した named export

- **実装例**:

  ```typescript
  // components/common/ui/index.ts
  export { Button } from "./Button";
  export { Input } from "./Input";
  export { Card } from "./Card";

  // components/features/event/index.ts
  export { EventCard } from "./EventCard";
  export { EventForm } from "./EventForm";

  // 使用側
  import { Button, Input } from "@/components/common/ui";
  import { EventCard } from "@/components/features/event";
  ```

### 8. 型定義戦略

#### 共通型と機能別型の分離

- **共通型定義**: `types/common/` に配置

  - `base.ts`: ID、Date、基本的なプリミティブ型
  - `api.ts`: API レスポンス・リクエストの共通型
  - `ui.ts`: UI コンポーネントの共通 Props 型

- **機能別型定義**: `types/features/` に配置
  - 各機能ドメインに特化した型定義
  - 共通型を import して拡張

#### 型定義の配置判断基準

新しい interface や型を定義する際は、以下の基準で配置を決定する：

- **✅ `types/features/`に配置すべき型**:

  - **複数コンポーネントで使用される**: 同一機能内の 2 つ以上のコンポーネントで使用
  - **ドメインオブジェクト**: ビジネスロジックの核となる概念（User, Event, Question 等）
  - **データ構造**: API レスポンス、状態管理で使用されるデータ構造
  - **将来の拡張性**: 他のコンポーネントでも使用される可能性が高い

- **✅ コンポーネント内で定義してよい型**:
  - **Props インターフェース**: そのコンポーネント専用の Props 型
  - **ローカル状態**: そのコンポーネントでのみ使用される内部状態の型
  - **一時的な型**: 一時的な計算やマッピングでのみ使用される型

#### 型定義作成時のチェックリスト

新しい型を定義する前に以下を確認：

- [ ] この型は他のコンポーネントでも使用される可能性があるか？
- [ ] この型はビジネスドメインの概念を表しているか？
- [ ] 同じような型が既に`types/`に存在していないか？
- [ ] Props 型以外で、コンポーネント固有でない型か？

#### 型定義の実装例

```typescript
// ✅ 良い例：共通型定義（types/features/event.ts）
export interface Question {
  id: string;
  question: string;
  type:
    | "name"
    | "email"
    | "phone"
    | "allergy"
    | "alcohol"
    | "budget"
    | "genre"
    | "station"
    | "custom";
  required: boolean;
  enabled: boolean;
  canDisable: boolean;
}

export interface NewMember {
  id: string;
  name: string;
}

// ✅ 良い例：コンポーネント専用Props型
interface QuestionItemProps extends BaseComponentProps {
  question: Question; // 共通型を使用
  onToggleEnabled: (questionId: string) => void;
  onToggleRequired: (questionId: string) => void;
}

// ❌ 悪い例：コンポーネント内での重複定義
interface Question {
  // これは共通型として定義すべき
  id: string;
  question: string;
  // ...
}
```

#### 型安全性の確保

- **型アサーション（as）の使用禁止**: 型安全性を損なうため原則使用しない

  ```typescript
  // ❌ 悪い例（型アサーションの使用）
  const data = response as UserData;
  const element = document.getElementById("button") as HTMLButtonElement;

  // ✅ 良い例（型ガードや適切な型定義の使用）
  const isUserData = (data: unknown): data is UserData => {
    return typeof data === "object" && data !== null && "id" in data;
  };

  if (isUserData(response)) {
    // responseはUserData型として安全に使用可能
  }
  ```

- **例外的な使用許可**: 以下の場合のみ使用を許可
  - React Native のプラットフォーム固有 API 利用時
  - 外部ライブラリの型定義が不完全な場合
  - 使用時は必ずコメントで理由を記載

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
export { Button } from "./Button";
export { Input } from "./Input";
export { Card } from "./Card";
export { Animations } from "./Animations";

// components/features/event/index.ts
export { EventCard } from "./EventCard";
export { EventForm } from "./EventForm";
export { EventsList } from "./EventsList";

// types/index.ts
export * from "./common";
export * from "./features";

// 使用例
import { Button, Input, Card } from "@/components/common/ui";
import { EventCard, EventForm } from "@/components/features/event";
import { Event, EventCardProps } from "@/types";
```

## コンポーネント設計実装例

### ❌ 悪い例（不要なラッパーコンポーネント）

```typescript
// 避けるべき：単純なラッパーコンポーネント
const EventListCard: React.FC<EventListCardProps> = ({
  event,
  onPress,
  variant,
  style,
  testID,
}) => {
  return (
    <EventCard
      event={event}
      onPress={onPress}
      variant={variant}
      style={style}
      testID={testID}
    />
  );
};

// 使用時も余分なインポートが必要
import { EventListCard } from "@/components/features/event/list";
```

### ✅ 良い例（既存コンポーネントの直接使用）

```typescript
// 推奨：既存の汎用コンポーネントを直接使用
import { EventCard } from "@/components/common/ui";

// 直接使用
<EventCard event={event} onPress={onPress} variant="elevated" />;
```

### ✅ 良い例（価値のある機能別コンポーネント）

```typescript
// 価値のある機能別コンポーネント：複数コンポーネントの組み合わせ + 機能固有ロジック
const EventScheduleSelector: React.FC<EventScheduleSelectorProps> = ({
  event,
  onScheduleUpdate,
}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);

  // 機能固有のロジック
  const handleDateSelection = useCallback(
    (date: string) => {
      const newSelection = selectedDates.includes(date)
        ? selectedDates.filter((d) => d !== date)
        : [...selectedDates, date];

      setSelectedDates(newSelection);
      validateScheduleConflicts(newSelection);
    },
    [selectedDates]
  );

  return (
    <Card variant="elevated">
      <Header title="日程調整" />
      <DatePicker
        selectedDates={selectedDates}
        onDateSelect={handleDateSelection}
      />
      {conflicts.length > 0 && <ConflictWarning conflicts={conflicts} />}
      <Button
        title="スケジュール更新"
        onPress={() => onScheduleUpdate(selectedDates)}
      />
    </Card>
  );
};
```

## 機能別コンポーネント作成チェックリスト

新しい機能別コンポーネントを作成する前に、以下の質問に答えてください：

### 🔍 作成前チェック

- [ ] **既存の共通コンポーネントで実現できないか？**

  - 既存のコンポーネントの組み合わせで十分でないか確認

- [ ] **機能固有の価値があるか？**

  - 単純な props の転送以上の価値を提供するか
  - 機能固有の状態管理やロジックがあるか
  - 複数の共通コンポーネントを意味のある形で組み合わせるか

- [ ] **将来的な拡張性があるか？**
  - 明確な拡張予定があるか（YAGNI に注意）
  - 他の機能でも再利用される可能性があるか

### ✅ 作成してもよい場合

- 複数の共通コンポーネントを組み合わせて新しい意味を持つ UI
- 機能固有の複雑な状態管理が必要
- 機能固有のバリデーションやビジネスロジックを含む
- 既存コンポーネントでは表現できない独自の UI パターン

### ❌ 作成すべきでない場合

- 既存コンポーネントをそのまま呼び出すだけ
- props をそのまま渡すだけの薄いラッパー
- 「将来的に機能が追加されるかも」という推測ベース
- 単にファイル分割したいだけの理由

## テスト実装例

```typescript
// components/features/event/__tests__/EventCard.test.tsx
import { render, fireEvent } from "@testing-library/react-native";
import { EventCard } from "../EventCard";
import { Event } from "@/types";

const mockEvent: Event = {
  id: "1",
  name: "テストイベント",
  createdAt: new Date(),
};

describe("EventCard", () => {
  it("イベント名が正しく表示される", () => {
    const { getByText } = render(
      <EventCard event={mockEvent} onPress={jest.fn()} />
    );

    expect(getByText("テストイベント")).toBeTruthy();
  });

  it("タップ時にonPressが呼ばれる", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <EventCard event={mockEvent} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId("event-card"));
    expect(mockOnPress).toHaveBeenCalledWith(mockEvent);
  });
});
```
