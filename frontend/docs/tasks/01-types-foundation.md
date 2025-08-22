# タスク 01: 型定義基盤の整備

## 概要

既存の型定義を新しいディレクトリ構造に移行し、共通型と機能別型の分離を実現する。既存の modal 関連の interface も含めて包括的に整理する。

## 目標

- 型安全性の向上
- 機能別の型定義分離
- バレルエクスポートによるインポート簡潔化
- modal 関連 interface の適切な機能別配置

## 作業内容

### 1. ディレクトリ構造作成

```
src/types/
├── common/
│   ├── base.ts           # ID、Date等の基本型
│   ├── ui.ts            # UIコンポーネント共通Props
│   └── index.ts         # バレルエクスポート
├── features/
│   ├── event.ts         # イベント関連型（modal含む）
│   ├── member.ts        # メンバー関連型（modal含む）
│   ├── record.ts        # 記録関連型（modal含む）
│   ├── setting.ts       # 設定関連型（modal含む）
│   └── index.ts         # バレルエクスポート
└── index.ts             # 全体エクスポート
```

### 2. 既存型定義の包括的分析

#### 2.1 基本型定義ファイルの分析

- `types/index.ts` の内容を分析
- `types/common.ts` の内容を分析
- 基本型（ID、Date、共通 Props 等）を特定

#### 2.2 Modal 関連 interface の分析

- プロジェクト全体で `export interface` を検索
- Modal 関連の interface を特定し、所属機能を判定
- 例：
  - `EventCreateModalProps` → `event.ts`
  - `MemberEditModalProps` → `member.ts`
  - `RecordShareModalProps` → `record.ts`

#### 2.3 画面別型定義の分析

- 各画面ファイル内で定義されている interface を特定
- 機能別の型定義として整理対象を特定

### 3. 型定義の移行作業

#### 3.1 共通型の整理

- 基本型を `src/types/common/base.ts` に移行
- UI 共通 Props 型を `src/types/common/ui.ts` に作成

#### 3.2 機能別型定義の作成・移行

- **Event 関連** (`src/types/features/event.ts`):

  - イベント本体の型定義
  - フォーム設定関連の型
  - 日程調整関連の型
  - レストラン提案関連の型
  - 予約サポート関連の型
  - Event 関連 modal（EventCreateModal、EventLogModal 等）の型定義

- **Member 関連** (`src/types/features/member.ts`):

  - メンバー本体の型定義
  - プロフィール関連の型
  - Member 関連 modal（MemberEditModal 等）の型定義

- **Record 関連** (`src/types/features/record.ts`):

  - 記録本体の型定義
  - 共有設定関連の型
  - フィルタリング関連の型
  - Record 関連 modal の型定義

- **Setting 関連** (`src/types/features/setting.ts`):
  - ユーザー設定関連の型
  - アプリ設定関連の型
  - Setting 関連 modal の型定義

### 4. 既存 import 文の更新

- 既存ファイルで型定義を参照している箇所を特定
- 新しいパス構造に合わせて import 文を更新
- `@/types` エイリアスを活用した簡潔な import

### 5. バレルエクスポートの実装

- 各階層での `index.ts` 作成
- Tree shaking 対応の named export
- 利便性を考慮した re-export 設計

## 詳細作業手順

### Step 1: 既存型定義の棚卸し

```bash
# Modal関連interfaceの検索
grep -r "export interface.*Modal" frontend/
grep -r "export interface.*Props" frontend/

# 既存型定義ファイルの確認
find frontend/types -name "*.ts" -exec echo "=== {} ===" \; -exec cat {} \;
```

### Step 2: 移行マッピングの作成

- 既存の各 interface がどの機能（event/member/record/setting）に属するかを分類
- 共通型として扱うべきものを特定

### Step 3: 段階的移行

1. 共通型の作成・移行
2. 機能別型の作成・移行（modal 含む）
3. バレルエクスポートの実装
4. import 文の更新

## 成果物

### 作成ファイル

- [ ] `src/types/common/base.ts`
- [ ] `src/types/common/ui.ts`
- [ ] `src/types/common/index.ts`
- [ ] `src/types/features/event.ts`（modal 関連型含む）
- [ ] `src/types/features/member.ts`（modal 関連型含む）
- [ ] `src/types/features/record.ts`（modal 関連型含む）
- [ ] `src/types/features/setting.ts`（modal 関連型含む）
- [ ] `src/types/features/index.ts`
- [ ] `src/types/index.ts`

### 更新作業

- [ ] 既存ファイルの import 文更新（modal 関連含む）
- [ ] tsconfig.json のパスエイリアス確認・更新

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- 既存の import 文が正しく解決されることを確認
- modal 関連の interface が適切に参照できることを確認
- `pnpm lint` が通ることを確認
- `pnpm type-check` が通ることを確認

## 依存関係

- なし（最初に実行するタスク）

## 見積もり時間

- 4-6 時間（modal 関連 interface 移行を含む包括的作業）

## 注意事項

- 既存の modal 関連 interface の所属機能判定時は、使用箇所を確認して適切に分類する
- 複数機能で共有される型は`common/`に配置する
- 移行時は一度に全てを変更せず、機能別に段階的に進める
