# Task-002: Hello World Lambda 実装（Backend）

**実行日**: 2025 年 9 月 4 日  
**担当者**: バックエンド担当者

## 目的と概要

Go 言語で Hello World Lambda 関数を実装し、デプロイパイプラインを確立する。これは幹事ナビプロジェクトのバックエンド実装の第一歩として、AWS Lambda を使用したサーバーレスアーキテクチャの基盤を構築するためのタスクです。

## 実行手順と結果

### 1. Go のインストールと環境構築

開発環境に Go がインストールされていなかったため、まず Homebrew を使用して Go をインストールしました。

```bash
brew install go
```

実行結果:

```
==> Downloading https://formulae.brew.sh/api/formula.jws.json
==> Downloading https://formulae.brew.sh/api/cask.jws.json
==> Fetching downloads for: go
==> Downloading https://ghcr.io/v2/homebrew/core/go/manifests/1.25.0
################################################################################################# 100.0%
==> Fetching go
==> Downloading https://ghcr.io/v2/homebrew/core/go/blobs/sha256:34c0a694a5388db003329d7f6d5069249117e89
################################################################################################# 100.0%
==> Pouring go--1.25.0.arm64_sequoia.bottle.tar.gz
🍺  /opt/homebrew/Cellar/go/1.25.0: 14,435 files, 193.3MB
```

インストールされた Go のバージョンを確認:

```bash
go version
```

実行結果:

```
go version go1.25.0 darwin/arm64
```

### 2. Go プロジェクトの初期化

プロジェクトのディレクトリ構造を作成し、Go モジュールを初期化しました。

```bash
mkdir -p backend/cmd/api/hello
cd backend && go mod init github.com/luck-tech/kanji-log/backend
```

実行結果:

```
go: creating new go.mod: module github.com/luck-tech/kanji-log/backend
go: to add module requirements and sums:
        go mod tidy
```

### 3. 依存関係の解決

AWS Lambda Go SDK など、必要な依存関係を追加しました。

```bash
go mod tidy
```

実行結果:

```
go: finding module for package github.com/aws/aws-lambda-go/lambda
go: finding module for package github.com/aws/aws-lambda-go/events
go: downloading github.com/aws/aws-lambda-go v1.49.0
go: found github.com/aws/aws-lambda-go/events in github.com/aws/aws-lambda-go v1.49.0
go: found github.com/aws/aws-lambda-go/lambda in github.com/aws/aws-lambda-go v1.49.0
go: downloading github.com/stretchr/testify v1.7.2
go: downloading gopkg.in/yaml.v3 v3.0.1
go: downloading github.com/pmezard/go-difflib v1.0.0
go: downloading github.com/davecgh/go-spew v1.1.1
```

### 4. Hello Lambda の実装

`backend/cmd/api/hello/main.go` ファイルに Lambda 関数のコードを実装しました。詳細なコメントを含むコードは以下の通りです:

