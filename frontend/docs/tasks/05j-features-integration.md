# タスク 05j: Features 統合とバレルエクスポート

## 概要

全ドメインのバレルエクスポートを統合し、機能別コンポーネント基盤の最終確認を行う。

## 目標

- 全ドメインの統一されたエクスポート
- インポート文の最適化
- 動作確認とドキュメント更新

## 作業内容

### 1. ドメイン別バレルエクスポート確認

```typescript
// src/components/features/event/index.ts
export * from './list';
export * from './detail';
export * from './form-setup';
export * from './schedule-results';
export * from './restaurant-suggestions';
export * from './reservation-support';

// src/components/features/member/index.ts
export * from './list';
export * from './detail';

// src/components/features/record/index.ts
export * from './list';

// src/components/features/settings/index.ts
export * from './ProfileCard';
export * from './StatsCard';
// ... 他のコンポーネント
```

### 2. 全体統合エクスポート作成

```typescript
// src/components/features/index.ts
export * from './event';
export * from './member';
export * from './record';
export * from './settings';
```

### 3. 使用例確認

```typescript
// 特定機能からの import
import { EventListCard } from '@/components/features/event/list';

// ドメイン全体からの import
import { EventListCard, EventOverviewCard } from '@/components/features/event';

// 全ドメインからの import
import { EventListCard, MemberCard, RecordCard } from '@/components/features';
```

### 4. 動作確認

- 各画面での新しいコンポーネント使用テスト
- import 文の正しい解決確認
- TypeScript エラーチェック

### 5. ドキュメント更新

- README.md のディレクトリ構造更新
- 使用例の追加

## 成果物

- [ ] `src/components/features/event/index.ts`
- [ ] `src/components/features/member/index.ts`
- [ ] `src/components/features/record/index.ts`
- [ ] `src/components/features/settings/index.ts`
- [ ] `src/components/features/index.ts`
- [ ] 全画面での動作確認完了
- [ ] ドキュメント更新

## 検証方法

- 全ドメインのバレルエクスポートが正しく機能することを確認
- アプリが正常に起動・動作することを確認
- TypeScript コンパイルエラーがないことを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 0.5-1 時間
