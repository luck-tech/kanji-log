---
applyTo: "backend,iac"
---

# Kanji-Log バックエンド開発指示書

## 🎯 開発目標とアプローチ

### プロジェクト理念

Kanji-Log は「飲み会幹事の心理的負担軽減」を目指すアプリケーションです。バックエンド開発において、この目標を技術面から支える以下の価値観を重視します：

- **信頼性**: 幹事が安心して使える堅牢なシステム
- **保守性**: AWS/Go 初心者でも理解・メンテナンス可能
- **拡張性**: 将来的な機能追加に対応できる設計
- **セキュリティ**: 個人情報を適切に保護

---

## 📋 開発ワークフロー

### 🔄 基本開発サイクル

1. **要件理解**

   - ユーザーストーリーから技術要件を抽出
   - API 仕様書での詳細確認
   - 既存システムとの整合性チェック

2. **設計・実装**

   - ドメインモデルの定義
   - ハンドラーロジックの実装
   - リポジトリ層の実装

3. **テスト・デプロイ**

   - ローカルでの単体テスト
   - Makefile でのビルド・デプロイ
   - API Gateway 経由での統合テスト

4. **記録・振り返り**
   - `docs/log/task-{番号}.md`への記録
   - 学習ポイントの整理
   - 次回への改善点抽出

### 🛠️ 推奨開発フロー

```bash
# 1. 機能要件の確認
code docs/task/task-XXX.md

# 2. 実装開始
mkdir -p cmd/api/new-feature
code cmd/api/new-feature/main.go

# 3. ビルド・テスト
make build lambda=new-feature
make dev-deploy lambda=new-feature
make test-api

# 4. 作業ログ記録
code docs/log/task-XXX.md
```

### 開発フロー（Task-002a で改善済み）

- **Makefile コマンドの使用を推奨**: 開発効率向上のため、`backend/Makefile`のコマンドを優先使用する
  ```bash
  # 基本コマンド
  make help                          # ヘルプ表示
  make build lambda=<function-name>  # Lambda関数ビルド
  make deploy                        # Terraformデプロイ（確認あり）
  make dev-deploy lambda=<function>  # ビルド+デプロイ一括実行
  make test-api                      # API動作確認
  make clean                         # ビルド成果物削除
  ```
- **汎用ビルドスクリプトの活用**: `./scripts/build.sh <function-name>`で任意の関数をビルド可能
- **エラーハンドリングの活用**: 引数不足や関数未存在時の適切なエラーメッセージを確認する

### コード品質・保守性

- **詳細コメントの必須化**: AWS/インフラに慣れていない方でも理解できるよう、全てのコードに詳細なコメントを追加する
  - リソースの目的・役割の説明
  - 設定値の選択理由
  - 幹事ナビでの具体的な使用場面
  - ベストプラクティスとセキュリティ考慮事項
- **作業ログの記録義務**: 全てのタスク作業は `docs/log/task-{番号}.md` に詳細記録する
  - 実行したコマンド（再現可能な形で）
  - 発生したエラーと解決方法
  - 作成・修正したファイル一覧
  - 動作確認結果
  - 次タスクへの引き継ぎ事項
  - 学習ポイント・気づき

---

## 🏗️ アーキテクチャ設計原則

### レイヤード・アーキテクチャ

```
┌─────────────────────┐
│   API Gateway       │ ← リクエスト受付・認証・バリデーション
├─────────────────────┤
│   Handler Layer     │ ← ビジネスロジック・ドメインルール
├─────────────────────┤
│   Repository Layer  │ ← データアクセス・永続化
├─────────────────────┤
│   Domain Layer      │ ← ビジネスオブジェクト・ドメインモデル
└─────────────────────┘
```

### モジュール設計方針

1. **cmd/api/{function-name}**: 各 Lambda 関数のエントリーポイント

   - API Gateway との連携処理
   - リクエスト・レスポンスの変換
   - 認証情報の取得と検証

