# タスク 03: 共通 UI コンポーネントの移行

## 概要

既存の `components/common/` を新しい構造 `src/components/common/` に移行し、UI コンポーネントとレイアウトコンポーネントを分離する。

## 目標

- UI 責任の明確化（ui/ と layout/ の分離）
- 新しい型定義・定数の適用
- バレルエクスポートによるインポート簡潔化

## 作業内容

### 1. ディレクトリ構造作成

```
src/components/common/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Animations.tsx
│   ├── EmptyState.tsx
│   ├── EventCard.tsx
│   ├── FloatingActionButton.tsx
│   ├── SkeletonLoader.tsx
│   └── index.ts
├── layout/
│   ├── Header.tsx
│   ├── TabBar.tsx
│   └── index.ts
└── index.ts
```

### 2. 既存コンポーネントの移行

- `components/common/Button.tsx` → `src/components/common/ui/Button.tsx`
- `components/common/Card.tsx` → `src/components/common/ui/Card.tsx`
- `components/common/Input.tsx` → `src/components/common/ui/Input.tsx`
- `components/common/Animations.tsx` → `src/components/common/ui/Animations.tsx`
- `components/common/Header.tsx` → `src/components/common/layout/Header.tsx`
- その他のコンポーネント類も適切なディレクトリに配置

### 3. 型定義・定数の適用

- 新しい型定義（`src/types/common/ui.ts`）の適用
- 新しい定数（`src/utils/constants/design/`）の適用
- BaseComponentProps の継承

### 4. バレルエクスポートの実装

- `src/components/common/ui/index.ts` の作成
- `src/components/common/layout/index.ts` の作成
- `src/components/common/index.ts` の作成

### 5. 既存ファイルの import 文更新

- app/ 配下のファイルでの import 文を更新
- `@/components/common/ui` エイリアスの活用

## 成果物

- [ ] `src/components/common/ui/` 配下の全コンポーネント
- [ ] `src/components/common/layout/` 配下の全コンポーネント
- [ ] 各階層の `index.ts` バレルエクスポート
- [ ] 既存ファイルの import 文更新
- [ ] 新しい型定義・定数の適用

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の画面が正しく表示されることを確認
- アニメーション・スタイリングが正常に動作することを確認
- `pnpm lint` が通ることを確認
- `pnpm dev` でアプリが正常に起動することを確認

## 依存関係

- タスク 01（型定義基盤の整備）完了後
- タスク 02（定数・ユーティリティの移行）完了後

## 見積もり時間

- 3-4 時間
