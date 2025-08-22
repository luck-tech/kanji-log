# タスク 06: モーダルコンポーネントの機能別統合

## 概要

既存の `components/modals/` ディレクトリのモーダルコンポーネントを対応する機能ディレクトリに移行し、機能別の責任を明確化する。

## 目標

- モーダルの機能別責任の明確化
- 既存モーダルの新構造への適用
- 機能固有のロジック整理

## 作業内容

### 1. 既存モーダルの分析と分類

```
既存モーダル → 移行先
├── EventCreateModal.tsx → src/components/features/event/
├── EventLogModal.tsx → src/components/features/event/
├── MemberAddModal.tsx → src/components/features/member/
├── MemberEditModal.tsx → src/components/features/member/
├── RecordDetailModal.tsx → src/components/features/record/
├── FilterModal.tsx → src/components/features/record/
├── ProfileEditModal.tsx → src/components/features/setting/
├── AccountDeleteModal.tsx → src/components/features/setting/
├── AreaSelectionModal.tsx → src/components/features/event/
├── DateScheduleModal.tsx → src/components/features/event/
└── CustomDateTimePicker.tsx → src/components/common/ui/
```

### 2. イベント機能モーダルの移行

- **EventCreateModal**: イベント作成モーダル
- **EventLogModal**: イベントログ表示モーダル
- **AreaSelectionModal**: エリア選択モーダル
- **DateScheduleModal**: 日程調整モーダル

### 3. メンバー機能モーダルの移行

- **MemberAddModal**: メンバー追加モーダル
- **MemberEditModal**: メンバー編集モーダル

### 4. 記録機能モーダルの移行

- **RecordDetailModal**: 記録詳細表示モーダル
- **FilterModal**: フィルターモーダル

### 5. 設定機能モーダルの移行

- **ProfileEditModal**: プロフィール編集モーダル
- **AccountDeleteModal**: アカウント削除モーダル

### 6. 共通モーダルの移行

- **CustomDateTimePicker**: 日時選択コンポーネント → `src/components/common/ui/`

### 7. 型定義・定数の適用

- 新しい型定義の適用
- デザイン定数の活用
- 機能別コンポーネントとの統合

### 8. バレルエクスポートの更新

- 各機能ディレクトリの `index.ts` 更新
- モーダルコンポーネントのエクスポート追加

### 9. 既存ファイルの import 文更新

- app/ 配下でのモーダル使用箇所の更新
- 新しいパスでの import

## 成果物

- [ ] `src/components/features/event/EventCreateModal.tsx`
- [ ] `src/components/features/event/EventLogModal.tsx`
- [ ] `src/components/features/event/AreaSelectionModal.tsx`
- [ ] `src/components/features/event/DateScheduleModal.tsx`
- [ ] `src/components/features/member/MemberAddModal.tsx`
- [ ] `src/components/features/member/MemberEditModal.tsx`
- [ ] `src/components/features/record/RecordDetailModal.tsx`
- [ ] `src/components/features/record/FilterModal.tsx`
- [ ] `src/components/features/setting/ProfileEditModal.tsx`
- [ ] `src/components/features/setting/AccountDeleteModal.tsx`
- [ ] `src/components/common/ui/CustomDateTimePicker.tsx`
- [ ] 各 `index.ts` の更新
- [ ] 既存ファイルの import 文更新

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 各モーダルが正しく表示・動作することを確認
- モーダルの開閉アニメーションが正常に動作することを確認
- `pnpm lint` が通ることを確認
- `pnpm dev` でアプリが正常に起動することを確認

## 依存関係

- タスク 01（型定義基盤の整備）完了後
- タスク 02（定数・ユーティリティの移行）完了後
- タスク 03（共通 UI コンポーネントの移行）完了後
- タスク 05（機能別コンポーネント基盤の整備）完了後

## 見積もり時間

- 3-4 時間