2. **internal/handler**: ビジネスロジック層

   - バリデーション
   - ドメインルール適用
   - 外部 API 呼び出し
   - トランザクション管理

3. **internal/repository**: データアクセス層

   - DynamoDB 操作の抽象化
   - エラーハンドリング
   - 接続管理

4. **internal/domain**: ドメインモデル
   - ビジネスオブジェクトの定義
   - バリデーションルール
   - ドメイン不変量

---

## 🎯 新しい Lambda 関数追加手順

### 1. 🧠 設計フェーズ

```bash
# API仕様の確認
code docs/api-detailed-specs.md

# TypeScript型定義の確認（フロントエンドとの連携）
code docs/typescript-types.md
```

### 2. 🔧 実装フェーズ

#### ステップ 1: 関数ディレクトリ作成

```bash
mkdir -p cmd/api/{function-name}
code cmd/api/{function-name}/main.go
```

#### ステップ 2: ドメインモデル定義（必要時）

```bash
code internal/domain/{domain-name}.go
```

#### ステップ 3: ハンドラー実装

```bash
code internal/handler/{domain-name}.go
```

#### ステップ 4: リポジトリ実装（必要時）

```bash
code internal/repository/{domain-name}.go
```

### 3. 🧪 テストフェーズ

#### ビルドテスト

```bash
make build lambda={function-name}
```

#### ローカルテスト

```bash
# 成果物確認
ls -la {function-name}-lambda.zip

# ビルドサイズ確認（5MB以下が理想）
du -h {function-name}-lambda.zip
```

#### デプロイ・統合テスト

```bash
make dev-deploy lambda={function-name}
make test-api
```

### 4. 🏗️ インフラ設定

#### Terraform 設定追加

`iac/environments/dev/main.tf`に以下を追加：

```hcl
module "{function_name}_lambda" {
  source        = "../../modules/lambda"
  function_name = "kanji-log-{function-name}"
  environment   = "dev"
  role_arn      = module.iam.lambda_execution_role_arn
  source_file   = "../../../backend/{function-name}-lambda.zip"

  # 環境変数（必要時）
  environment_variables = {
    TABLE_NAME = module.dynamodb.table_name
  }
}
```

#### API Gateway 統合

`iac/modules/api_gateway/main.tf`に対応するリソースとメソッドを追加

---

## 🔒 セキュリティ実装ガイドライン

### 1. 認証 (Authentication) と認可 (Authorization)

- **認証は Cognito に一任せよ:** 認証ロジックを自前で実装するな。パスワードハッシュ化、トークン管理、MFA、SNS 連携はすべて Cognito の責務とする。
- **API Gateway で認証を強制せよ:** 全ての機密 API エンドポイントは、API Gateway の Cognito オーソライザーで保護し、未認証リクエストは Lambda に到達する前にブロックせよ。
- **認可は Lambda の責務である:** Lambda 関数内では、認証されたユーザー（`sub`）が、操作対象のデータ（例: `eventId`）に対して何をして良いか（認可）を必ず検証せよ。「ユーザー A がユーザー B のデータを操作できないか？」を常に問い、コードレベルでチェックせよ。

### 2. 入力値のバリデーション

- **サーバーサイドで必ず検証せよ:** クライアントからの入力は一切信用するな。API Gateway のモデルバリデーション、および Lambda 関数冒頭で、全ての入力値（パスパラメータ、クエリ、リクエストボディ）の型、形式、範囲を厳密に検証せよ。
- **ゼロトラストでサニタイズせよ:** 全ての入力は攻撃であると仮定し、出力（特に HTML やログ）に含める際は必ずエスケープまたはサニタイズ処理を行え。

### 3. 権限管理 (IAM)

