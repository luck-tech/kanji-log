# タスク 05e: Event Restaurant Suggestions コンポーネント実装

## 概要

レストラン提案画面（`app/event/[id]/restaurant-suggestions.tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/restaurant-suggestions/` に実装する。

## 目標

- レストラン提案画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/restaurant-suggestions/
├── RestaurantCard.tsx
├── RestaurantSelection.tsx
├── RecommendationExplanation.tsx
└── index.ts
```

### 2. コンポーネント実装

- **RestaurantCard**: レストラン表示カード
- **RestaurantSelection**: レストラン選択状態管理
- **RecommendationExplanation**: AI 分析結果説明

### 3. 既存コードからの抽出

- `app/event/[id]/restaurant-suggestions.tsx` からコンポーネント化
- レストラン選択状態と表示ロジックの分離

## 成果物

- [ ] RestaurantCard.tsx
- [ ] RestaurantSelection.tsx
- [ ] RecommendationExplanation.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- レストラン選択機能が正常に動作することを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
