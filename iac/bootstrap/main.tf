# Terraform状態管理用S3バックエンド設定
# 
# このファイルは、Terraformの状態ファイルをS3に保存し、
# DynamoDBでロック機能を提供するバックエンド設定を作成します。
#
# 使用方法:
# 1. terraform init
# 2. terraform apply 
# 3. 既存のTerraform設定にbackend設定を追加
# 4. terraform init -migrate-state

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
  
  default_tags {
    tags = {
      Project     = "kanji-navi"
      Environment = "dev"
      ManagedBy   = "terraform"
      Purpose     = "terraform-state-backend"
    }
  }
}

# ランダムなサフィックスを生成してバケット名の重複を防ぐ
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Terraform状態ファイル保存用S3バケット
# 
# セキュリティ設定:
# - バージョニング有効（誤削除防止）
# - AES-256暗号化
# - パブリックアクセス完全ブロック
# - 削除保護有効
resource "aws_s3_bucket" "terraform_state" {
  bucket = "kanji-navi-terraform-state-${random_string.bucket_suffix.result}"
  
  lifecycle {
    # 本番運用時は削除防止を有効にする
    prevent_destroy = false # 開発時はfalse、本番時はtrueに変更
  }
  
  tags = {
    Name        = "kanji-navi-terraform-state"
    Description = "Terraform状態ファイル保存用バケット"
  }
}

# バケットのバージョニング設定
# 状態ファイルの変更履歴を保持し、必要に応じてロールバック可能にする
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# バケットの暗号化設定
# 状態ファイルには機密情報が含まれるため、AES-256で暗号化
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# パブリックアクセスブロック設定
# セキュリティ強化のため、すべてのパブリックアクセスをブロック
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Terraform状態ロック用DynamoDBテーブル
# 
# 機能:
# - 同時実行防止（複数人での同時terraform実行を防ぐ）
# - 状態ファイルの整合性保護
# - LockIDがプライマリーキー
resource "aws_dynamodb_table" "terraform_lock" {
  name           = "kanji-navi-terraform-lock-${random_string.bucket_suffix.result}"
  billing_mode   = "PAY_PER_REQUEST" # オンデマンド課金（開発環境向け）
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S" # String型
  }

  tags = {
    Name        = "kanji-navi-terraform-lock"
    Description = "Terraform状態ロック管理用テーブル"
  }
}

# バックエンド設定用の出力値
# これらの値を使って既存のTerraform設定にbackend設定を追加する
output "terraform_state_bucket" {
  description = "Terraform状態ファイル保存用S3バケット名"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "terraform_lock_table" {
  description = "Terraform状態ロック用DynamoDBテーブル名"
  value       = aws_dynamodb_table.terraform_lock.name
}

output "backend_configuration" {
  description = "既存のTerraform設定に追加するbackend設定例"
  value = <<-EOT
    backend "s3" {
      bucket         = "${aws_s3_bucket.terraform_state.bucket}"
      key            = "environments/dev/terraform.tfstate"
      region         = "ap-northeast-1"
      dynamodb_table = "${aws_dynamodb_table.terraform_lock.name}"
      encrypt        = true
    }
  EOT
}