- **最小権限の原則を徹底せよ:** 各 Lambda 関数にアタッチする IAM Role には、その関数が必要とする最小限の権限のみを付与せよ。例えば、DynamoDB からの読み取りだけが必要なら、`dynamodb:GetItem`権限のみを許可し、`dynamodb:*`のようなワイルドカードは絶対に使用するな。
- **開発用 IAM ユーザーの権限管理:** 開発用 IAM ユーザーには`KanjiNaviTerraformMinimal`ポリシーを適用し、AdministratorAccess は絶対に使用するな。必要最小限の権限（DynamoDB、Lambda、API Gateway、IAM 操作）のみを許可せよ。
- **リージョン制限:** IAM ポリシーには`aws:RequestedRegion`条件を追加し、ap-northeast-1 リージョンでの操作に限定せよ（ただし、IAM はグローバルサービスのため別途考慮が必要）。

### 4. 秘密情報 (Secrets) の管理

- **コードに秘密を埋め込むな:** API キー、データベース認証情報などの秘密情報は、ソースコードや環境変数に直接記述することを禁止する。
- **Secrets Manager を利用せよ:** 全ての秘密情報は AWS Secrets Manager または Parameter Store (SecureString) に格納し、Lambda からは実行時の IAM Role を通じて動的に取得せよ。

### 5. 依存関係の管理

- **脆弱性スキャンを義務付けよ:** Go の`go.mod`で管理される外部ライブラリは、サプライチェーン攻撃のリスク源である。GitHub Actions などで Dependabot や Snyk のような脆弱性スキャンツールを CI/CD パイプラインに組み込み、脆弱性が発見された場合はマージをブロックせよ。

### 6. セキュアコーディング (Go)

- **エラーハンドリングを徹底せよ:** Go のエラーは無視するな。全てのエラーを適切にハンドリングし、予期せぬエラーが発生した場合は、詳細なエラーメッセージをクライアントに返さず、サーバー側でロギングせよ。
- **SQL インジェクション対策:** （今回は DynamoDB のため該当しないが）SQL を扱う場合は、必ずプレースホルダを用いたパラメータ化クエリを使用し、文字列結合で SQL 文を組み立てるな。

### 7. インフラストラクチャとしてのコード (IaC)

- **Terraform 状態管理の中央化:** 状態ファイル（.tfstate）は必ず S3 バックエンドで管理し、DynamoDB によるロック機能を有効にせよ。ローカルでの状態管理は禁止する。
- **S3 バックエンドのセキュリティ:** 状態ファイル保存用 S3 バケットには暗号化、バージョニング、パブリックアクセスブロックを必ず設定せよ。
- **環境分離:** 開発環境（dev）と本番環境（prd）は完全に分離し、状態ファイルも別々のキーで管理せよ。
- **インフラ変更の可視化:** terraform plan の実行結果は必ず確認し、意図しないリソースの削除や変更がないことを確認してから apply を実行せよ。

#### 認証・認可実装

#### リクエスト検証

```go
func extractOrganizerID(event events.APIGatewayProxyRequest) (string, error) {
    organizerID := event.Headers["x-organizer-id"]
    if organizerID == "" {
        return "", fmt.Errorf("missing required header: x-organizer-id")
    }

    // UUIDフォーマット検証
    if !isValidUUID(organizerID) {
        return "", fmt.Errorf("invalid organizer ID format")
    }

    return organizerID, nil
}
```

#### データアクセス制御

```go
// ユーザーが自分のデータのみアクセス可能かチェック
func (r *EventRepository) validateAccess(eventID, organizerID string) error {
    event, err := r.GetEvent(eventID)
    if err != nil {
        return err
    }

    if event.OrganizerID != organizerID {
        return fmt.Errorf("access denied: event belongs to different organizer")
    }

    return nil
}
```

### 入力値検証

#### リクエストボディ検証

```go
func validateCreateEventRequest(req CreateEventRequest) error {
    if strings.TrimSpace(req.Title) == "" {
        return fmt.Errorf("title is required")
    }

    if len(req.Title) > 100 {
        return fmt.Errorf("title must be 100 characters or less")
    }

    // HTML タグの除去・エスケープ
    req.Title = html.EscapeString(strings.TrimSpace(req.Title))

    return nil
}
```