```go
package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// HelloResponse は、Hello API のレスポンス構造体です
//
// 幹事ナビでの用途:
// - API 動作確認のためのテストエンドポイント
// - インフラ構築後の疎通確認
// - 将来的な API レスポンス形式の基盤
type HelloResponse struct {
	Success   bool   `json:"success"`   // API 実行成功フラグ
	Message   string `json:"message"`   // 返却メッセージ
	Timestamp string `json:"timestamp"` // レスポンス生成時刻（UTC）
}

// handler は、AWS Lambda の関数ハンドラーです
//
// AWS Lambda Go ランタイムでの動作:
// 1. API Gateway からのリクエストを events.APIGatewayProxyRequest として受信
// 2. ビジネスロジックを実行（今回は Hello メッセージ生成）
// 3. events.APIGatewayProxyResponse として HTTP レスポンスを返却
//
// 参考資料:
// - AWS Lambda Go Programming Model: https://docs.aws.amazon.com/lambda/latest/dg/golang-programming-model.html
// - API Gateway Lambda Proxy Integration: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-lambda-function-create.html
//
// 引数:
//   ctx: Lambda 実行コンテキスト（タイムアウト制御、キャンセル処理に使用）
//   request: API Gateway からのHTTPリクエスト情報（ヘッダー、クエリパラメータ、ボディ等）
//
// 戻り値:
//   events.APIGatewayProxyResponse: HTTP レスポンス（ステータスコード、ヘッダー、ボディ）
//   error: エラーが発生した場合のエラー情報
func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// ログ出力: CloudWatch Logs でリクエスト内容を確認可能
	// デバッグ時は request.Body, request.QueryStringParameters も確認推奨
	log.Printf("Received request: %s %s", request.HTTPMethod, request.Path)

	// レスポンスデータを構築
	// time.RFC3339: ISO 8601 形式のタイムスタンプ（例: "2025-09-04T12:34:56Z"）
	response := HelloResponse{
		Success:   true,
		Message:   "Hello from Kanji-Log!",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	// 構造体を JSON 文字列に変換
	// json.Marshal は []byte を返すため、string() でキャストが必要
	body, err := json.Marshal(response)
	if err != nil {
		// JSON 変換エラー時は 500 Internal Server Error を返却
		log.Printf("Failed to marshal response: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
			Body: `{"success": false, "message": "Internal server error"}`,
		}, nil
	}

	// HTTP レスポンスを構築して返却
	return events.APIGatewayProxyResponse{
		StatusCode: 200, // HTTP 200 OK
		Headers: map[string]string{
			"Content-Type": "application/json",
			// CORS ヘッダー: ブラウザからのクロスオリジンリクエストを許可
			// 注意: "*" は開発用設定。本番環境では特定ドメインに限定が必要
			// Task-011 で本番ドメイン（例: https://kanji-navi.app）に限定予定
			"Access-Control-Allow-Origin": "*",
			// プリフライトリクエスト対応（今後のPOST/PUT API で必要）
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		},
		Body: string(body),
	}, nil
}

// main は、Lambda 関数のエントリーポイントです
//
// AWS Lambda Go ランタイムでの動作:
// 1. lambda.Start() が Lambda ランタイムとの通信を開始
// 2. リクエストを受信するたびに handler 関数が呼び出される
// 3. 関数の実行が完了するまで待機し、レスポンスを返却
//
// 重要:
// - main 関数は Lambda の初期化時に1回だけ実行される
// - 変数やDB接続の初期化はここで行う（今回は不要）
// - handler 関数はリクエストごとに実行される
func main() {
	// AWS Lambda Go SDK の起動
	// これにより、Lambda ランタイムがこの関数を呼び出し可能になる
	lambda.Start(handler)
}
```

### 5. ビルドスクリプトの作成

Lambda デプロイパッケージを作成するためのシェルスクリプトを作成しました。

`backend/scripts/build.sh`:

```bash
#!/bin/bash
set -e

# ログ出力関数
log_info() {
  echo "[INFO] $1"
}

log_debug() {
  echo "[DEBUG] $1"
}

log_success() {
  echo "[SUCCESS] $1"
}

log_error() {
  echo "[ERROR] $1"
  exit 1
}

# 現在のディレクトリを確認
log_info "Starting Lambda build process..."
CURRENT_DIR=$(pwd)
log_debug "Current directory: $CURRENT_DIR"
log_debug "Go version: $(go version)"

# ビルドディレクトリの準備
BUILD_DIR="$CURRENT_DIR/build"
log_info "Preparing build directory: build"
mkdir -p "$BUILD_DIR"

# Goアプリケーションのクロスコンパイル (Linux向け)
log_info "Cross-compiling Go application for AWS Lambda..."
GOOS=linux GOARCH=amd64 go build -o "$BUILD_DIR/bootstrap" cmd/api/hello/main.go
if [ $? -ne 0 ]; then
  log_error "Go build failed!"
fi

# ビルドサイズの確認
BINARY_SIZE=$(du -h "$BUILD_DIR/bootstrap" | cut -f1)
log_success "Binary created: build/bootstrap ($BINARY_SIZE)"

# ZIPパッケージの作成
log_info "Creating deployment package: hello-lambda.zip"
cd "$BUILD_DIR" && zip -q "../hello-lambda.zip" bootstrap
cd "$CURRENT_DIR"

# ZIPサイズの確認
ZIP_SIZE=$(du -h "hello-lambda.zip" | cut -f1)
log_success "Deployment package created: hello-lambda.zip ($ZIP_SIZE)"
log_info "Build completed successfully!"

# 完了メッセージ
echo ""
echo "[SUMMARY] Build artifacts:"
echo "  📦 Binary: build/bootstrap"
echo "  🗜️  ZIP package: hello-lambda.zip"
echo ""
echo "[NEXT STEPS]"
echo "  1. AWS CLI でLambda関数を更新:"
echo "     aws lambda update-function-code --function-name kanji-log-hello-dev --zip-file fileb://hello-lambda.zip"
echo "  2. または Terraform でデプロイ:"
echo "     cd ../iac/environments/dev && terraform apply"
```

