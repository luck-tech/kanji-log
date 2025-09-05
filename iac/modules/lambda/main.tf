# =============================================================================
# Lambda汎用モジュール：再利用可能なサーバーレス関数の「型枠」
# =============================================================================
# 任意のLambda関数を作成するための汎用的なテンプレート
# hello, create-event, get-event等、全ての関数で共通利用可能
# Go言語で実装されたカスタムランタイムを使用（高速起動・低メモリ消費）

# 入力変数の定義
variable "function_name" {
  description = "Lambda関数名（環境プレフィックスなし）"
  type        = string
}

variable "environment" {
  description = "環境名（dev/prd）"
  type        = string
}

variable "role_arn" {
  description = "Lambda実行用IAMロールのARN"
  type        = string
}

variable "source_file" {
  description = "デプロイするzipファイルのパス"
  type        = string
  default     = "placeholder.zip"
}

variable "table_name" {
  description = "DynamoDBテーブル名（オプション）"
  type        = string
  default     = ""
}

variable "timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  default     = 256
}

# Lambda関数リソース（汎用設計）
resource "aws_lambda_function" "this" {
  function_name = "${var.function_name}-${var.environment}"  # 例: kanji-log-create-event-dev
  role         = var.role_arn                                # IAMモジュールで作成された実行ロール
  handler      = "bootstrap"                                 # Goバイナリの場合はbootstrapというファイル名
  runtime      = "provided.al2"                             # Amazon Linux 2ベースのカスタムランタイム
  timeout      = var.timeout                                 # 最大実行時間（秒）
  memory_size  = var.memory_size                             # メモリサイズ（MB）

  # デプロイパッケージの指定
  filename         = var.source_file
  source_code_hash = filebase64sha256(var.source_file)

  # 環境変数（Lambda関数内から参照可能）
  environment {
    variables = merge(
      {
        ENVIRONMENT = var.environment
      },
      var.table_name != "" ? { TABLE_NAME = var.table_name } : {}
    )
  }

  # リソースタグ
  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }

  # 今回はライフサイクル設定を無効化してTerraformでコードを更新
  # lifecycle {
  #   ignore_changes = [filename, source_code_hash]  # ファイル変更を無視（手動デプロイ対応）
  # }
}

# Lambda関数の呼び出し権限設定
# API GatewayがLambda関数を呼び出すための権限を付与
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"  # 権限ステートメントの識別子
  action        = "lambda:InvokeFunction"            # 許可するアクション（関数実行）
  function_name = aws_lambda_function.this.function_name  # 対象のLambda関数
  principal     = "apigateway.amazonaws.com"         # 権限を付与するサービス
}

# CloudWatch Logsグループ
resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${aws_lambda_function.this.function_name}"
  retention_in_days = 30

  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }
}

# =============================================================================
# アウトプット値：他のモジュールから参照される値
# =============================================================================

output "function_name" {
  description = "作成されたLambda関数名"
  value       = aws_lambda_function.this.function_name
}

output "function_arn" {
  description = "Lambda関数のARN"
  value       = aws_lambda_function.this.arn
}

output "invoke_arn" {
  description = "API Gatewayが使用するLambda関数の呼び出しARN"
  value       = aws_lambda_function.this.invoke_arn
}

output "log_group_name" {
  description = "CloudWatch Logsグループ名"
  value       = aws_cloudwatch_log_group.this.name
}