### エラーハンドリング

#### セキュアなエラーレスポンス

```go
func handleError(err error) events.APIGatewayProxyResponse {
    // 詳細なエラー情報はログに記録
    log.Printf("Error occurred: %v", err)

    // クライアントには汎用的なエラーメッセージのみ返す
    return events.APIGatewayProxyResponse{
        StatusCode: 500,
        Headers: map[string]string{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        Body: `{"error": "Internal server error"}`,
    }
}
```

---

## 🧪 テスト・品質保証

### 単体テストガイドライン

#### テストファイル構成

```bash
internal/
├── handler/
│   ├── event.go
│   └── event_test.go      # ハンドラーテスト
└── repository/
    ├── dynamodb.go
    └── dynamodb_test.go   # リポジトリテスト
```

#### テストコード例

```go
func TestCreateEvent_Success(t *testing.T) {
    // Given
    mockRepo := &MockEventRepository{}
    handler := &EventHandler{repo: mockRepo}

    request := CreateEventRequest{
        Title:    "テストイベント",
        Purpose:  "チームビルディング",
    }

    // When
    event, err := handler.CreateEvent(request, "test-organizer-123")

    // Then
    assert.NoError(t, err)
    assert.Equal(t, "テストイベント", event.Title)
    assert.Equal(t, "test-organizer-123", event.OrganizerID)
}
```

### 統合テストガイドライン

#### cURL テストスイート

```bash
#!/bin/bash
# test/integration/events.sh

BASE_URL="https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev"
ORGANIZER_ID="test-organizer-123"

echo "=== Event API Integration Test ==="

# イベント作成テスト
EVENT_ID=$(curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -H "x-organizer-id: $ORGANIZER_ID" \
  -d '{"title":"Integration Test Event","purpose":"testing"}' \
  | jq -r '.id')

echo "Created event: $EVENT_ID"

# イベント取得テスト
curl -s "$BASE_URL/events/$EVENT_ID" \
  -H "x-organizer-id: $ORGANIZER_ID" \
  | jq .

echo "Integration test completed"
```

---

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. Lambda デプロイエラー

**症状**: `InvalidParameterValueException: Unzipped size must be smaller than xxx bytes`

**解決方法**:

```bash
# バイナリサイズの確認
ls -la build/bootstrap

# 最適化オプションの確認
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
go build -ldflags="-s -w" \
-o build/bootstrap cmd/api/{function-name}/main.go
```

#### 2. DynamoDB アクセスエラー

**症状**: `AccessDeniedException: User: arn:aws:sts::xxx is not authorized`

**解決方法**:

```bash
# IAM権限の確認
aws iam list-attached-role-policies \
--role-name kanji-log-lambda-execution-role-dev

# Terraform再適用
cd iac/environments/dev
terraform plan
terraform apply
```

#### 3. API Gateway CORS エラー

**症状**: `Access to XMLHttpRequest has been blocked by CORS policy`

**解決方法**:

```go
// Lambda レスポンスヘッダーの確認
headers := map[string]string{
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type,x-organizer-id",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
}
```

### デバッグ手順

#### 1. ログ確認

```bash
# Lambda関数のログを監視
aws logs tail /aws/lambda/kanji-log-{function-name}-dev \
  --follow --region ap-northeast-1

# 特定時間範囲のログ取得
aws logs filter-log-events \
  --log-group-name "/aws/lambda/kanji-log-{function-name}-dev" \
  --start-time $(date -d "1 hour ago" +%s)000 \
  --region ap-northeast-1
```

#### 2. API Gateway テスト

```bash
# API Gateway のテスト機能を使用
aws apigateway test-invoke-method \
  --rest-api-id {api-id} \
  --resource-id {resource-id} \
  --http-method POST \
  --path-with-query-string "/events" \
  --body '{"title":"Test Event"}' \
  --headers '{"x-organizer-id":"test-123"}'
```