実行権限を付与:

```bash
chmod +x /Users/luckimai/Desktop/kanji-log/backend/scripts/build.sh
```

### 6. Lambda 関数のビルド

作成したビルドスクリプトを実行しました。

```bash
./scripts/build.sh
```

実行結果:

```
[INFO] Starting Lambda build process...
[DEBUG] Current directory: /Users/luckimai/Desktop/kanji-log/backend
[DEBUG] Go version: go version go1.25.0 darwin/arm64
[INFO] Preparing build directory: build
[INFO] Cross-compiling Go application for AWS Lambda...
[SUCCESS] Binary created: build/bootstrap (7.6M)
[INFO] Creating deployment package: hello-lambda.zip
[SUCCESS] Deployment package created: hello-lambda.zip (3.1M)
[INFO] Build completed successfully!
[SUMMARY] Build artifacts:
  📦 Binary: build/bootstrap
  🗜️  ZIP package: hello-lambda.zip

[NEXT STEPS]
  1. AWS CLI でLambda関数を更新:
     aws lambda update-function-code --function-name kanji-log-hello-dev --zip-file fileb://hello-lambda.zip
  2. または Terraform でデプロイ:
     cd ../iac/environments/dev && terraform apply
```

### 7. Lambda 関数のデプロイ

AWS 認証情報を確認:

```bash
aws sts get-caller-identity
```

実行結果:

```json
{
  "UserId": "AIDA4QUOXRI74L65UZKO7",
  "Account": "860366539327",
  "Arn": "arn:aws:iam::860366539327:user/kanji-navi-dev"
}
```

#### 7.1. Terraform ファイルの修正

Lambda 関数のデプロイをするため、Terraform ファイルを以下のように修正しました。

**1. Lambda 関数のソースファイルパスの更新**

`/iac/environments/dev/main.tf`:

```diff
  function_name = "kanji-log-hello"                     # Lambda関数名のベース
  environment   = "dev"                                 # 環境名（関数名に付与される）
  role_arn      = module.iam.lambda_execution_role_arn  # IAMモジュールで作成された実行ロール
- source_file   = "../../modules/lambda/placeholder.zip" # デプロイするコードのzipファイル
+ source_file   = "../../../backend/hello-lambda.zip" # デプロイするコードのzipファイル
```

**2. Lambda 関数のハッシュ追加と設定更新**

`/iac/modules/lambda/main.tf`:

```diff
  # デプロイパッケージの指定
  filename = var.source_file
+ source_code_hash = filebase64sha256(var.source_file)

  # 環境変数（Lambda関数内から参照可能）
```

**3. Lambda モジュールのライフサイクル設定の変更**

```diff
- # ライフサイクル設定：コードデプロイの管理
- # Terraformとは別でAWS CLIやCI/CDでコードをデプロイする場合に使用
- lifecycle {
-   ignore_changes = [filename, source_code_hash]  # ファイル変更を無視（手動デプロイ対応）
- }
+ # 今回はライフサイクル設定を無効化してTerraformでコードを更新
+ # lifecycle {
+ #   ignore_changes = [filename, source_code_hash]  # ファイル変更を無視（手動デプロイ対応）
+ # }
```

#### 7.2. Terraform によるデプロイ

Terraform プランを作成し、変更を確認:

```bash
cd /Users/luckimai/Desktop/kanji-log/iac/environments/dev && terraform plan -out=tfplan
```

実行結果（抜粋）:

