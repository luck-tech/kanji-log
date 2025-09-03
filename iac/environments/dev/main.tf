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
    dynamodb_table = "kanji-navi-terraform-lock-ocygln1t"
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

# Lambda（サーバーレス関数）
# API経由でビジネスロジックを実行する関数を作成
module "lambda" {
  source = "../../modules/lambda"   # Lambdaモジュールのパス
  
  function_name = "kanji-log-hello"                     # Lambda関数名のベース
  environment   = "dev"                                 # 環境名（関数名に付与される）
  role_arn      = module.iam.lambda_execution_role_arn  # IAMモジュールで作成された実行ロール
  source_file   = "../../modules/lambda/placeholder.zip" # デプロイするコードのzipファイル
}

# API Gateway（HTTPSエンドポイント）
# 外部からLambda関数を呼び出すためのREST APIを作成
module "api_gateway" {
  source = "../../modules/api_gateway"  # API Gatewayモジュールのパス
  
  api_name              = "kanji-log-api"              # API名のベース
  environment           = "dev"                        # 環境名（API名に付与される）
  lambda_invoke_arn     = module.lambda.invoke_arn     # Lambda関数の呼び出しARN
  lambda_function_name  = module.lambda.function_name  # Lambda関数名
}
