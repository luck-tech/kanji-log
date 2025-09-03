# Task-005: 認証基盤構築 (IaC + Backend)

**優先度**: 🟡 高  
**所要時間**: 1.5 日  
**担当**: インフラ・バックエンド担当者

## 目的

Amazon Cognito による認証機能を構築

## 成果物

- [ ] Cognito User Pool 設定
- [ ] API Gateway Cognito 認証設定
- [ ] JWT 検証ミドルウェア
- [ ] 認証関連 API

## 詳細作業

### 1. Cognito 設定 (`iac/modules/cognito/main.tf`)

- User Pool 作成
- User Pool Client 設定
- 必要な属性定義

### 2. API Gateway 認証設定

- Cognito Authorizer の追加
- 既存エンドポイントへの認証適用

### 3. Go 認証ミドルウェア

```bash
mkdir -p backend/internal/middleware
```

- JWT 検証機能
- JWT 検証機能は自前実装を避け、Auth0 など実績のあるオープンソースの JWT 検証ライブラリの利用を検討します。
- ユーザー情報抽出

## 受け入れ条件

- [ ] 認証なしで API アクセスできない
- [ ] 正しい JWT トークンでアクセス可能
- [ ] ユーザー情報が Lambda で取得できる

## 前のタスク

[Task-004: イベント取得 API 実装](./task-004.md)

## 次のタスク

[Task-006: CI/CD パイプライン構築](./task-006.md)
