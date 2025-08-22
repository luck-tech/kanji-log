# タスク 04: カスタムフックの移行・整備

## 概要

既存の `hooks/` ディレクトリを新しい構造 `src/hooks/` に移行し、共通フックと機能別フック用の基盤を整備する。

## 目標

- フック責任の明確化（common/ と features/ の分離）
- 新しい型定義の適用
- 将来の機能別フック追加への準備

## 作業内容

### 1. ディレクトリ構造作成

```
src/hooks/
├── common/
│   ├── useFrameworkReady.ts
│   └── index.ts
├── features/
│   ├── event/
│   │   └── index.ts
│   ├── member/
│   │   └── index.ts
│   ├── record/
│   │   └── index.ts
│   ├── setting/
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

### 2. 既存フックの移行

- `hooks/useFrameworkReady.ts` → `src/hooks/common/useFrameworkReady.ts`
- 新しい型定義の適用
- 型安全性の向上

### 3. 機能別フック用基盤の準備

- 各機能（event/member/record/setting）のディレクトリ作成
- 将来のフック追加に備えた構造準備
- 基本的な index.ts ファイルの作成

### 4. バレルエクスポートの実装

- 各階層での `index.ts` 作成
- 共通フックと機能別フックの適切なエクスポート

### 5. 既存ファイルの import 文更新

- app/ 配下のファイルでの import 文を更新
- `@/hooks/common` エイリアスの活用

## 成果物

- [ ] `src/hooks/common/useFrameworkReady.ts`
- [ ] `src/hooks/common/index.ts`
- [ ] `src/hooks/features/event/index.ts`
- [ ] `src/hooks/features/member/index.ts`
- [ ] `src/hooks/features/record/index.ts`
- [ ] `src/hooks/features/setting/index.ts`
- [ ] `src/hooks/features/index.ts`
- [ ] `src/hooks/index.ts`
- [ ] 既存ファイルの import 文更新

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存のフック機能が正しく動作することを確認
- `pnpm lint` が通ることを確認
- `pnpm dev` でアプリが正常に起動することを確認

## 依存関係

- タスク 01（型定義基盤の整備）完了後

## 見積もり時間

- 1-2 時間
