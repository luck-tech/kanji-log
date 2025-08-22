# タスク 05h: Record コンポーネント実装

## 概要

記録関連画面（`app/(tabs)/records.tsx`）のコンポーネントを機能別に分割し、`src/components/features/record/` に実装する。

## 目標

- 記録関連画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/record/
├── list/
│   ├── UnlockPrompt.tsx
│   ├── BenefitsCard.tsx
│   ├── BenefitItem.tsx
│   ├── RecordTabs.tsx
│   ├── RecordFilterButton.tsx
│   ├── RecordCard.tsx
│   ├── RecordHeader.tsx
│   ├── RecordRating.tsx
│   ├── RecordDetails.tsx
│   ├── RecordFooter.tsx
│   ├── SameCompanyBadge.tsx
│   ├── RecordActions.tsx
│   ├── RecordsList.tsx
│   ├── RecordsEmptyState.tsx
│   ├── ResultsCount.tsx
│   └── index.ts
└── index.ts
```

### 2. Unlock コンポーネント実装

- **UnlockPrompt**: ロック状態の全体表示
- **BenefitsCard**: メリット説明カード
- **BenefitItem**: 個別メリット項目

### 3. Records List コンポーネント実装

- **RecordTabs**: タブ切り替え
- **RecordFilterButton**: フィルターボタン
- **RecordCard**: 個別記録カード
- **RecordsList**: 記録一覧全体
- **RecordsEmptyState**: 空状態表示
- **ResultsCount**: 検索結果件数

### 4. Record Card 内部コンポーネント実装

- **RecordHeader**: 店舗名 + 評価 + 目的
- **RecordRating**: 星評価表示
- **RecordDetails**: 価格・住所等詳細
- **RecordFooter**: 主催者情報 + アクション
- **SameCompanyBadge**: 同じ会社バッジ
- **RecordActions**: いいねボタン等

## 成果物

- [ ] `record/list/` 配下の全コンポーネント
- [ ] `record/index.ts`

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- タブ切り替え機能が正常に動作することを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