```
Terraform will perform the following actions:

  # module.lambda.aws_lambda_function.hello will be updated in-place
  ~ resource "aws_lambda_function" "hello" {
      ~ filename                       = "../../modules/lambda/placeholder.zip" -> "../../../backend/hello-lambda.zip"
        id                             = "kanji-log-hello-dev"
      ~ last_modified                  = "2025-09-03T11:36:39.000+0000" -> (known after apply)
      + source_code_hash               = "BkO4p7I51qxAJUhHClu5GgV+BZHawiFvp3kjN1GDunI="
        tags                           = {
            "Environment" = "dev"
            "Project"     = "kanji-log"
        }
        # (26 unchanged attributes hidden)

        # (4 unchanged blocks hidden)
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

変更を適用:

```bash
terraform apply "tfplan"
```

実行結果:

```
╷
│ Warning: Deprecated Parameter
│
│ The parameter "dynamodb_table" is deprecated. Use parameter "use_lockfile" instead.
╵
module.lambda.aws_lambda_function.hello: Modifying... [id=kanji-log-hello-dev]
module.lambda.aws_lambda_function.hello: Modifications complete after 7s [id=kanji-log-hello-dev]

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.

Outputs:

api_endpoint = "https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev"
dynamodb_table_name = "kanji-log-events-dev"
hello_endpoint = "https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello"
lambda_function_name = "kanji-log-hello-dev"
```

### 8. API 動作確認

デプロイした API エンドポイントを curl コマンドでテスト:

```bash
curl https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello
```

実行結果:

```json
{
  "success": true,
  "message": "Hello from Kanji-Log!",
  "timestamp": "2025-09-03T18:18:31Z"
}
```

## 作成・修正したファイル一覧

1. **新規作成ファイル**:

   - `backend/cmd/api/hello/main.go` - Lambda 関数のメインコード
   - `backend/scripts/build.sh` - ビルドスクリプト
   - `backend/go.mod` - Go モジュール定義
   - `backend/go.sum` - 依存関係ハッシュ
   - `backend/hello-lambda.zip` - デプロイパッケージ
   - `backend/build/bootstrap` - コンパイル済みバイナリ

2. **修正ファイル**:
   - `iac/environments/dev/main.tf` - Lambda 関数のソースパス更新
   - `iac/modules/lambda/main.tf` - ハッシュ追加とライフサイクル設定変更

## 発生したエラーと解決方法

1. **問題**: Go がインストールされていなかった
   **解決**: `brew install go`で Go をインストール

2. **問題**: Lambda 関数の更新が Terraform プランに反映されない
   **解決**:
   - `source_code_hash`属性を追加してファイル変更を検出
   - `lifecycle`設定をコメントアウトして Terraform で変更を管理

## 学習ポイント・気づき

1. **Go 言語の Lambda 開発**:

   - AWS Lambda Go SDK は直感的で使いやすい
   - ビルド時のクロスコンパイルが必要（macOS -> Linux）
   - カスタムランタイムで「bootstrap」という名前のバイナリが必要

2. **Terraform による管理**:

   - `source_code_hash`を使うことで ZIP ファイルの変更を検出可能
   - `lifecycle`設定を使い分けることで柔軟なデプロイ戦略が可能

3. **デプロイ最適化**:
   - Go バイナリは軽量（3.1MB）でコールドスタート時間が短い
   - ビルドスクリプトの自動化で開発効率が向上

## 次タスクへの引き継ぎ事項

1. **インフラストラクチャ**:

   - API Gateway + Lambda + DynamoDB の連携基盤が構築済み
   - `https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello`で動作確認済み

2. **コード開発**:

   - 開発環境：Go 1.25.0
   - `backend/cmd/api/hello/main.go`をテンプレートとして機能を拡張
   - AWS SDK for Go の統合方法を踏襲

3. **セキュリティ考慮事項**:
   - 現状、CORS 設定は開発向けに全許可（`*`）設定
   - Task-011 で本番ドメインに制限予定

## 今後の開発方針

1. **API Gateway の設定拡張**:

   - 追加のエンドポイント作成
   - API 認証の導入（API キーや Cognito など）

2. **Lambda 関数の機能拡張**:

   - DynamoDB との連携実装
   - イベント処理ロジックの追加

3. **モニタリングとロギングの設定**:

   - CloudWatch アラームの設定
   - ロギング強化

4. **CI/CD パイプラインの構築**:
   - GitHub Actions などを使用した自動デプロイ
   - テスト自動化
