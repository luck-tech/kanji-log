# =============================================================================
# DynamoDBモジュール：幹事ナビのデータ保存テーブル
# =============================================================================
# 幹事が作成するイベント情報を保存するNoSQLデータベースを構築
# 高い可用性と自動スケーリングを提供し、サーバーレス環境に最適

# 入力変数の定義
variable "environment" {
  description = "環境名（dev, stg, prd等）- リソース名に付与される"
  type        = string
}

variable "table_name" {
  description = "DynamoDBテーブルのベース名"
  type        = string
}

# イベント情報テーブルの作成
resource "aws_dynamodb_table" "events" {
  name           = "${var.table_name}-${var.environment}"  # 例: kanji-log-events-dev
  billing_mode   = "PAY_PER_REQUEST"                       # 従量課金モード（アクセス数に応じて課金）
  hash_key       = "id"                                    # プライマリキー（イベントID）

  # プライマリキーの属性定義
  attribute {
    name = "id"    # イベントの一意識別子
    type = "S"     # String型
  }

  # GSI（Global Secondary Index）: 幹事IDでの効率的な検索を可能にする
  # 幹事が自分の作成したイベント一覧を取得する際に使用
  global_secondary_index {
    name            = "OrganizerIndex"   # インデックス名
    hash_key        = "organizerId"      # 幹事IDをキーとする
    projection_type = "ALL"              # 全属性を投影（検索時に追加クエリ不要）
  }

  # GSI用の属性定義
  attribute {
    name = "organizerId"  # 幹事（イベント作成者）の識別子
    type = "S"            # String型
  }

  # リソースタグ（AWS管理・コスト追跡用）
  tags = {
    Name        = "${var.table_name}-${var.environment}"  # リソース識別名
    Environment = var.environment                         # 環境分類
    Project     = "kanji-log"                            # プロジェクト名
  }
}

# =============================================================================
# アウトプット値：他のモジュールや環境から参照される値
# =============================================================================

output "table_name" {
  description = "作成されたDynamoDBテーブルの完全な名前"
  value       = aws_dynamodb_table.events.name
}

output "table_arn" {
  description = "DynamoDBテーブルのARN（IAM権限設定で使用）"
  value       = aws_dynamodb_table.events.arn
}
