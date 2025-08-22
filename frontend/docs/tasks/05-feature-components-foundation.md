# タスク 05: 機能別コンポーネント基盤の整備（総合タスク）

## 概要

ドメイン + 機能の階層構造で機能別コンポーネントディレクトリを作成し、論理的なグループ化と将来の拡張性を確保する。このタスクは複数のサブタスクに分割して実行する。

## 目標

- ドメインごとの論理的なグループ化
- ルーティング構造との対応関係維持
- 機能間の適切な境界設定
- 将来の機能追加に対する拡張性確保

## サブタスク一覧

### Phase A: Event Domain

- **05a-event-list**: イベント一覧画面コンポーネント（`app/(tabs)/index.tsx`）
- **05b-event-detail**: イベント詳細画面コンポーネント（`app/event/[id].tsx`）
- **05c-event-form-setup**: フォーム設定画面コンポーネント（`app/event/[id]/form-setup.tsx`）
- **05d-event-schedule-results**: 日程調整結果画面コンポーネント（`app/event/[id]/schedule-results.tsx`）
- **05e-event-restaurant-suggestions**: レストラン提案画面コンポーネント（`app/event/[id]/restaurant-suggestions.tsx`）
- **05f-event-reservation-support**: 予約サポート画面コンポーネント（`app/event/[id]/reservation-support.tsx`）

### Phase B: Other Domains

- **05g-member-components**: メンバー関連コンポーネント（`app/(tabs)/members.tsx`、`app/member/[id].tsx`）
- **05h-record-components**: 記録関連コンポーネント（`app/(tabs)/records.tsx`）
- **05i-settings-components**: 設定関連コンポーネント（`app/(tabs)/settings.tsx`）

### Phase C: 統合

- **05j-features-integration**: 全ドメインのバレルエクスポート統合と動作確認

## 実行順序

1. **Phase A**: Event Domain（6 サブタスク）を順次実行
2. **Phase B**: Other Domains（3 サブタスク）を並行実行可能
3. **Phase C**: 統合作業

## 各サブタスクの見積もり時間

- **05a-05f** (Event Domain): 各 1-1.5 時間（計 6-9 時間）
- **05g** (Member): 1.5-2 時間
- **05h** (Record): 1-1.5 時間
- **05i** (Settings): 1-1.5 時間
- **05j** (統合): 0.5-1 時間

**総計**: 10-15 時間

## 作業内容

### 1. ディレクトリ構造作成

```
src/components/features/
├── event/                   # イベント関連ドメイン
│   ├── list/               # app/(tabs)/index.tsx 対応
│   │   ├── EventListCard.tsx
│   │   ├── EventListFilter.tsx
│   │   └── index.ts
│   ├── detail/             # app/event/[id]/[id].tsx 対応
│   │   ├── EventOverviewCard.tsx
│   │   ├── EventActionsList.tsx
│   │   ├── EventMembersList.tsx
│   │   ├── EventStatusIndicator.tsx
│   │   └── index.ts
│   ├── form-setup/         # app/event/[id]/form-setup.tsx 対応
│   │   ├── MemberAddSection.tsx
│   │   ├── QuestionsList.tsx
│   │   ├── QuestionItem.tsx
│   │   ├── FormUrlShare.tsx
│   │   └── index.ts
│   ├── schedule-results/   # app/event/[id]/schedule-results.tsx 対応
│   │   ├── ScheduleSummaryCard.tsx
│   │   ├── DateOptionCard.tsx
│   │   ├── ResponseTable.tsx
│   │   ├── DateConfirmFooter.tsx
│   │   └── index.ts
│   ├── restaurant-suggestions/ # app/event/[id]/restaurant-suggestions.tsx 対応
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantSelection.tsx
│   │   ├── RecommendationExplanation.tsx
│   │   └── index.ts
│   ├── reservation-support/ # app/event/[id]/reservation-support.tsx 対応
│   │   ├── ReservationEventInfo.tsx
│   │   ├── RestaurantContactInfo.tsx
│   │   ├── ReservationActions.tsx
│   │   ├── ReservationReportForm.tsx
│   │   ├── ReservationTips.tsx
│   │   └── index.ts
│   └── index.ts            # イベントドメイン全体のエクスポート
├── member/                 # メンバー関連ドメイン
│   ├── list/              # app/(tabs)/members.tsx 対応
│   │   ├── MemberCard.tsx
│   │   ├── MemberSearchBar.tsx
│   │   ├── MembersList.tsx
│   │   ├── MembersEmptyState.tsx
│   │   └── index.ts
│   ├── detail/            # app/member/[id].tsx 対応
│   │   ├── MemberProfileHeader.tsx
│   │   ├── MemberPreferencesCard.tsx
│   │   ├── MemberNotesCard.tsx
│   │   ├── MemberActionsCard.tsx
│   │   ├── AlcoholPreferenceBadge.tsx
│   │   ├── AllergiesTagsList.tsx
│   │   ├── FavoriteGenresTagsList.tsx
│   │   ├── BudgetRangeDisplay.tsx
│   │   └── index.ts
│   └── index.ts
├── record/                 # 記録関連ドメイン
│   ├── list/              # app/(tabs)/records.tsx 対応
│   │   ├── UnlockPrompt.tsx
│   │   ├── BenefitsCard.tsx
│   │   ├── BenefitItem.tsx
│   │   ├── RecordTabs.tsx
│   │   ├── RecordFilterButton.tsx
│   │   ├── RecordCard.tsx
│   │   ├── RecordHeader.tsx
│   │   ├── RecordRating.tsx
│   │   ├── RecordDetails.tsx
│   │   ├── RecordFooter.tsx
│   │   ├── SameCompanyBadge.tsx
│   │   ├── RecordActions.tsx
│   │   ├── RecordsList.tsx
│   │   ├── RecordsEmptyState.tsx
│   │   ├── ResultsCount.tsx
│   │   └── index.ts
│   └── index.ts
├── settings/              # 設定関連ドメイン
│   └── list/              # app/(tabs)/settings.tsx 対応
│       ├── ProfileCard.tsx
│       ├── ProfileHeader.tsx
│       ├── ProfileDetails.tsx
│       ├── ProfileDetailItem.tsx
│       ├── FollowStats.tsx
│       ├── FollowStatItem.tsx
│       ├── EditProfileButton.tsx
│       ├── FollowButton.tsx
│       ├── StatsCard.tsx
│       ├── StatItem.tsx
│       ├── SettingsGroup.tsx
│       ├── SettingItem.tsx
│       ├── SettingItemIcon.tsx
│       ├── SettingItemContent.tsx
│       ├── AppInfoCard.tsx
│       ├── AppIcon.tsx
│       ├── AppDetails.tsx
│       └── index.ts
└── index.ts
```

