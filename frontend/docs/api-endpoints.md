# 幹事ナビ API エンドポイント仕様書

このドキュメントは、幹事ナビフロントエンドアプリケーションの分析に基づいて、必要と思われる API エンドポイントをまとめたものです。

## 目次

1. [認証・認可](#認証認可)
2. [イベント管理](#イベント管理)
3. [メンバー管理](#メンバー管理)
4. [フォーム機能](#フォーム機能)
5. [日程調整](#日程調整)
6. [レストラン提案](#レストラン提案)
7. [予約サポート](#予約サポート)
8. [記録管理](#記録管理)
9. [ユーザー設定](#ユーザー設定)
10. [外部 API 連携](#外部api連携)

## 認証・認可

### 認証

**ベース URL**: `/auth`

- **POST** `/auth/login` - ログイン
- **POST** `/auth/logout` - ログアウト
- **POST** `/auth/refresh` - トークンリフレッシュ
- **GET** `/auth/me` - 現在のユーザー情報取得

### アカウント管理

- **DELETE** `/auth/account` - アカウント削除
- **PUT** `/auth/password` - パスワード変更

## イベント管理

**ベース URL**: `/events`

### CRUD 操作

- **GET** `/events` - イベント一覧取得（フィルタ対応）
- **POST** `/events` - イベント作成
- **GET** `/events/{eventId}` - イベント詳細取得
- **PUT** `/events/{eventId}` - イベント更新
- **DELETE** `/events/{eventId}` - イベント削除

### イベントステータス管理

- **PUT** `/events/{eventId}/status` - イベントステータス更新
- **PUT** `/events/{eventId}/confirm` - イベント確定

### イベントメンバー管理

- **GET** `/events/{eventId}/members` - イベント参加メンバー一覧
- **POST** `/events/{eventId}/members` - メンバー追加
- **DELETE** `/events/{eventId}/members/{memberId}` - メンバー除外

## メンバー管理

**ベース URL**: `/members`

### CRUD 操作

- **GET** `/members` - メンバー一覧取得（検索・フィルタ対応）
- **POST** `/members` - メンバー作成
- **GET** `/members/{memberId}` - メンバー詳細取得
- **PUT** `/members/{memberId}` - メンバー情報更新
- **DELETE** `/members/{memberId}` - メンバー削除

### メンバー設定管理

- **PUT** `/members/{memberId}/preferences` - 嗜好設定更新
- **GET** `/members/{memberId}/history` - 参加履歴取得

## フォーム機能

**ベース URL**: `/forms`

### フォーム作成・管理

- **POST** `/events/{eventId}/forms` - イベント用フォーム作成
- **GET** `/events/{eventId}/forms/{formId}` - フォーム設定取得
- **PUT** `/events/{eventId}/forms/{formId}` - フォーム設定更新

### 公開フォーム（認証不要）

- **GET** `/public/forms/{formId}` - 公開フォーム情報取得
- **POST** `/public/forms/{formId}/responses` - フォーム回答送信

### フォーム回答管理

- **GET** `/events/{eventId}/forms/{formId}/responses` - 回答一覧取得
- **GET** `/events/{eventId}/forms/{formId}/stats` - 回答統計取得

## 日程調整

**ベース URL**: `/schedule`

### 日程候補管理

- **POST** `/events/{eventId}/schedule/options` - 日程候補設定
- **GET** `/events/{eventId}/schedule/options` - 日程候補取得
- **PUT** `/events/{eventId}/schedule/options` - 日程候補更新

### 日程回答（公開エンドポイント）

- **POST** `/public/schedule/{eventId}/responses` - 日程回答送信
- **GET** `/public/schedule/{eventId}` - 日程調整情報取得

### 結果集計

- **GET** `/events/{eventId}/schedule/results` - 日程調整結果取得
- **POST** `/events/{eventId}/schedule/confirm` - 日程確定

## レストラン提案

**ベース URL**: `/restaurants`

### レストラン検索・提案

- **POST** `/events/{eventId}/restaurants/search` - エリア・条件指定検索
- **GET** `/events/{eventId}/restaurants/suggestions` - AI 推薦レストラン取得
- **POST** `/events/{eventId}/restaurants/area-analysis` - メンバー位置分析

### レストラン選択

- **POST** `/events/{eventId}/restaurants/select` - レストラン選択・決定

## 予約サポート

**ベース URL**: `/reservations`

### 予約情報管理

- **GET** `/events/{eventId}/reservation/info` - 予約サポート情報取得
- **POST** `/events/{eventId}/reservation/report` - 予約完了報告
- **PUT** `/events/{eventId}/reservation/update` - 予約情報更新

## 記録管理

**ベース URL**: `/records`

### 幹事ログ（プライベート記録）

- **GET** `/records/private` - 自分の開催記録一覧
- **POST** `/records/private` - 開催記録作成
- **GET** `/records/private/{recordId}` - 開催記録詳細
- **PUT** `/records/private/{recordId}` - 開催記録更新
- **DELETE** `/records/private/{recordId}` - 開催記録削除

### みんなの記録（共有記録）

- **GET** `/records/shared` - 共有記録一覧（フィルタ対応）
- **POST** `/records/{recordId}/share` - 記録の共有設定
- **DELETE** `/records/{recordId}/share` - 共有停止
- **POST** `/records/shared/{recordId}/like` - いいね追加
- **DELETE** `/records/shared/{recordId}/like` - いいね削除
- **POST** `/records/shared/{recordId}/report` - 不適切報告

### 記録統計

- **GET** `/records/stats` - 個人記録統計
- **GET** `/records/shared/stats` - 共有記録統計

## ユーザー設定

**ベース URL**: `/settings`

### プロフィール管理

- **GET** `/settings/profile` - プロフィール取得
- **PUT** `/settings/profile` - プロフィール更新

### アプリ設定

- **GET** `/settings/app` - アプリ設定取得
- **PUT** `/settings/app` - アプリ設定更新

### 通知設定

- **GET** `/settings/notifications` - 通知設定取得
- **PUT** `/settings/notifications` - 通知設定更新

### プライバシー設定

- **GET** `/settings/privacy` - プライバシー設定取得
- **PUT** `/settings/privacy` - プライバシー設定更新

## 外部 API 連携

**ベース URL**: `/external`

### Google Maps 連携

- **POST** `/external/maps/center-area` - メンバー位置の中心地点算出
- **GET** `/external/maps/nearby-areas` - 周辺エリア取得

### ホットペッパーグルメ連携

- **POST** `/external/hotpepper/search` - レストラン検索
- **GET** `/external/hotpepper/details/{shopId}` - 店舗詳細取得

## データ型定義

### 共通レスポンス形式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

### エラーコード

- `AUTH_001`: 認証失敗
- `AUTH_002`: 権限不足
- `VALIDATION_001`: 入力値検証エラー
- `NOT_FOUND_001`: リソースが見つからない
- `BUSINESS_001`: ビジネスロジックエラー
- `EXTERNAL_001`: 外部 API 呼び出しエラー
- `SYSTEM_001`: システムエラー

## 認証・認可仕様

### 認証方式

- Amazon Cognito User Pools を使用
- JWT（Access Token）による認証

### 認可

- 幹事のみアプリ利用可能
- 自分が作成したイベント・記録のみ操作可能
- 共有記録は閲覧のみ可能（共有設定は自分の記録のみ）

### 公開エンドポイント

以下のエンドポイントは認証不要：

- フォーム回答関連（`/public/forms/*`）
- 日程調整回答（`/public/schedule/*`）

## セキュリティ考慮事項

1. **入力値検証**: 全ての API で厳密な入力値検証を実施
2. **レート制限**: API 毎に適切なレート制限を設定
3. **CORS 設定**: フロントエンドドメインのみ許可
4. **データ暗号化**: 機密データは暗号化して保存
5. **監査ログ**: 重要な操作についてはログを記録

## 実装優先度

### 高優先度（MVP）

1. 認証・認可機能
2. イベント基本 CRUD
3. メンバー管理
4. フォーム機能（作成・回答）
5. 日程調整基本機能

### 中優先度

1. レストラン提案機能
2. 予約サポート機能
3. 記録管理（プライベート）

### 低優先度

1. 共有記録機能
2. 統計・分析機能
3. 高度なフィルタリング

## 外部 API 要件

### Google Maps Platform API

- **Places API**: 位置情報・地図表示
- **Geocoding API**: 住所 ⇔ 座標変換
- **Distance Matrix API**: 中心地点算出

### ホットペッパーグルメ API

- **店舗検索 API**: 条件に基づく店舗検索
- **店舗詳細 API**: 詳細情報取得

### 使用量制限・コスト管理

- 適切なキャッシュ戦略
- API 呼び出し回数の制限
- コスト監視アラート設定
