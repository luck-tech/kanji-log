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
  description = "Hello Lambda関数名（テスト用）"
  value       = module.hello_lambda.function_name
}

output "api_endpoint" {
  description = "API Gatewayのベースエンドポイント URL"
  value       = module.api_gateway.api_endpoint
}

output "hello_endpoint" {
  description = "Hello APIの完全なエンドポイント URL（動作確認用）"
  value       = module.api_gateway.hello_endpoint
}

output "events_endpoint" {
  description = "Events APIの完全なエンドポイント URL（イベント作成用）"
  value       = module.api_gateway.events_endpoint
}

output "create_event_lambda_function_name" {
  description = "Create Event Lambda関数名"
  value       = module.create_event_lambda.function_name
}
