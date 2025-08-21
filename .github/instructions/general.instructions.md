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
- **スタイリング**: NativeWind v4（TailwindCSS for React Native）
- **状態管理**: React Hooks（必要に応じて Zustand 等を検討）
- **型安全性**: TypeScript（strict: true）

## 開発原則・コーディング規約

### 1. コンポーネント設計原則

- `components/common/`: 汎用 UI コンポーネント
- `components/(ページ名)/`: ページ特化型コンポーネント
- 各コンポーネントは単一責任の原則に従う
- Props 設計は`variant`、`size`、`state`による統一された API

### 2. スタイリング規約

- `StyleSheet`による統一されたスタイリング
- デザイン定数（`constants/Colors.ts`等）は必要に応じて参照

### 3. SafeArea 実装規約

- **react-native-safe-area-context を必須使用**（React Native 標準の `SafeAreaView` は使用禁止）
- **ルートレベル設定**: `app/_layout.tsx` で `SafeAreaProvider` を設定
- **コンポーネントレベル**: 各画面・コンポーネントで `useSafeAreaInsets()` を使用
- **柔軟な制御**: 上部・下部・左右を個別に適用可能
  - `{ paddingTop: insets.top }`: 上部のSafeArea適用
  - `{ paddingBottom: insets.bottom }`: 下部のSafeArea適用
  - `{ paddingHorizontal: Math.max(insets.left, insets.right) }`: 横方向のSafeArea適用
- **クロスプラットフォーム**: iOS/Android/Web で統一された動作

### 4. アニメーション規約

- **Tailwind のアニメーションクラスは React Native Reanimated と競合するため使用禁止**
  - `animate-*`クラス（`animate-fade-in`, `animate-scale-in`, `animate-spin`等）は使用しない
  - `shadow-*`クラスも同様の理由で慎重に使用する
- **React Native Reanimated**を直接使用してアニメーションを実装
  - `Animated.View`や`useSharedValue`、`useAnimatedStyle`等を活用
  - コンポーネントレンダリング中の shared value アクセスを避ける
- パフォーマンスを重視したネイティブアニメーションの実装を心がける

### 5. ファイル命名・構造規約

- **PascalCase**: コンポーネントファイル（例：`EventCard.tsx`）
- **camelCase**: フック、ユーティリティ関数（例：`useFrameworkReady.ts`）
- **kebab-case**: 画面ファイル（expo-router 規約に従う）
- **snake_case**: 定数ファイル（例：`EVENT_STATUS_TABS`）

### 6. テスト戦略

- 都度 lint を実行し、通ることを確認する
- 新しいカスタムフックや関数を追加した場合は、jest でテストを作成し、実行して通ることを確認する

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
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 画面定義 */}
      </Stack>
    </SafeAreaProvider>
  );
}

// 各画面・コンポーネントでの使用
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
