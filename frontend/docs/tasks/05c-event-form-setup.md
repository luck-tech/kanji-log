# タスク 05c: Event Form Setup コンポーネント実装

## 概要

フォーム設定画面（`app/event/[id]/form-setup.tsx`）のコンポーネントを機能別に分割し、`src/components/features/event/form-setup/` に実装する。

## 目標

- フォーム設定画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/event/form-setup/
├── MemberAddSection.tsx
├── QuestionsList.tsx
├── QuestionItem.tsx
├── FormUrlShare.tsx
└── index.ts
```

### 2. コンポーネント実装

- **MemberAddSection**: 新規メンバー追加セクション
- **QuestionsList**: 質問項目設定リスト
- **QuestionItem**: 個別質問項目（有効/無効切り替え）
- **FormUrlShare**: 生成された URL の表示・共有

### 3. 既存コードからの抽出

- `app/event/[id]/form-setup.tsx` からコンポーネント化
- フォーム状態管理ロジックと表示ロジックの分離

## 成果物

- [ ] MemberAddSection.tsx
- [ ] QuestionsList.tsx
- [ ] QuestionItem.tsx
- [ ] FormUrlShare.tsx
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の `app/event/[id]/form-setup.tsx` での使用テスト
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
