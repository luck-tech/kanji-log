# Task-003: イベント作成 API 実装作業ログ

**実行日**: 2025 年 9 月 4 日  
**担当者**: バックエンド担当者  
**所要時間**: 約 2 時間

## 📋 実行した作業

### 1. プロジェクト構造の作成

```bash
mkdir -p backend/internal/{domain,repository,handler}
mkdir -p backend/cmd/api/create-event
```

### 2. 依存関係の追加

```bash
cd backend
go get github.com/aws/aws-sdk-go-v2/config@latest
go get github.com/google/uuid@latest
go mod tidy
```

**追加されたライブラリ:**

- AWS SDK v2 (config, dynamodb, attributevalue)
- google/uuid (UUIDv4 生成)

### 3. 実装したファイル一覧

#### 3.1 ドメイン層

- **`backend/internal/domain/event.go`**
  - Event 構造体とリクエスト/レスポンス型を定義
  - バリデーション用の定数定義
  - 重要: `dynamodbav` タグが必須（これがないと DynamoDB マーシャリングが失敗）

#### 3.2 リポジトリ層

- **`backend/internal/repository/dynamodb.go`**
  - DynamoDB 操作の抽象化
  - CRUD 操作の実装
  - エラーハンドリングとログ出力

#### 3.3 ハンドラー層

- **`backend/internal/handler/event.go`**
  - ビジネスロジック実装
  - 入力値バリデーション
  - UUID 生成とデータ変換

#### 3.4 Lambda 関数

- **`backend/cmd/api/create-event/main.go`**
  - API Gateway Proxy 統合対応
  - 認証情報抽出（簡易版）
  - エラーレスポンス統一

### 4. インフラ設定更新

#### 4.1 Lambda モジュール作成

- **`iac/modules/lambda_create_event/main.tf`**
  - 新しい Lambda 関数定義
  - CloudWatch Logs 設定
  - 環境変数設定（TABLE_NAME）

#### 4.2 API Gateway 拡張

- **`iac/modules/api_gateway/main.tf`** に追加:
  - `/events` エンドポイント
  - POST, OPTIONS メソッド
  - CORS 対応
  - リクエストバリデーション
  - JSON スキーマ定義

#### 4.3 環境設定更新

- **`iac/environments/dev/main.tf`**

  - create_event_lambda モジュール追加
  - API Gateway 変数追加

- **`iac/environments/dev/outputs.tf`**
  - events_endpoint 出力追加

### 5. ビルドとデプロイ

#### 5.1 ビルド実行

```bash
cd backend
./scripts/build.sh create-event
```

**生成物:**

- `build/bootstrap` (13MB)
- `create-event-lambda.zip` (4.5MB)

#### 5.2 Terraform デプロイ

```bash
cd iac/environments/dev
terraform init
terraform apply -auto-approve
```

**作成されたリソース:**

- Lambda 関数: `kanji-log-create-event-dev`
- CloudWatch Logs: `/aws/lambda/kanji-log-create-event-dev`
- API Gateway: `/events` エンドポイント追加

## 🔧 発生した問題と解決方法

### 問題 1: DynamoDB AttributeValue マーシャリングエラー

**エラー:** `Missing the key id in the item`

**原因:** Event 構造体に DynamoDB 用のタグが不足

**解決方法:**

```go
// 修正前
ID string `json:"id"`

// 修正後
ID string `json:"id" dynamodbav:"id"`
```

### 問題 2: SQS 権限不足

**エラー:** `User is not authorized to perform: sqs:createqueue`

**解決方法:** 開発環境ではデッドレターキューを無効化

```go
// dead_letter_config をコメントアウト
```

### 問題 3: 日付バリデーション

**エラー:** 2025 年の日付が過去日として判定される

**状況:** バリデーション自体は正常動作（未来日で成功確認）

## ✅ 動作確認結果

### API テスト実行

```bash
curl -X POST \
  https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/events \
  -H "Content-Type: application/json" \
  -H "x-organizer-id: test-user-123" \
  -d '{
    "title": "新人歓迎会",
    "purpose": "welcome",
    "date": "2025-12-15",
    "time": "19:00",
    "notes": "みんなで楽しく歓迎しましょう！",
    "hasScheduling": false
  }'
```

### 成功レスポンス

```json
{
  "success": true,
  "data": {
    "id": "evt_2424f20bf2444f879cad5799d3975cde",
    "title": "新人歓迎会",
    "purpose": "welcome",
    "status": "planning",
    "date": "2025-12-15",
    "time": "19:00",
    "organizerId": "test-user-123",
    "members": [],
    "notes": "みんなで楽しく歓迎しましょう！",
    "hasScheduling": false,
    "createdAt": "2025-09-04T08:41:51.37360728Z",
    "updatedAt": "2025-09-04T08:41:51.37360728Z"
  }
}
```

## 📈 受け入れ条件チェック

- ✅ POST `/events` でイベント作成可能
- ✅ DynamoDB にデータが正しく保存される
- ✅ バリデーションエラーが適切に返される
- ✅ レスポンス形式が API 仕様書と一致する

## 🔗 利用可能なエンドポイント

- **Base URL**: `https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev`
- **Events API**: `https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/events`
- **Hello API**: `https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello`

## 📚 学習ポイント・気づき

### 1. AWS SDK v2 の特徴

- `attributevalue.MarshalMap` は `dynamodbav` タグを使用
- JSON タグだけでは不十分
- エラーメッセージが詳細で問題特定しやすい

### 2. Terraform モジュール設計

- 再利用可能性を重視した分離設計
- 環境別設定の重要性
- output 値による連携の柔軟性

### 3. Lambda 開発のベストプラクティス

- 詳細なログ出力の重要性
- init 関数での依存関係初期化
- エラーハンドリングの統一

### 4. API 設計

- CORS 対応の必要性
- リクエストバリデーションの自動化
- 統一されたエラーレスポンス形式

## 🚀 次のタスクへの引き継ぎ事項

### Task-004: イベント取得 API 実装 準備完了

**利用可能な基盤:**

1. DynamoDB 操作のリポジトリ層
2. Event ドメインモデル
3. API Gateway 設定パターン
4. 汎用ビルドスクリプト

**必要な追加実装:**

1. `GetEvent` handler
2. `GET /events/{id}` エンドポイント
3. パスパラメータ処理
4. 権限チェック強化

**推奨改善点:**

1. Cognito 認証の実装
2. 単体テストの追加
3. パフォーマンス監視設定
4. セキュリティヘッダー追加

## 📊 プロジェクト状況

**完了済み機能:**

- ✅ Hello World API (GET /hello)
- ✅ イベント作成 API (POST /events)

**次期実装予定:**

- 🔄 イベント取得 API (GET /events/{id})
- ⏳ イベント一覧 API (GET /events)
- ⏳ イベント更新 API (PUT /events/{id})

**技術的負債:**

- 認証機能の簡素化（x-organizer-id ヘッダー）
- 単体テストの不足
- エラーロギングの改善余地
