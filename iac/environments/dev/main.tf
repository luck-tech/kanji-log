# =============================================================================
# 幹事ナビ開発環境のインフラ定義
# =============================================================================
# 最小限のサーバーレス構成（DynamoDB + Lambda + API Gateway）を構築
# このファイルは開発環境用の設定です。本番環境は別途 prd/ ディレクトリで管理

terraform {
  # Terraformのバージョン制約: 1.0以降を要求
  required_version = ">= 1.0"
  
  # 使用するプロバイダー（AWSリソース管理）の定義
  required_providers {
    aws = {
      source  = "hashicorp/aws"  # HashiCorp公式のAWSプロバイダー
      version = "~> 5.0"         # バージョン5.x系を使用（メジャーバージョン固定）
    }
  }

  # Terraformの状態ファイルをS3で管理（チーム開発対応）
  # 状態ファイルの中央管理とロック機能により安全な協調開発を実現
  backend "s3" {
    bucket         = "kanji-navi-terraform-state-ocygln1t"
    key            = "environments/dev/terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
  }
  # backend "s3" {
  #   bucket = "kanji-log-terraform-state"  # 状態ファイル保存用S3バケット
  #   key    = "dev/terraform.tfstate"      # 開発環境用の状態ファイルパス
  #   region = "ap-northeast-1"             # S3バケットのリージョン
  # }
}

# AWSプロバイダーの設定
provider "aws" {
  region = var.aws_region  # 使用するAWSリージョン（variables.tfで定義）

  # 全リソースに自動付与されるタグ
  # これにより作成されるすべてのAWSリソースに共通タグが付与される
  default_tags {
    tags = {
      Environment = "dev"         # 環境識別（dev/stg/prd）
      Project     = "kanji-log"   # プロジェクト名
      ManagedBy   = "terraform"   # 管理ツール識別
    }
  }
}

# =============================================================================
# モジュール定義: 各AWSサービスの設定
# =============================================================================
# 各サービスは modules/ ディレクトリに分割して管理
# これによりコードの再利用性と保守性を向上

# DynamoDB（NoSQLデータベース）
# 幹事ナビで使用するイベント情報を保存するテーブルを作成
module "dynamodb" {
  source = "../../modules/dynamodb"  # DynamoDBモジュールのパス
  
  environment = "dev"                # 環境名（テーブル名に付与される）
  table_name  = "kanji-log-events"   # ベーステーブル名
}

# IAM（権限管理）
# Lambda関数がDynamoDBにアクセスするための権限を設定
module "iam" {
  source = "../../modules/iam"       # IAMモジュールのパス
  
  environment        = "dev"                      # 環境名（ロール名に付与される）
  dynamodb_table_arn = module.dynamodb.table_arn # DynamoDBテーブルのARN（他モジュールからの参照）
}

# Lambda関数（サーバーレス関数群）
# 汎用的なlambdaモジュールを使用して複数の関数を実体化

# Hello Lambda関数（テスト用）
module "hello_lambda" {
  source        = "../../modules/lambda"
  function_name = "kanji-log-hello"
  environment   = "dev"
  role_arn      = module.iam.lambda_execution_role_arn
  source_file   = "../../../backend/hello-lambda.zip"
}

# Create Event Lambda関数（イベント作成API）
module "create_event_lambda" {
  source        = "../../modules/lambda"
  function_name = "kanji-log-create-event"
  environment   = "dev"
  role_arn      = module.iam.lambda_execution_role_arn
  source_file   = "../../../backend/create-event-lambda.zip"
  table_name    = module.dynamodb.table_name
}

# API Gateway（HTTPSエンドポイント）
# 外部からLambda関数を呼び出すためのREST APIを作成
module "api_gateway" {
  source = "../../modules/api_gateway"  # API Gatewayモジュールのパス
  
  api_name              = "kanji-log-api"              # API名のベース
  environment           = "dev"                        # 環境名（API名に付与される）
  lambda_invoke_arn     = module.hello_lambda.invoke_arn     # Hello Lambda関数の呼び出しARN
  lambda_function_name  = module.hello_lambda.function_name  # Hello Lambda関数名
  
  # Create Event Lambda関数の設定
  create_event_lambda_invoke_arn     = module.create_event_lambda.invoke_arn
  create_event_lambda_function_name  = module.create_event_lambda.function_name
}
