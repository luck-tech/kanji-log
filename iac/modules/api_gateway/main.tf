# =============================================================================
# API Gatewayモジュール：REST APIエンドポイントの構築
# =============================================================================
# 外部からLambda関数を呼び出すためのHTTPS REST APIを構築
# 認証、レート制限、CORS設定などの機能を提供

# 入力変数の定義
variable "api_name" {
  description = "API Gatewayのベース名"
  type        = string
}

variable "environment" {
  description = "環境名（API名に付与される）"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "統合対象Lambda関数の呼び出しARN"
  type        = string
}

variable "lambda_function_name" {
  description = "統合対象Lambda関数名"
  type        = string
}

# REST APIリソースの作成
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.api_name}-${var.environment}"  # 例: kanji-log-api-dev
  description = "Kanji-Log API for ${var.environment}"

  # エンドポイント設定（リージョナル: 特定リージョン内での最適化）
  endpoint_configuration {
    types = ["REGIONAL"]  # エッジ最適化ではなくリージョナル配置
  }

  # リソースタグ
  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }
}

# APIリソースの定義：/hello パス
# ルートリソース（/）の下に /hello パスを作成
resource "aws_api_gateway_resource" "hello" {
  rest_api_id = aws_api_gateway_rest_api.main.id          # 所属するREST API
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id  # 親リソース（ルート）
  path_part   = "hello"                                   # パスセグメント
}

# HTTPメソッドの定義：GET /hello
resource "aws_api_gateway_method" "hello_get" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.hello.id
  http_method   = "GET"        # HTTPメソッド
  authorization = "NONE"       # 認証なし（後で認証を追加可能）
}

# Lambda統合設定：API GatewayとLambda関数の接続
resource "aws_api_gateway_integration" "hello_lambda" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.hello.id
  http_method = aws_api_gateway_method.hello_get.http_method

  integration_http_method = "POST"              # Lambda呼び出しは常にPOST
  type                    = "AWS_PROXY"         # Lambdaプロキシ統合（リクエスト情報を自動転送）
  uri                     = var.lambda_invoke_arn  # Lambda関数の呼び出しURI
}

# レスポンス設定（CORS対応）
# ブラウザからのクロスオリジンリクエストを許可する設定
resource "aws_api_gateway_method_response" "hello_response_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.hello.id
  http_method = aws_api_gateway_method.hello_get.http_method
  status_code = "200"

  # レスポンス形式の定義
  response_models = {
    "application/json" = "Empty"  # JSON形式のレスポンス
  }

  # CORS用レスポンスヘッダーの定義
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# 統合レスポンス設定
resource "aws_api_gateway_integration_response" "hello_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.hello.id
  http_method = aws_api_gateway_method.hello_get.http_method
  status_code = aws_api_gateway_method_response.hello_response_200.status_code

  # CORS用ヘッダーの実際の値を設定
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"  # 全オリジンを許可（開発用）
  }

  depends_on = [aws_api_gateway_integration.hello_lambda]
}

# API デプロイメント
# 設定変更を実際のエンドポイントに反映するための仕組み
resource "aws_api_gateway_deployment" "main" {
  depends_on = [
    aws_api_gateway_integration.hello_lambda,
    aws_api_gateway_integration_response.hello_integration_response,
  ]

  rest_api_id = aws_api_gateway_rest_api.main.id

  # 設定変更時の自動再デプロイトリガー
  # リソース定義が変更された場合に自動的に再デプロイされる
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.hello.id,
      aws_api_gateway_method.hello_get.id,
      aws_api_gateway_integration.hello_lambda.id,
    ]))
  }

  # デプロイメント管理：ダウンタイムを回避
  lifecycle {
    create_before_destroy = true  # 新しいデプロイメントを作成してから古いものを削除
  }
}

# ステージ作成：デプロイメントに名前を付けて管理
# 開発、テスト、本番などの環境を分離して管理
resource "aws_api_gateway_stage" "main" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = var.environment  # 例: dev, stg, prd

  # リソースタグ
  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }
}

# =============================================================================
# アウトプット値：他のモジュールやシステムから参照される値
# =============================================================================

output "api_endpoint" {
  description = "API Gatewayのベースエンドポイント URL"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}"
}

output "hello_endpoint" {
  description = "Hello APIの完全なエンドポイント URL"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}/hello"
}

# 現在のAWSリージョン情報を取得
# エンドポイントURL構築時に使用される
data "aws_region" "current" {}
