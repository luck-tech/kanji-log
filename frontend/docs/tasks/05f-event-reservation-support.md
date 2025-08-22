# タスク 05f: Event Reservation Support コンポーネント実装

## 概要

予約サポート画面（`app/event/[id]/reservation-support.tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/reservation-support/` に実装する。

## 目標

- 予約サポート画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/reservation-support/
├── ReservationEventInfo.tsx
├── RestaurantContactInfo.tsx
├── ReservationActions.tsx
├── ReservationReportForm.tsx
├── ReservationTips.tsx
└── index.ts
```

### 2. コンポーネント実装

- **ReservationEventInfo**: イベント概要表示
- **RestaurantContactInfo**: 店舗連絡先情報
- **ReservationActions**: 予約アクションボタン群
- **ReservationReportForm**: 予約完了報告フォーム
- **ReservationTips**: 予約のコツ表示

### 3. 既存コードからの抽出

- `app/event/[id]/reservation-support.tsx` からコンポーネント化
- 予約状態管理と表示ロジックの分離

## 成果物

- [ ] ReservationEventInfo.tsx
- [ ] RestaurantContactInfo.tsx
- [ ] ReservationActions.tsx
- [ ] ReservationReportForm.tsx
- [ ] ReservationTips.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 外部アプリ連携（電話、地図）が正常に動作することを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
