# Task-001: 最小限のインフラ基盤構築 (IaC)

**優先度**: 🔴 最高  
**所要時間**: 1 日  
**担当**: インフラ担当者

## 実行指示

### 必須作業標準

1. **詳細コメント**: AWS/インフラ初心者でも理解できるよう、全コードに説明コメントを追加
2. **作業ログ記録**: `docs/log/task-001.md` に以下を詳細記録
   - 実行コマンド（再現可能な形で）
   - 発生したエラーと解決方法
   - 作成・修正したファイル一覧
   - 動作確認結果
   - 次タスクへの引き継ぎ事項
   - 学習ポイント・気づき

## 目的

AWS 上で動作する最小限のサーバーレスアーキテクチャを構築

## 成果物

- [ ] DynamoDB テーブル作成 (Events)
- [ ] Hello World Lambda 関数
- [ ] API Gateway エンドポイント (1 つ)
- [ ] 最小限の IAM Role 設定
- [ ] Terraform コード作成

## 詳細作業

### 1. Terraform 環境セットアップ

```bash
mkdir -p iac/modules/{lambda,dynamodb,api_gateway,iam}
mkdir -p iac/environments/{dev,prd}
```

### 2. DynamoDB テーブル定義 (`iac/modules/dynamodb/main.tf`)

- テーブル名: `kanji-log-events-{env}`
- パーティションキー: `id` (String)
- 請求モード: On-Demand

### 3. Lambda 関数定義 (`iac/modules/lambda/main.tf`)

- 関数名: `kanji-log-hello-{env}`
- ランタイム: `provided.al2`
- ハンドラー: `bootstrap`

### 4. API Gateway 定義 (`iac/modules/api_gateway/main.tf`)

- REST API 作成
- `/hello` エンドポイント (GET)
- Lambda 統合設定

### 5. IAM Role 定義 (`iac/modules/iam/main.tf`)

- Lambda 実行ロール
- DynamoDB 読み書き権限

## 受け入れ条件

- [ ] `terraform plan` が正常実行される
- [ ] `terraform apply` でリソースが作成される
- [ ] API Gateway 経由で Lambda が呼び出せる
- [ ] CloudWatch Logs にログが出力される

## 次のタスク

[Task-002: Hello World Lambda 実装](./task-002.md)
