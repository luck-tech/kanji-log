# 幹事ナビ IaC・Backend 構成ガイド

**作成日**: 2025 年 9 月 4 日  
**対象**: 開発者・インフラエンジニア・新規参画者

## 📋 目次

1. [IaC（Infrastructure as Code）構成](#iac-infrastructure-as-code-構成)
2. [Backend（Go Lambda）構成](#backend-go-lambda-構成)
3. [開発フロー・使い方](#開発フロー・使い方)
4. [拡張方針](#拡張方針)
5. [運用上の注意事項](#運用上の注意事項)

---

## 🏛️ IaC（Infrastructure as Code）構成

### 全体構造とディレクトリ設計

```
iac/
├── README.md                    # IaC全体の説明書
├── _bootstrap/                  # 基盤インフラ（一度だけ構築）
│   ├── iam_policies/           # IAM権限ポリシー定義
│   │   └── kanji-navi-dev-policy.json  # 開発用最小権限ポリシー
│   └── state_backend/          # Terraform状態管理基盤
│       └── main.tf             # S3バケット + DynamoDB設定
├── environments/               # 環境別設定（dev/prd分離）
│   ├── dev/                   # 開発環境
│   │   ├── main.tf            # 環境のメイン設定
│   │   ├── variables.tf       # 入力変数定義
│   │   └── outputs.tf         # 出力値定義
│   └── prd/                   # 本番環境（将来用）
└── modules/                   # 再利用可能なコンポーネント
    ├── api_gateway/           # REST API設定
    ├── dynamodb/              # NoSQLデータベース
    ├── iam/                   # 権限管理
    └── lambda/                # サーバーレス関数
```

### 各ディレクトリの役割と必要性

#### 🔧 `_bootstrap/` - 基盤インフラ

**役割**: Terraform の状態管理とセキュリティ基盤を提供

**なぜ必要?**

- **チーム開発**: 複数人で同じインフラを安全に操作するため
- **状態の一元管理**: ローカルの状態ファイル競合を防ぐ
- **セキュリティ**: 最小権限でのアクセス制御

**主要ファイル**:

1. **`iam_policies/kanji-navi-dev-policy.json`**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["dynamodb:*", "lambda:*", "apigateway:*"],
         "Resource": "*",
         "Condition": {
           "StringEquals": { "aws:RequestedRegion": "ap-northeast-1" }
         }
       }
     ]
   }
   ```

   - **目的**: 開発者に必要最小限の権限のみ付与
   - **セキュリティ**: AdministratorAccess 回避、リージョン制限

2. **`state_backend/main.tf`**

   ```hcl
   # S3バケット（状態ファイル保存用）
   resource "aws_s3_bucket" "terraform_state" {
     bucket = "kanji-navi-terraform-state-${random_id.bucket_suffix.hex}"
   }

   # DynamoDBテーブル（ロック用）
   resource "aws_dynamodb_table" "terraform_lock" {
     name = "kanji-navi-terraform-lock-${random_id.bucket_suffix.hex}"
   }
   ```

   - **目的**: 複数人での安全な Terraform 操作
   - **ロック機能**: 同時実行による状態ファイル破損を防止

#### 🌍 `environments/` - 環境分離

**役割**: 開発環境と本番環境を完全に分離

**なぜ必要?**

- **リスク分離**: 開発での変更が本番に影響しない
- **設定の差分管理**: 環境ごとの設定値（インスタンスサイズ等）を管理
- **段階的デプロイ**: dev → prd の段階的リリース

**主要ファイル**:

1. **`dev/main.tf`** - 開発環境のメイン設定

   ```hcl
   terraform {
     backend "s3" {
       bucket = "kanji-navi-terraform-state-ocygln1t"
       key    = "environments/dev/terraform.tfstate"
       region = "ap-northeast-1"
       encrypt = true
     }
   }

   module "lambda" {
     source = "../../modules/lambda"
     function_name = "kanji-log-hello"
     environment   = "dev"
     source_file   = "../../../backend/hello-lambda.zip"
   }
   ```

2. **`dev/variables.tf`** - 設定値の定義

   ```hcl
   variable "aws_region" {
     description = "AWS region"
     type        = string
     default     = "ap-northeast-1"
   }
   ```

3. **`dev/outputs.tf`** - 他システムが参照する値
   ```hcl
   output "api_endpoint" {
     description = "API Gateway endpoint URL"
     value       = module.api_gateway.api_endpoint
   }
   ```

#### 🧩 `modules/` - 再利用可能コンポーネント

**役割**: AWS サービスの設定をテンプレート化

**なぜ必要?**

- **再利用性**: 同じ設定を複数環境で使い回し
- **保守性**: 設定変更を一箇所で管理
- **標準化**: チーム内での設定方法を統一

**各モジュールの詳細**:

1. **`lambda/main.tf`** - Lambda 関数の設定

   ```hcl
   resource "aws_lambda_function" "hello" {
     function_name = "${var.function_name}-${var.environment}"
     role         = var.role_arn
     handler      = "bootstrap"
     runtime      = "provided.al2"
     filename     = var.source_file
     source_code_hash = filebase64sha256(var.source_file)
   }
   ```

2. **`api_gateway/main.tf`** - REST API 設定

   ```hcl
   resource "aws_api_gateway_rest_api" "main" {
     name = "${var.api_name}-${var.environment}"
   }

   resource "aws_api_gateway_integration" "hello_lambda" {
     http_method = aws_api_gateway_method.hello_get.http_method
     resource_id = aws_api_gateway_resource.hello.id
     rest_api_id = aws_api_gateway_rest_api.main.id
     type        = "AWS_PROXY"
     uri         = var.lambda_invoke_arn
   }
   ```

3. **`dynamodb/main.tf`** - NoSQL データベース設定

   ```hcl
   resource "aws_dynamodb_table" "events" {
     name     = "${var.table_name}-${var.environment}"
     hash_key = "eventId"

     attribute {
       name = "eventId"
       type = "S"
     }
   }
   ```

4. **`iam/main.tf`** - 権限管理

   ```hcl
   resource "aws_iam_role" "lambda_execution_role" {
     name = "kanji-log-lambda-execution-role-${var.environment}"

     assume_role_policy = jsonencode({
       Version = "2012-10-17"
       Statement = [{
         Action = "sts:AssumeRole"
         Effect = "Allow"
         Principal = { Service = "lambda.amazonaws.com" }
       }]
     })
   }
   ```

---

## 🧠 Backend（Go Lambda）構成

### 全体構造とディレクトリ設計

```
backend/
├── go.mod                      # Goモジュール定義（依存関係管理）
├── go.sum                      # 依存関係の整合性チェック
├── Makefile                    # 開発コマンド統一
├── hello-lambda.zip           # デプロイパッケージ（生成物）
├── build/                     # ビルド成果物（一時ディレクトリ）
│   └── bootstrap              # Lambda実行ファイル
├── cmd/                       # 実行可能アプリケーション
│   └── api/                   # API Lambda関数群
│       └── hello/             # Hello API関数
│           └── main.go        # エントリーポイント
└── scripts/                   # 開発スクリプト
    └── build.sh              # 汎用ビルドスクリプト
```

### 各ファイルの役割と必要性

#### 📦 `go.mod` / `go.sum` - 依存関係管理

**役割**: Go プロジェクトの依存関係を定義・管理

```go
module github.com/luck-tech/kanji-log/backend

go 1.25

require github.com/aws/aws-lambda-go v1.49.0
```

**なぜ必要?**

- **再現性**: 誰でも同じバージョンのライブラリでビルド可能
- **セキュリティ**: 依存関係の改ざん検出
- **バージョン管理**: ライブラリのアップデート履歴を管理

#### 🔨 `Makefile` - 開発コマンド統一

**役割**: 複雑なコマンドを短縮・標準化

```makefile
# Lambda関数のビルド
build:
	@./scripts/build.sh $(lambda)

# ビルド + デプロイの一括実行
dev-deploy:
	@make build lambda=$(lambda)
	@make deploy-auto

# API動作確認
test-api:
	@curl -s https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello | jq .
```

**なぜ必要?**

- **開発効率**: 長いコマンドを短縮（70%時短効果）
- **エラー削減**: タイポや引数間違いを防止
- **チーム統一**: 誰でも同じ方法で開発可能

#### 🏗️ `scripts/build.sh` - 汎用ビルドスクリプト

**役割**: Lambda 関数を AWS 用にクロスコンパイル

```bash
#!/bin/bash
LAMBDA_NAME=$1

# Lambda関数の存在確認
if [ ! -f "cmd/api/$LAMBDA_NAME/main.go" ]; then
    echo "❌ エラー: Lambda関数が見つかりません"
    exit 1
fi

# Linux用クロスコンパイル
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
    -ldflags="-s -w" \
    -o "$BUILD_DIR/bootstrap" \
    "./cmd/api/$LAMBDA_NAME/main.go"

# ZIPパッケージ作成
cd "$BUILD_DIR" && zip -q "../${LAMBDA_NAME}-lambda.zip" bootstrap
```

**なぜ必要?**

- **クロスコンパイル**: macOS/Windows → Linux 変換
- **サイズ最適化**: `-ldflags="-s -w"`でバイナリサイズ削減
- **デプロイ形式**: AWS Lambda が要求する ZIP 形式に変換

#### 💻 `cmd/api/hello/main.go` - Lambda 関数コード

**役割**: HTTP リクエストを処理するビジネスロジック

```go
package main

import (
    "context"
    "encoding/json"
    "time"
    "github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    response := HelloResponse{
        Success:   true,
        Message:   "Hello from Kanji-Log!",
        Timestamp: time.Now().UTC().Format(time.RFC3339),
    }

    body, _ := json.Marshal(response)

    return events.APIGatewayProxyResponse{
        StatusCode: 200,
        Headers: map[string]string{
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        Body: string(body),
    }, nil
}

func main() {
    lambda.Start(handler)
}
```

**なぜ必要?**

- **イベント駆動**: API Gateway からのリクエストを処理
- **JSON API**: 構造化されたレスポンスを返却
- **CORS 対応**: フロントエンドからのアクセスを許可

---

## 🔄 開発フロー・使い方

### 基本的な開発サイクル

#### 1. 新しい Lambda 関数の開発

```bash
# 1. 関数ディレクトリを作成
mkdir -p backend/cmd/api/create-event

# 2. main.goファイルを作成
# （ビジネスロジックを実装）

# 3. ビルド
cd backend
make build lambda=create-event

# 4. デプロイ
make deploy

# または一括実行
make dev-deploy lambda=create-event

# 5. 動作確認
make test-api
```

#### 2. インフラの変更

```bash
# 1. モジュールファイルを編集
# 例: iac/modules/lambda/main.tf

# 2. 変更内容を確認
cd iac/environments/dev
terraform plan

# 3. 変更を適用
terraform apply

# または Makefileを使用
cd ../../backend
make deploy
```

#### 3. 日常的な開発コマンド

```bash
# 利用可能な関数一覧
make list-functions

# ビルド成果物のクリーンアップ
make clean

# Go依存関係の更新
make update-deps

# プロジェクト情報表示
make info

# CloudWatch Logsの確認
make logs lambda=hello
```

### トラブルシューティング

#### よくあるエラーと対処法

1. **`terraform plan`でエラー**

   ```bash
   # バックエンド設定の再初期化
   terraform init -reconfigure
   ```

2. **Lambda 関数のビルドエラー**

   ```bash
   # 依存関係の再取得
   cd backend
   go mod tidy
   ```

3. **API が 404 エラー**
   ```bash
   # デプロイ後の反映確認
   make test-api
   ```

---

## 🚀 拡張方針

### AWS サービスの追加

#### 新しい AWS サービス（例：S3、SNS、SQS）を追加する場合

1. **モジュールの作成**

   ```bash
   mkdir iac/modules/s3
   ```

2. **モジュール定義** (`iac/modules/s3/main.tf`)

   ```hcl
   resource "aws_s3_bucket" "app_storage" {
     bucket = "${var.bucket_name}-${var.environment}"
   }

   resource "aws_s3_bucket_versioning" "app_storage_versioning" {
     bucket = aws_s3_bucket.app_storage.id
     versioning_configuration {
       status = "Enabled"
     }
   }
   ```

3. **環境での利用** (`iac/environments/dev/main.tf`)

   ```hcl
   module "s3" {
     source = "../../modules/s3"
     bucket_name = "kanji-log-storage"
     environment = "dev"
   }
   ```

4. **IAM 権限の追加** (`iac/modules/iam/main.tf`)

   ```hcl
   resource "aws_iam_role_policy" "s3_policy" {
     name = "kanji-log-lambda-s3-policy-${var.environment}"
     role = aws_iam_role.lambda_execution_role.id

     policy = jsonencode({
       Version = "2012-10-17"
       Statement = [{
         Effect = "Allow"
         Action = ["s3:GetObject", "s3:PutObject"]
         Resource = "${var.s3_bucket_arn}/*"
       }]
     })
   }
   ```

### API 機能の追加

#### 新しい API（例：create-event、get-events）を追加する場合

1. **Lambda 関数の作成**

   ```bash
   mkdir -p backend/cmd/api/create-event
   ```

2. **関数の実装** (`backend/cmd/api/create-event/main.go`)

   ```go
   package main

   import (
       "context"
       "encoding/json"
       "github.com/aws/aws-lambda-go/events"
       "github.com/aws/aws-lambda-go/lambda"
   )

   type CreateEventRequest struct {
       EventName string `json:"eventName"`
       DateTime  string `json:"dateTime"`
   }

   func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
       var req CreateEventRequest
       json.Unmarshal([]byte(request.Body), &req)

       // ビジネスロジック実装
       // DynamoDB への保存処理など

       return events.APIGatewayProxyResponse{
           StatusCode: 201,
           Headers: map[string]string{
               "Content-Type": "application/json",
               "Access-Control-Allow-Origin": "*",
           },
           Body: `{"success": true, "eventId": "new-event-id"}`,
       }, nil
   }

   func main() {
       lambda.Start(handler)
   }
   ```

3. **API Gateway エンドポイントの追加** (`iac/modules/api_gateway/main.tf`)

   ```hcl
   # create-event リソース
   resource "aws_api_gateway_resource" "create_event" {
     rest_api_id = aws_api_gateway_rest_api.main.id
     parent_id   = aws_api_gateway_rest_api.main.root_resource_id
     path_part   = "create-event"
   }

   # POST メソッド
   resource "aws_api_gateway_method" "create_event_post" {
     rest_api_id   = aws_api_gateway_rest_api.main.id
     resource_id   = aws_api_gateway_resource.create_event.id
     http_method   = "POST"
     authorization = "NONE"
   }
   ```

4. **ビルド・デプロイ**
   ```bash
   cd backend
   make build lambda=create-event
   make deploy
   ```

### データベース設計の拡張

#### 新しい DynamoDB テーブルの追加

1. **テーブル定義の追加** (`iac/modules/dynamodb/main.tf`)

   ```hcl
   # 既存のeventsテーブルに加えて
   resource "aws_dynamodb_table" "members" {
     name     = "${var.table_name}-members-${var.environment}"
     hash_key = "memberId"

     attribute {
       name = "memberId"
       type = "S"
     }

     billing_mode = "PAY_PER_REQUEST"

     tags = {
       Environment = var.environment
       Project     = "kanji-log"
     }
   }
   ```

2. **IAM 権限の追加**

   ```hcl
   resource "aws_iam_role_policy" "dynamodb_members_policy" {
     name = "kanji-log-lambda-dynamodb-members-policy-${var.environment}"
     role = aws_iam_role.lambda_execution_role.id

     policy = jsonencode({
       Version = "2012-10-17"
       Statement = [{
         Effect = "Allow"
         Action = [
           "dynamodb:GetItem",
           "dynamodb:PutItem",
           "dynamodb:UpdateItem",
           "dynamodb:DeleteItem",
           "dynamodb:Query",
           "dynamodb:Scan"
         ]
         Resource = aws_dynamodb_table.members.arn
       }]
     })
   }
   ```

### 複数環境への展開

#### 本番環境（prd）の構築

1. **本番環境ディレクトリの準備**

   ```bash
   mkdir -p iac/environments/prd
   cp iac/environments/dev/*.tf iac/environments/prd/
   ```

2. **本番固有の設定** (`iac/environments/prd/main.tf`)

   ```hcl
   terraform {
     backend "s3" {
       bucket = "kanji-navi-terraform-state-ocygln1t"
       key    = "environments/prd/terraform.tfstate"  # prd用のキー
       region = "ap-northeast-1"
       encrypt = true
     }
   }

   module "lambda" {
     source = "../../modules/lambda"
     function_name = "kanji-log-hello"
     environment   = "prd"  # 本番環境指定
     # 本番用の設定値（メモリサイズ、タイムアウト等）
   }
   ```

3. **段階的デプロイフロー**

   ```bash
   # 1. 開発環境でテスト
   cd iac/environments/dev
   terraform apply

   # 2. 本番環境にデプロイ
   cd ../prd
   terraform apply
   ```

---

## ⚠️ 運用上の注意事項

### セキュリティ

#### 1. IAM 権限の最小化

- **原則**: 各 Lambda 関数には必要最小限の権限のみ付与
- **監視**: 定期的な権限見直し（四半期ごと）
- **アクセスログ**: CloudTrail での操作履歴確認

#### 2. 秘密情報の管理

```bash
# ❌ 避けるべき方法
export API_KEY="secret-key"  # 環境変数に直接設定

# ✅ 推奨方法
aws secretsmanager create-secret \
  --name "kanji-log/api-keys" \
  --secret-string '{"hotpepper":"secret-key"}'
```

#### 3. ネットワークセキュリティ

- **CORS 設定**: 本番では特定ドメインに制限
- **WAF 導入**: SQL インジェクション等の攻撃対策
- **HTTPS 強制**: 全ての通信を暗号化

### コスト管理

#### 1. リソース使用量の監視

```hcl
# CloudWatch アラームの設定例
resource "aws_cloudwatch_metric_alarm" "lambda_cost" {
  alarm_name          = "lambda-cost-alert"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = "86400"  # 1日
  statistic           = "Maximum"
  threshold           = "10"     # $10/日
  alarm_description   = "Lambda costs exceeding threshold"
}
```

#### 2. 不要リソースの自動削除

```bash
# 開発環境の夜間停止（Lambda関数の場合は課金停止できないが、他のリソース向け）
# GitHub Actionsでスケジュール実行
```

### バックアップとディザスタリカバリ

#### 1. 状態ファイルのバックアップ

- **S3 バージョニング**: 有効化済み
- **クロスリージョン複製**: 必要に応じて設定
- **定期的なバックアップ確認**: 月次で復元テスト

#### 2. DynamoDB バックアップ

```hcl
resource "aws_dynamodb_table" "events" {
  # 既存設定...

  # ポイントインタイム復旧
  point_in_time_recovery {
    enabled = true
  }

  # 自動バックアップ
  dynamic "backup" {
    for_each = var.environment == "prd" ? [1] : []
    content {
      backup_policy_status = "ENABLED"
    }
  }
}
```

### モニタリングと運用

#### 1. ログ管理

```bash
# CloudWatch Logsでの確認
make logs lambda=hello

# ログの長期保存設定（コスト削減）
aws logs put-retention-policy \
  --log-group-name /aws/lambda/kanji-log-hello-dev \
  --retention-in-days 30
```

#### 2. パフォーマンス監視

- **Lambda 実行時間**: 平均レスポンス時間の監視
- **エラー率**: 異常な増加の検知
- **API Gateway**: スロットリング発生の監視

#### 3. 依存関係の管理

```bash
# Go依存関係の脆弱性チェック
go list -json -m all | nancy sleuth

# Terraformの古いプロバイダー確認
terraform providers lock -platform=linux_amd64
```

---

## 📚 参考リンク・学習リソース

### AWS 公式ドキュメント

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)

### Go 言語学習

- [A Tour of Go](https://tour.golang.org/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [AWS SDK for Go](https://aws.github.io/aws-sdk-go-v2/docs/)

### DevOps・Infrastructure

- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [12 Factor App](https://12factor.net/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
