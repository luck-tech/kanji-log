# タスク 05g: Member コンポーネント実装

## 概要

メンバー関連画面（`app/(tabs)/members.tsx`、`app/member/[id].tsx`）のコンポーネントを機能別に分割し、`src/components/features/member/` に実装する。

## 目標

- メンバー関連画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/member/
├── list/
│   ├── MemberCard.tsx
│   ├── MemberSearchBar.tsx
│   ├── MembersList.tsx
│   ├── MembersEmptyState.tsx
│   └── index.ts
├── detail/
│   ├── MemberProfileHeader.tsx
│   ├── MemberPreferencesCard.tsx
│   ├── MemberNotesCard.tsx
│   ├── MemberActionsCard.tsx
│   ├── AlcoholPreferenceBadge.tsx
│   ├── AllergiesTagsList.tsx
│   ├── FavoriteGenresTagsList.tsx
│   ├── BudgetRangeDisplay.tsx
│   └── index.ts
└── index.ts
```

### 2. List コンポーネント実装

- **MemberCard**: 個別メンバー表示カード
- **MemberSearchBar**: 検索バー + 追加ボタン
- **MembersList**: メンバーリスト全体
- **MembersEmptyState**: 空状態表示

### 3. Detail コンポーネント実装

- **MemberProfileHeader**: プロフィール概要
- **MemberPreferencesCard**: 食事の好み・制限
- **MemberNotesCard**: メモ表示
- **MemberActionsCard**: アクション（編集・削除）
- **AlcoholPreferenceBadge**: アルコール好み表示
- **AllergiesTagsList**: アレルギータグ一覧
- **FavoriteGenresTagsList**: 好きなジャンルタグ一覧
- **BudgetRangeDisplay**: 予算帯表示

## 成果物

- [ ] `member/list/` 配下の全コンポーネント
- [ ] `member/detail/` 配下の全コンポーネント
- [ ] 各階層の index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存画面での使用テスト
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1.5-2 時間