#### 3. DynamoDB データ確認

```bash
# テーブル内容の確認
aws dynamodb scan \
  --table-name kanji-log-events-dev \
  --region ap-northeast-1

# 特定アイテムの取得
aws dynamodb get-item \
  --table-name kanji-log-events-dev \
  --key '{"id":{"S":"event-id-here"}}' \
  --region ap-northeast-1
```

---

## 🎓 学習リソース・ベストプラクティス

### Go 言語関連

#### 推奨学習リソース

- [Effective Go](https://go.dev/doc/effective_go): Go 言語の慣用的な書き方
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments): コードレビューガイドライン
- [AWS SDK for Go v2 Developer Guide](https://aws.github.io/aws-sdk-go-v2/docs/): AWS 統合

#### コーディングベストプラクティス

```go
// ✅ 良い例: エラーハンドリング
func (r *EventRepository) CreateEvent(event domain.Event) error {
    item, err := attributevalue.MarshalMap(event)
    if err != nil {
        return fmt.Errorf("failed to marshal event: %w", err)
    }

    _, err = r.dynamodb.PutItem(context.TODO(), &dynamodb.PutItemInput{
        TableName: aws.String(r.tableName),
        Item:      item,
    })
    if err != nil {
        return fmt.Errorf("failed to put item to DynamoDB: %w", err)
    }

    return nil
}

// ❌ 悪い例: エラーの無視
func (r *EventRepository) CreateEvent(event domain.Event) error {
    item, _ := attributevalue.MarshalMap(event) // エラー無視
    r.dynamodb.PutItem(context.TODO(), &dynamodb.PutItemInput{
        TableName: aws.String(r.tableName),
        Item:      item,
    })
    return nil
}
```

### AWS Lambda 関連

#### パフォーマンス最適化

- **Cold Start 対策**: 初期化処理を global スコープで実行
- **メモリ設定**: 256MB（CPU 性能とのバランス）
- **タイムアウト設定**: 30 秒（通常は 5 秒以内で完了）

```go
// ✅ Cold Start対策の例
var (
    dynamoClient *dynamodb.Client
    repo         *repository.EventRepository
)

func init() {
    // Lambda初期化時に一度だけ実行
    cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("ap-northeast-1"))
    if err != nil {
        log.Fatalf("unable to load SDK config: %v", err)
    }

    dynamoClient = dynamodb.NewFromConfig(cfg)
    repo = repository.NewEventRepository(dynamoClient, os.Getenv("TABLE_NAME"))
}

func handler(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    // ハンドラー処理で再利用
    return processRequest(event)
}
```

### Terraform 関連

#### モジュール設計のベストプラクティス

```hcl
# ✅ 良い例: 汎用的なモジュール設計
module "user_management_lambda" {
  source        = "../../modules/lambda"
  function_name = "kanji-log-user-management"
  environment   = var.environment
  role_arn      = module.iam.lambda_execution_role_arn
  source_file   = var.lambda_zip_path

  # 関数固有の環境変数
  environment_variables = {
    TABLE_NAME = module.dynamodb.table_name
    API_URL    = var.external_api_url
  }

  # カスタム設定（必要時）
  memory_size = 512
  timeout     = 60
}

# ❌ 悪い例: 関数固有のハードコーディング
resource "aws_lambda_function" "user_management_only" {
  function_name = "kanji-log-user-management-dev"
  # 他の関数では再利用不可
}
```

---

## 📝 作業ログ・ドキュメンテーション

### 作業ログのテンプレート

````markdown
# Task-XXX: [タスク名]

## 📋 作業概要

- **目的**:
- **担当者**:
- **実施日**:
- **推定工数**:
- **実際工数**:

## 🎯 要件・仕様

[タスクで実装する機能の詳細]

## 🛠️ 実装内容

### 新規作成ファイル

- `path/to/file.go`: 機能説明

### 修正ファイル

- `path/to/file.go`: 修正内容

### 実行コマンド

```bash
make build lambda=new-feature
make dev-deploy lambda=new-feature
```
````

## 🧪 テスト結果

[API テスト結果、動作確認結果]

## ⚠️ 発生した問題・解決方法

[エラー内容と解決手順]

## 📚 学習ポイント・気づき

[今回の作業で得られた知見]

## 🔄 次タスクへの引き継ぎ事項

[次の作業者が知っておくべき情報]

````

### コードコメント規約

#### 関数レベル
```go
// CreateEvent は新しいイベントを作成し、DynamoDBに保存します。
//
// 引数:
//   - request: イベント作成リクエスト（タイトル、目的等）
//   - organizerID: イベント主催者のユーザーID
//
// 戻り値:
//   - domain.Event: 作成されたイベント情報
//   - error: エラーが発生した場合のエラー情報
//
// 幹事ナビでの使用場面:
//   - 「新しい飲み会を企画する」画面での保存処理
//   - WebフォームURL生成の前提条件となるイベント作成
func (h *EventHandler) CreateEvent(request CreateEventRequest, organizerID string) (domain.Event, error) {
````

#### 複雑なロジック

```go
// 会計計算における割り勘ロジック
// 1円単位の端数は幹事が負担することで、参加者の負担を軽減
func calculateSplitBill(totalAmount int, memberCount int) (perPerson int, organizerExtra int) {
    perPerson = totalAmount / memberCount
    organizerExtra = totalAmount % memberCount

    // 幹事の心理的負担軽減のため、参加者の負担は明確な金額で統一
    return perPerson, organizerExtra
}
```

---

## ディレクトリ構造

```
kanji-log/
├── backend/                  // 🧠 サーバーサイド（Go）
│   ├── cmd/                  // 実行可能なアプリケーションのエントリーポイント
│   │   ├── api/              // Lambda関数ごとのmain.goを格納
│   │   │   ├── create-event/
│   │   │   └── get-event/
│   │   └── batch/            // バッチ処理用のmain.go
│   ├── internal/             // 内部パッケージ（プロジェクト固有のロジック）
│   │   ├── domain/           // ドメインモデル（Event, Userなど）
│   │   ├── handler/          // Lambdaのハンドラーロジック
│   │   ├── repository/       // データストア（DynamoDB）とのやり取り
│   │   └── config/           // 設定管理
│   ├── pkg/                  // 外部公開可能な汎用ライブラリ（今回は基本使わない）
│   ├── go.mod                // Goモジュール定義
│   └── go.sum                // 依存関係のチェックサム
├── iac/                      // 🏛️ インフラ管理 (IaC)
│   ├── _bootstrap/           // Terraform状態管理用インフラ
│   │   ├── iam_policies/     // IAM権限管理（最小権限ポリシー）
│   │   └── state_backend/    // S3バックエンド・DynamoDBロック設定
│   ├── environments/         // 環境ごとの設定
│   │   ├── dev/              // 開発環境（S3バックエンド対応済み）
│   │   └── prd/              // 本番環境
│   ├── modules/              // 再利用可能なインフラコンポーネント
│   │   ├── api_gateway/
│   │   ├── cognito/
│   │   ├── dynamodb/
│   │   ├── iam/
│   │   └── lambda/
│   └── README.md             // IaC詳細ドキュメント
├── .github/                  // CI/CDワークフロー (GitHub Actions)
│   └── workflows/
│       ├── deploy-backend.yml
│       └── deploy-iac.yml
```

## 開発上のセキュリティルール

### 1\. 認証 (Authentication) と認可 (Authorization)

- **認証は Cognito に一任せよ:** 認証ロジックを自前で実装するな。パスワードハッシュ化、トークン管理、MFA、SNS 連携はすべて Cognito の責務とする。
- **API Gateway で認証を強制せよ:** 全ての機密 API エンドポイントは、API Gateway の Cognito オーソライザーで保護し、未認証リクエストは Lambda に到達する前にブロックせよ。
- **認可は Lambda の責務である:** Lambda 関数内では、認証されたユーザー（`sub`）が、操作対象のデータ（例: `eventId`）に対して\*\*何をして良いか（認可）\*\*を必ず検証せよ。「ユーザー A がユーザー B のデータを操作できないか？」を常に問い、コードレベルでチェックせよ。

### 2\. 入力値のバリデーション

- **サーバーサイドで必ず検証せよ:** クライアントからの入力は一切信用するな。API Gateway のモデルバリデーション、および Lambda 関数冒頭で、全ての入力値（パスパラメータ、クエリ、リクエストボディ）の型、形式、範囲を厳密に検証せよ。
- **ゼロトラストでサニタイズせよ:** 全ての入力は攻撃であると仮定し、出力（特に HTML やログ）に含める際は必ずエスケープまたはサニタイズ処理を行え。

### 3\. 権限管理 (IAM)

- **最小権限の原則を徹底せよ:** 各 Lambda 関数にアタッチする IAM Role には、その関数が必要とする最小限の権限のみを付与せよ。例えば、DynamoDB からの読み取りだけが必要なら、`dynamodb:GetItem`権限のみを許可し、`dynamodb:*`のようなワイルドカードは絶対に使用するな。
- **開発用 IAM ユーザーの権限管理:** 開発用 IAM ユーザーには`KanjiNaviTerraformMinimal`ポリシーを適用し、AdministratorAccess は絶対に使用するな。必要最小限の権限（DynamoDB、Lambda、API Gateway、IAM 操作）のみを許可せよ。
- **リージョン制限:** IAM ポリシーには`aws:RequestedRegion`条件を追加し、ap-northeast-1 リージョンでの操作に限定せよ（ただし、IAM はグローバルサービスのため別途考慮が必要）。

### 4\. 秘密情報 (Secrets) の管理

- **コードに秘密を埋め込むな:** API キー、データベース認証情報などの秘密情報は、ソースコードや環境変数に直接記述することを禁止する。
- **Secrets Manager を利用せよ:** 全ての秘密情報は AWS Secrets Manager または Parameter Store (SecureString) に格納し、Lambda からは実行時の IAM Role を通じて動的に取得せよ。

###　 5\. 依存関係の管理

- **脆弱性スキャンを義務付けよ:** Go の`go.mod`で管理される外部ライブラリは、サプライチェーン攻撃のリスク源である。GitHub Actions などで Dependabot や Snyk のような脆弱性スキャンツールを CI/CD パイプラインに組み込み、脆弱性が発見された場合はマージをブロックせよ。

### 6\. セキュアコーディング (Go)

- **エラーハンドリングを徹底せよ:** Go のエラーは無視するな。全てのエラーを適切にハンドリングし、予期せぬエラーが発生した場合は、詳細なエラーメッセージをクライアントに返さず、サーバー側でロギングせよ。
- **SQL インジェクション対策:** （今回は DynamoDB のため該当しないが）SQL を扱う場合は、必ずプレースホルダを用いたパラメータ化クエリを使用し、文字列結合で SQL 文を組み立てるな。

### 7\. インフラストラクチャとしてのコード (IaC)

- **Terraform 状態管理の中央化:** 状態ファイル（.tfstate）は必ず S3 バックエンドで管理し、DynamoDB によるロック機能を有効にせよ。ローカルでの状態管理は禁止する。
- **S3 バックエンドのセキュリティ:** 状態ファイル保存用 S3 バケットには暗号化、バージョニング、パブリックアクセスブロックを必ず設定せよ。
- **環境分離:** 開発環境（dev）と本番環境（prd）は完全に分離し、状態ファイルも別々のキーで管理せよ。
- **インフラ変更の可視化:** terraform plan の実行結果は必ず確認し、意図しないリソースの削除や変更がないことを確認してから apply を実行せよ。
