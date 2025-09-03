# Task-011: 本番環境向けセキュリティ堅牢化 (IaC + Backend)

**優先度**: 🔴 最高  
**所要時間**: 0.5 日  
**担当**: インフラ・バックエンド担当者

## 目的

本番リリースに向けて、開発中に許容していたセキュリティ設定を本番レベルに引き上げ、サービスを保護する。

## 詳細作業

### 1. CORS (Cross-Origin Resource Sharing) 設定の厳格化 (IaC)

- API Gateway または Lambda のレスポンスヘッダーで設定している`Access-Control-Allow-Origin`を`"*"`から、Web フォームがホストされる**本番環境のドメインのみ**に限定する。
- この設定は Terraform の環境別変数 (`iac/environments/prd/`) で管理する。

### 2. API Gateway ロギングとモニタリングの有効化 (IaC)

- 本番環境の API Gateway でアクセスログと実行ログを有効化し、CloudWatch Logs に出力する。
- 不正なリクエストパターンを検知するため、CloudWatch Alarms で特定のエラー（例: 401 Unauthorized, 403 Forbidden）が多発した場合のアラートを設定する。

## 受け入れ条件

- [ ] 本番ドメイン以外からの Web フォームの API リクエストがブラウザによってブロックされる。
- [ ] dev 環境では、引き続き開発用のオリジンからのアクセスが可能である。
- [ ] API へのすべてのリクエストが CloudWatch Logs に記録されている。

## 前のタスク

[Task-010: 記録管理機能実装](./task-010.md)

## 完了後

全タスク完了 🎉
