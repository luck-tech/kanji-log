# =============================================================================
# 開発環境のアウトプット定義
# =============================================================================
# terraform applyの実行後に表示される重要な情報
# 他のシステムやCIツールから参照する際にも使用される

output "dynamodb_table_name" {
  description = "作成されたDynamoDBテーブル名"
  value       = module.dynamodb.table_name
}

output "lambda_function_name" {
  description = "作成されたLambda関数名"
  value       = module.lambda.function_name
}

output "api_endpoint" {
  description = "API Gatewayのベースエンドポイント URL"
  value       = module.api_gateway.api_endpoint
}

output "hello_endpoint" {
  description = "Hello APIの完全なエンドポイント URL（動作確認用）"
  value       = module.api_gateway.hello_endpoint
}
