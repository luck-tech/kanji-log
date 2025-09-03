# 幹事ナビ インフラストラクチャ (IaC)

このディレクトリには、幹事ナビアプリの AWS サーバーレスインフラを**Terraform**で管理するコードが含まれています。

## 🏗️ アーキテクチャ概要

幹事ナビは以下の AWS サービスを使用したサーバーレス構成で構築されています：

- **DynamoDB**: イベント情報の保存（NoSQL データベース）
- **Lambda**: ビジネスロジックの実行（Go 言語）
- **API Gateway**: HTTPS エンドポイントの提供
- **IAM**: 各サービス間の権限管理

## 📁 ディレクトリ構造

```
iac/
├── _bootstrap/        # Terraform状態管理用インフラ
│   ├── iam_policies/  # IAM権限管理（最小権限ポリシー）
│   │   └── kanji-navi-dev-policy.json
│   └── state_backend/ # S3バックエンド・DynamoDBロック設定
│       └── main.tf
├── modules/           # 再利用可能なTerraformモジュール
│   ├── dynamodb/      # DynamoDBテーブル定義
│   ├── lambda/        # Lambda関数定義
│   ├── api_gateway/   # API Gateway定義
│   └── iam/          # IAMロール・ポリシー定義
└── environments/      # 環境別設定
    ├── dev/          # 開発環境（S3バックエンド対応済み）
    └── prd/          # 本番環境（今後実装予定）
```

## 🚀 デプロイ手順

### 前提条件

1. **AWS CLI の設定**

   ```bash
   # IAMユーザーのアクセスキーで設定
   aws configure

   # または Single Sign-On (SSO) で設定
   aws configure sso

   # 設定確認
   aws sts get-caller-identity
   ```

2. **Terraform のインストール**

   ```bash
   # macOS (Homebrew)
   brew tap hashicorp/tap
   brew install hashicorp/tap/terraform

   # バージョン確認（1.0以降が必要）
   terraform version
   ```

3. **必要な IAM 権限**

   **セキュリティ強化済み**: 開発用 IAM ユーザーには最小権限ポリシー（`KanjiNaviTerraformMinimal`）を適用。

   以下の AWS サービスに対する最小限の権限が設定済み：

   - DynamoDB (テーブル作成・管理・読み取り)
   - Lambda (関数作成・管理)
   - API Gateway (API 作成・管理)
   - IAM (ロール・ポリシー作成・管理)
   - S3 (Terraform 状態管理用バケット操作)
   - CloudWatch Logs (ログ管理)

   **注意**: AdministratorAccess は削除済み（セキュリティリスク軽減）

### 開発環境のデプロイ

**注意**: Terraform 状態ファイルは S3 で中央管理されています。初回実行時に自動的に S3 バックエンドに接続されます。

```bash
# 開発環境ディレクトリに移動
cd iac/environments/dev

# Terraform初期化（S3バックエンドに接続）
# 状態ファイルがS3から自動取得されます
terraform init

# デプロイ計画の確認
# 作成されるリソースを事前チェック（推奨）
terraform plan

# インフラストラクチャのデプロイ
# 14個のAWSリソースが作成されます
terraform apply
```

**チーム開発対応**: 複数の開発者が同じ環境で作業する場合、DynamoDB による状態ロック機能が自動的に競合を防止します。

### デプロイ後の動作確認

```bash
# 出力される情報を確認
terraform output

# Hello APIエンドポイントの動作テスト
curl $(terraform output -raw hello_endpoint)
```

## 📝 想定される出力結果

### Terraform Output

```bash
api_endpoint = "https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev"
dynamodb_table_name = "kanji-log-events-dev"
hello_endpoint = "https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev/hello"
lambda_function_name = "kanji-log-hello-dev"
```

### API レスポンス

```json
{
  "message": "Hello from Kanji-Log!"
}
```

## 🧹 リソースの削除

**注意**: 以下のコマンドで全ての作成された AWS リソースが削除されます

```bash
# 開発環境のリソースを完全削除
cd iac/environments/dev
terraform destroy
```

## ⚠️ 重要な注意事項

1. **プレースホルダー関数**:

   - 現在の Lambda 関数は動作確認用のプレースホルダーです
   - Task-002 で Go 言語による実装に置き換える予定

2. **セキュリティ設定**:

   - CORS 設定は開発用として全オリジン(`*`)を許可
   - 本番環境では特定ドメインに限定が必要

3. **コスト管理**:

   - DynamoDB は Pay-per-request モード（使用量課金）
   - Lambda 関数は実行時間に応じて課金
   - API Gateway は呼び出し回数に応じて課金

4. **状態管理（チーム開発対応完了）**:
   - ✅ **S3 バックエンド**: 状態ファイルは`kanji-navi-terraform-state-*`バケットで中央管理
   - ✅ **DynamoDB ロック**: `kanji-navi-terraform-lock-*`テーブルで同時実行制御
   - ✅ **暗号化**: AES-256 暗号化とバージョニング有効
   - ✅ **セキュリティ**: パブリックアクセス完全ブロック

## 🔒 セキュリティ強化

### IAM 権限の最小化

- **最小権限原則**: `KanjiNaviTerraformMinimal`ポリシーで必要最小限の権限のみ付与
- **AdministratorAccess 削除**: セキュリティリスクを大幅削減
- **リージョン制限**: ap-northeast-1 リージョンのみでの操作に限定

### Terraform 状態管理のセキュリティ

- **S3 暗号化**: 状態ファイルの AES-256 暗号化
- **バージョニング**: 状態ファイルの変更履歴管理
- **アクセス制御**: 最小権限での S3 バケットアクセス

## � 次のステップ

- **Task-002**: Go 言語での Lambda 関数実装
- **API Gateway**: 追加エンドポイントの実装
- **DynamoDB**: イベントデータの CRUD 操作実装
- **認証**: AWS Cognito 等での認証機能追加
