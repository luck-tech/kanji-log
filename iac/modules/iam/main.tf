# =============================================================================
# IAMモジュール：Lambda関数の実行権限管理
# =============================================================================
# Lambda関数がDynamoDBやCloudWatch Logsにアクセスするための権限を設定
# 最小権限の原則に従い、必要最小限の権限のみを付与

# 入力変数の定義
variable "dynamodb_table_arn" {
  description = "アクセス対象のDynamoDBテーブルARN"
  type        = string
}

variable "environment" {
  description = "環境名（ロール名に付与される）"
  type        = string
}

# Lambda関数用のIAM実行ロール
# Lambda関数が他のAWSサービスにアクセスするための権限を提供
resource "aws_iam_role" "lambda_execution_role" {
  name = "kanji-log-lambda-execution-role-${var.environment}"

  # このロールを引き受け（使用）できるサービスを定義
  # Lambda サービスのみがこのロールを使用可能
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"        # ロール引き受けアクション
        Effect = "Allow"                 # 許可
        Principal = {
          Service = "lambda.amazonaws.com"  # Lambdaサービスのみ許可
        }
      }
    ]
  })

  # リソースタグ
  tags = {
    Environment = var.environment
    Project     = "kanji-log"
  }
}

# AWS管理ポリシーのアタッチ：Lambda基本実行権限
# CloudWatch Logsへの書き込み権限などLambda実行に必要な基本権限を提供
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# カスタムポリシー：DynamoDB操作権限
# 幹事ナビアプリで使用するDynamoDBテーブルへの読み書き権限を付与
resource "aws_iam_role_policy" "dynamodb_policy" {
  name = "kanji-log-lambda-dynamodb-policy-${var.environment}"
  role = aws_iam_role.lambda_execution_role.id

  # ポリシードキュメント：JSON形式で権限を定義
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"              # 許可
        Action = [
          "dynamodb:GetItem",         # 単一アイテム取得
          "dynamodb:PutItem",         # アイテム作成・上書き
          "dynamodb:UpdateItem",      # アイテム更新
          "dynamodb:DeleteItem",      # アイテム削除
          "dynamodb:Query",           # 条件検索（GSI使用時等）
          "dynamodb:Scan"             # 全件スキャン
        ]
        Resource = [
          var.dynamodb_table_arn,                    # メインテーブル
          "${var.dynamodb_table_arn}/index/*"        # 全てのGSI（Global Secondary Index）
        ]
      }
    ]
  })
}

# =============================================================================
# アウトプット値：他のモジュールから参照される値
# =============================================================================

output "lambda_execution_role_arn" {
  description = "Lambda関数に割り当てる実行ロールのARN"
  value       = aws_iam_role.lambda_execution_role.arn
}
