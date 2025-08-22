# タスク 05d: Event Schedule Results コンポーネント実装

## 概要

日程調整結果画面（`app/event/[id]/schedule-results.tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/schedule-results/` に実装する。

## 目標

- 日程調整結果画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/schedule-results/
├── ScheduleSummaryCard.tsx
├── DateOptionCard.tsx
├── ResponseTable.tsx
├── DateConfirmFooter.tsx
└── index.ts
```

### 2. コンポーネント実装

- **ScheduleSummaryCard**: 調整結果サマリー
- **DateOptionCard**: 候補日詳細カード
- **ResponseTable**: 個別回答テーブル（横スクロール対応）
- **DateConfirmFooter**: 日程確定フッター

### 3. 既存コードからの抽出

- `app/event/[id]/schedule-results.tsx` からコンポーネント化
- 日程選択状態管理と表示ロジックの分離

## 成果物

- [ ] ScheduleSummaryCard.tsx
- [ ] DateOptionCard.tsx
- [ ] ResponseTable.tsx
- [ ] DateConfirmFooter.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 横スクロールテーブルが正常に動作することを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
