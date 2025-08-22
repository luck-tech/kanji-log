# タスク 02: 定数・ユーティリティの移行

## 概要

既存の `constants/` ディレクトリを新しい構造 `src/utils/constants/` に移行し、デザイン定数とビジネス定数を分離する。

## 目標

- デザイン定数とビジネス定数の分離
- 将来的な拡張性の確保
- バレルエクスポートによるインポート簡潔化

## 作業内容

### 1. ディレクトリ構造作成

```
src/utils/constants/
├── design/
│   ├── colors.ts
│   ├── layout.ts
│   ├── styles.ts
│   └── index.ts
├── business/
│   ├── event.ts
│   ├── member.ts
│   └── index.ts
└── index.ts
```

### 2. 既存定数ファイルの移行

- `constants/Colors.ts` → `src/utils/constants/design/colors.ts`
- `constants/Layout.ts` → `src/utils/constants/design/layout.ts`
- `constants/EventConstants.ts` → `src/utils/constants/business/event.ts`

### 3. スタイル定数の新規作成

- 共通スタイルパターンを `src/utils/constants/design/styles.ts` に作成
- ボタン、カード、入力フィールド等の基本スタイル定義

### 4. バレルエクスポートの実装

- 各階層での `index.ts` 作成
- デザイン定数とビジネス定数の適切なエクスポート

### 5. import 文の更新

- 既存ファイルでの import 文を新しいパスに更新
- `@/utils/constants` エイリアスの活用

## 成果物

- [ ] `src/utils/constants/design/colors.ts`
- [ ] `src/utils/constants/design/layout.ts`
- [ ] `src/utils/constants/design/styles.ts`
- [ ] `src/utils/constants/design/index.ts`
- [ ] `src/utils/constants/business/event.ts`
- [ ] `src/utils/constants/business/member.ts`
- [ ] `src/utils/constants/business/index.ts`
- [ ] `src/utils/constants/index.ts`
- [ ] 既存ファイルの import 文更新

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存のスタイリングが正しく適用されることを確認
- `pnpm lint` が通ることを確認
- `pnpm dev` でアプリが正常に起動することを確認

## 依存関係

- タスク 01（型定義基盤の整備）完了後

## 見積もり時間

- 2-3 時間