**注意事項:**

- 上記ファイル分割は実装時のイメージです
- 実際の実装時にはファイル分割の粒度や命名を調整してください
- 各画面の既存コードを分析して、適切なコンポーネント化を行ってください

### 2. 命名規則とアーキテクチャ原則

- **ドメイン分離**: `event/`, `member/`, `record/`, `settings/` でドメイン境界を明確化
- **機能分離**: 各ドメイン内で画面ごとの機能を分離
- **依存関係**: 同一ドメイン内は密結合可、異なるドメイン間は疎結合
- **共通化**: ドメイン横断的な機能は `src/components/common/` を使用

### 3. 各ドメインの役割

#### Event Domain（イベント関連）

- **list/**: イベント一覧画面のコンポーネント
- **detail/**: イベント詳細画面のコンポーネント
- **form-setup/**: フォーム設定画面のコンポーネント
- **schedule-results/**: 日程調整結果画面のコンポーネント
- **restaurant-suggestions/**: レストラン提案画面のコンポーネント
- **reservation-support/**: 予約サポート画面のコンポーネント

#### Member Domain（メンバー関連）

- **management/**: メンバー管理画面のコンポーネント

#### Record Domain（記録関連）

- **list/**: 記録一覧画面のコンポーネント

#### Settings Domain（設定関連）

- 設定画面のコンポーネント（単一画面のため階層化なし）

### 4. バレルエクスポート戦略

```typescript
// ドメイン内機能のエクスポート
// src/components/features/event/detail/index.ts
export { EventOverviewCard } from './EventOverviewCard';
export { EventActionsList } from './EventActionsList';

// ドメイン全体のエクスポート
// src/components/features/event/index.ts
export * from './list';
export * from './detail';
export * from './form-setup';

// 全ドメインのエクスポート
// src/components/features/index.ts
export * from './event';
export * from './member';
export * from './record';
export * from './settings';
```

### 5. 使用例

```typescript
// 特定機能からの import
import { EventListCard } from '@/components/features/event/list';
import { EventOverviewCard } from '@/components/features/event/detail';

// ドメイン全体からの import
import {
  EventListCard,
  EventOverviewCard,
  MemberAddSection,
} from '@/components/features/event';

// 全ドメインからの import
import { EventListCard, MemberCard, RecordCard } from '@/components/features';
```

## 成果物（各サブタスクで作成）

### Phase A: Event Domain

- [ ] `src/components/features/event/list/` 配下のコンポーネント（05a）
- [ ] `src/components/features/event/detail/` 配下のコンポーネント（05b）
- [ ] `src/components/features/event/form-setup/` 配下のコンポーネント（05c）
- [ ] `src/components/features/event/schedule-results/` 配下のコンポーネント（05d）
- [ ] `src/components/features/event/restaurant-suggestions/` 配下のコンポーネント（05e）
- [ ] `src/components/features/event/reservation-support/` 配下のコンポーネント（05f）

### Phase B: Other Domains

- [ ] `src/components/features/member/` 配下のコンポーネント（05g）
- [ ] `src/components/features/record/` 配下のコンポーネント（05h）
- [ ] `src/components/features/settings/` 配下のコンポーネント（05i）

### Phase C: 統合

- [ ] `src/components/features/index.ts` 全体統合（05j）
- [ ] 各ドメインの `index.ts` 最終確認（05j）

## 検証方法

- 各サブタスク完了時: そのドメイン内の TypeScript コンパイル確認
- Phase 完了時: `pnpm lint` が通ることを確認
- 最終統合時: 全体の動作確認

## 依存関係

- 各サブタスクは タスク 01（型定義）、タスク 02（定数）、タスク 03（共通 UI）完了後に実行可能
- Phase A 内のサブタスクは独立して並行実行可能
- Phase B 内のサブタスクは独立して並行実行可能
- Phase C は Phase A、B 完了後に実行

## 総見積もり時間

- 10-15 時間（サブタスク分割により管理しやすくなる）
