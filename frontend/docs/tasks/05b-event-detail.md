# タスク 05b: Event Detail コンポーネント実装

## 概要

イベント詳細画面（`app/event/[id].tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/detail/` に実装する。

## 目標

- イベント詳細画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/detail/
├── EventOverviewCard.tsx
├── EventActionsList.tsx
├── EventMembersList.tsx
├── EventStatusIndicator.tsx
└── index.ts
```

### 2. コンポーネント実装

- **EventOverviewCard**: イベント概要表示（ステータス、確定日程、会場情報等）
- **EventActionsList**: アクション一覧（フォーム作成、日程調整、レストラン提案等）
- **EventMembersList**: メンバーリスト表示
- **EventStatusIndicator**: ステータス表示（調整中/確定済み/開催済み）

### 3. 既存コードからの抽出

- `app/event/[id].tsx` からコンポーネント化できる部分を抽出
- 状態管理は親コンポーネントに残し、表示ロジックのみ分離

## 成果物

- [ ] EventOverviewCard.tsx
- [ ] EventActionsList.tsx
- [ ] EventMembersList.tsx
- [ ] EventStatusIndicator.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の `app/event/[id].tsx` での使用テスト
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
