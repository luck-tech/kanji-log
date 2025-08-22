# タスク 01: 型定義基盤の整備

## 概要

既存の型定義を新しいディレクトリ構造に移行し、共通型と機能別型の分離を実現する。

## 目標

- 型安全性の向上
- 機能別の型定義分離
- バレルエクスポートによるインポート簡潔化

## 作業内容

### 1. ディレクトリ構造作成

```
src/types/
├── common/
│   ├── base.ts
│   ├── ui.ts
│   └── index.ts
├── features/
│   ├── event.ts
│   ├── member.ts
│   ├── record.ts
│   ├── setting.ts
│   └── index.ts
└── index.ts
```

### 2. 既存型定義の分析と移行

- `types/index.ts` の内容を分析
- `types/common.ts` の内容を分析
- 基本型を `src/types/common/base.ts` に抽出
- UI 共通 Props 型を `src/types/common/ui.ts` に作成

### 3. 機能別型定義の作成

- イベント関連型を `src/types/features/event.ts` に定義
- メンバー関連型を `src/types/features/member.ts` に定義
- 記録関連型を `src/types/features/record.ts` に定義
- 設定関連型を `src/types/features/setting.ts` に定義

### 4. バレルエクスポートの実装

- 各階層での `index.ts` 作成
- Tree shaking 対応の named export

## 成果物

- [ ] `src/types/common/base.ts`
- [ ] `src/types/common/ui.ts`
- [ ] `src/types/common/index.ts`
- [ ] `src/types/features/event.ts`
- [ ] `src/types/features/member.ts`
- [ ] `src/types/features/record.ts`
- [ ] `src/types/features/setting.ts`
- [ ] `src/types/features/index.ts`
- [ ] `src/types/index.ts`

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の import 文が正しく解決されることを確認
- `pnpm lint` が通ることを確認

## 依存関係

- なし（最初に実行するタスク）

## 見積もり時間

- 2-3 時間
