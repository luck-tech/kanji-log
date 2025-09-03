# =============================================================================
# Lambdaモジュール：サーバーレス関数の定義
# =============================================================================
# 幹事ナビのビジネスロジックを実行するサーバーレス関数を作成
# Go言語で実装されたカスタムランタイムを使用（高速起動・低メモリ消費）

# 入力変数の定義
variable "function_name" {
  description = "Lambda関数のベース名"
  type        = string
}

variable "environment" {
  description = "環境名（関数名に付与される）"
  type        = string
}

variable "role_arn" {
  description = "Lambda関数に割り当てるIAMロールのARN"
  type        = string
}

variable "source_file" {
  description = "デプロイするLambda関数のzipファイルパス"
  type        = string
  default     = "placeholder.zip"  # デフォルトはプレースホルダー
}

# Lambda関数リソース
# 現在はプレースホルダー、後でGo言語の実装で置き換え予定
resource "aws_lambda_function" "hello" {
  function_name = "${var.function_name}-${var.environment}"  # 例: kanji-log-hello-dev
  role         = var.role_arn                                # IAMモジュールで作成された実行ロール
  handler      = "bootstrap"                                 # Go言語カスタムランタイムのエントリーポイント
  runtime      = "provided.al2"                             # Amazon Linux 2ベースのカスタムランタイム
  timeout      = 30                                          # 最大実行時間（秒）

  # デプロイパッケージの指定
  filename = var.source_file

  # 環境変数（Lambda関数内から参照可能）
  environment {
    variables = {
      ENVIRONMENT = var.environment  # 実行環境の識別用
    }
  }

  # リソースタグ
  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }

  # ライフサイクル設定：コードデプロイの管理
  # Terraformとは別でAWS CLIやCI/CDでコードをデプロイする場合に使用
  lifecycle {
    ignore_changes = [filename, source_code_hash]  # ファイル変更を無視（手動デプロイ対応）
  }
}

# Lambda関数の呼び出し権限設定
# API GatewayがLambda関数を呼び出すための権限を付与
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"  # 権限ステートメントの識別子
  action        = "lambda:InvokeFunction"            # 許可するアクション（関数実行）
  function_name = aws_lambda_function.hello.function_name  # 対象のLambda関数
  principal     = "apigateway.amazonaws.com"         # 権限を付与するサービス
}

# =============================================================================
# アウトプット値：他のモジュールから参照される値
# =============================================================================

output "function_name" {
  description = "作成されたLambda関数名"
  value       = aws_lambda_function.hello.function_name
}

output "function_arn" {
  description = "Lambda関数のARN"
  value       = aws_lambda_function.hello.arn
}

output "invoke_arn" {
  description = "API Gatewayが使用するLambda関数の呼び出しARN"
  value       = aws_lambda_function.hello.invoke_arn
}
