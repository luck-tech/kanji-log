# タスク 05i: Settings コンポーネント実装

## 概要

設定関連画面（`app/(tabs)/settings.tsx`）のコンポーネントを機能別に分割し、`src/components/features/settings/` に実装する。

## 目標

- 設定関連画面の再利用可能コンポーネント化
- 画面ロジックと UI コンポーネントの分離

## 作業内容

### 1. ディレクトリ作成

```
src/components/features/settings/list/
├── ProfileCard.tsx
├── ProfileHeader.tsx
├── ProfileDetails.tsx
├── ProfileDetailItem.tsx
├── FollowStats.tsx
├── FollowStatItem.tsx
├── EditProfileButton.tsx
├── FollowButton.tsx
├── StatsCard.tsx
├── StatItem.tsx
├── SettingsGroup.tsx
├── SettingItem.tsx
├── SettingItemIcon.tsx
├── SettingItemContent.tsx
├── AppInfoCard.tsx
├── AppIcon.tsx
├── AppDetails.tsx
└── index.ts
```

### 2. Profile Section コンポーネント実装

- **ProfileCard**: プロフィール全体カード
- **ProfileHeader**: アバター + 名前 + ボタン
- **ProfileDetails**: 詳細情報（性別・都道府県等）
- **ProfileDetailItem**: 個別詳細項目
- **FollowStats**: フォロー・フォロワー統計
- **FollowStatItem**: 個別統計項目
- **EditProfileButton**: プロフィール編集ボタン
- **FollowButton**: フォロー/フォロー解除ボタン

### 3. Stats Section コンポーネント実装

- **StatsCard**: 幹事統計カード
- **StatItem**: 個別統計項目

### 4. Settings List コンポーネント実装

- **SettingsGroup**: 設定項目グループ
- **SettingItem**: 個別設定項目
- **SettingItemIcon**: 設定項目アイコン
- **SettingItemContent**: 設定項目内容

### 5. App Info コンポーネント実装

- **AppInfoCard**: アプリ情報カード
- **AppIcon**: アプリアイコン
- **AppDetails**: アプリ詳細情報

## 成果物

- [ ] Profile 関連コンポーネント（8 ファイル）
- [ ] Stats 関連コンポーネント（2 ファイル）
- [ ] Settings 関連コンポーネント（4 ファイル）
- [ ] App Info 関連コンポーネント（3 ファイル）
- [ ] index.ts

## 検証方法

- TypeScript コンパイルエラーがないことを確認
- プロフィール表示・編集機能が正常に動作することを確認
- `pnpm lint` が通ることを確認

## 見積もり時間

- 1-1.5 時間
