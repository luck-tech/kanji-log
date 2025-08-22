# タスク 05a: Event List コンポーネント実装

## 概要

イベント一覧画面（`app/(tabs)/index.tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/list/` に実装する。

## 目標

- イベント一覧画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/list/
├── EventListCard.tsx
├── EventListFilter.tsx
└── index.ts
```

### 2. コンポーネント実装

- **EventListCard**: 個別イベント表示カード
  - イベント名、日程、ステータス表示
  - タップ時のナビゲーション
- **EventListFilter**: フィルタリング・検索機能
  - ステータス絞り込み
  - 検索キーワード入力

### 3. 型定義適用

- `src/types/features/event.ts` の型を使用
- `src/types/common/ui.ts` の BaseComponentProps を継承

### 4. バレルエクスポート

```typescript
// src/components/features/event/list/index.ts
export { EventListCard } from './EventListCard';
export { EventListFilter } from './EventListFilter';
```

## 成果物

- [ ] EventListCard.tsx
- [ ] EventListFilter.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の `app/(tabs)/index.tsx` での使用テスト
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
