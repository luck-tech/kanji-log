# 開発タスクチケット - 幹事ナビ バックエンド開発

以下のタスクを番号順に実行してください。

---

## Task-001: 最小限のインフラ基盤構築 (IaC)

**優先度**: 🔴 最高  
**所要時間**: 1 日  
**担当**: インフラ担当者

### 目的

AWS 上で動作する最小限のサーバーレスアーキテクチャを構築

### 成果物

- [ ] DynamoDB テーブル作成 (Events)
- [ ] Hello World Lambda 関数
- [ ] API Gateway エンドポイント (1 つ)
- [ ] 最小限の IAM Role 設定
- [ ] Terraform コード作成

### 詳細作業

1.  **Terraform 環境セットアップ**
    ```bash
    mkdir -p iac/modules/{lambda,dynamodb,api_gateway,iam}
    mkdir -p iac/environments/{dev,prd}
    ```
2.  **DynamoDB テーブル定義** (`iac/modules/dynamodb/main.tf`)
    - テーブル名: `kanji-log-events-{env}`
    - パーティションキー: `id` (String)
    - 請求モード: On-Demand
3.  **Lambda 関数定義** (`iac/modules/lambda/main.tf`)
    - 関数名: `kanji-log-hello-{env}`
    - ランタイム: `provided.al2`
    - ハンドラー: `bootstrap`
4.  **API Gateway 定義** (`iac/modules/api_gateway/main.tf`)
    - REST API 作成
    - `/hello` エンドポイント (GET)
    - Lambda 統合設定
5.  **IAM Role 定義** (`iac/modules/iam/main.tf`)
    - Lambda 実行ロール
    - DynamoDB 読み書き権限

### 受け入れ条件

- [ ] `terraform plan` が正常実行される
- [ ] `terraform apply` でリソースが作成される
- [ ] API Gateway 経由で Lambda が呼び出せる
- [ ] CloudWatch Logs にログが出力される

---

## Task-002: Hello World Lambda 実装 (Backend)

**優先度**: 🔴 最高  
**所要時間**: 0.5 日  
**担当**: バックエンド担当者

### 目的

Go 言語で Hello World Lambda 関数を実装し、デプロイパイプラインを確立

### 成果物

- [ ] Go Lambda 関数コード
- [ ] ビルドスクリプト
- [ ] 手動デプロイによる動作確認

### 詳細作業

1.  **Go プロジェクト初期化**
    ```bash
    mkdir -p backend/cmd/api/hello
    cd backend && go mod init github.com/luck-tech/kanji-log/backend
    ```
2.  **Hello Lambda 実装** (`backend/cmd/api/hello/main.go`)

    ```go
    package main

    import (
        "context"
        "encoding/json"
        "github.com/aws/aws-lambda-go/events"
        "github.com/aws/aws-lambda-go/lambda"
        "time"
    )

    func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
        response := map[string]interface{}{
            "success": true,
            "message": "Hello from Kanji-Log!",
            "timestamp": time.Now().UTC().Format(time.RFC3339),
        }

        body, _ := json.Marshal(response)

        return events.APIGatewayProxyResponse{
            StatusCode: 200,
            Headers: map[string]string{
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            Body: string(body),
        }, nil
    }

    func main() {
        lambda.Start(handler)
    }
    ```

3.  **ビルドスクリプト作成** (`backend/scripts/build.sh`)
    ```bash
    #!/bin/bash
    GOOS=linux GOARCH=amd64 go build -o bootstrap cmd/api/hello/main.go
    zip hello-lambda.zip bootstrap
    ```
4.  **⚠️ セキュリティ注意**
    - レスポンスヘッダーの`Access-Control-Allow-Origin: "*"`は開発用です。後続タスク(Task-011)で本番ドメインに限定します。

### 受け入れ条件

- [ ] ローカルでコンパイル可能
- [ ] zip 化された Lambda パッケージが作成される
- [ ] AWS CLI 等を使い手動で Lambda 関数にデプロイ可能
- [ ] API Gateway 経由で JSON レスポンスが返される

---

## Task-003: イベント作成 API 実装 (Backend + IaC)

**優先度**: 🟡 高  
**所要時間**: 1.5 日  
**担当**: バックエンド担当者

### 目的

最初のビジネスロジック（イベント作成）を実装

### 成果物

- [ ] イベント作成 Lambda 関数
- [ ] DynamoDB 操作コード
- [ ] API Gateway 設定更新
- [ ] ビジネスロジックの単体テストコード
- [ ] 入力値バリデーション

### 詳細作業

1.  **IaC 更新**
    - API Gateway `/events` POST エンドポイント追加
    - 新しい Lambda 関数定義
    - DynamoDB 操作権限追加
2.  **Go 実装** (`backend/cmd/api/create-event/main.go`)
    - API Gateway Proxy イベント処理
    - JSON 入力値バリデーション
    - DynamoDB PutItem 操作
    - エラーハンドリング
3.  **内部パッケージ作成**
    ```bash
    mkdir -p backend/internal/{domain,repository,handler}
    ```
    - `domain/event.go`: Event 構造体定義
    - `repository/dynamodb.go`: DynamoDB 操作層
    - `handler/event.go`: ビジネスロジック層
4.  **単体テスト実装**
    - `testing`パッケージを利用し、`handler`層および`repository`層のロジックをテストする。

### 受け入れ条件

- [ ] POST `/events` でイベント作成可能
- [ ] DynamoDB にデータが正しく保存される
- [ ] バリデーションエラーが適切に返される
- [ ] レスポンス形式が API 仕様書と一致する

---

## Task-004: イベント取得 API 実装 (Backend)

**優先度**: 🟡 高  
**所要時間**: 1 日  
**担当**: バックエンド担当者

### 目的

イベント一覧取得・詳細取得機能を**効率的かつスケーラブルに**実装する。

### 成果物

- [ ] イベント一覧取得 Lambda
- [ ] イベント詳細取得 Lambda

### 詳細作業

1.  **IaC 更新**
    - `GET /events` エンドポイント追加
    - `GET /events/{eventId}` エンドポイント追加
2.  **DynamoDB 設計・操作拡張**
    - **⚠️ 重要:** パフォーマンスとコストのため、一覧取得に`Scan`操作は**原則禁止**とします。`Query`操作による効率的な一覧取得を前提とし、必要であれば\*\*GSI (グローバルセンダリインデックス)\*\*の設計・追加を IaC 担当者と連携して行います。
3.  **カーソルベース・ページネーションの実装 (Go)**
    - `GET /events` API は、クエリパラメータとして `limit`（取得件数）と `exclusiveStartKey`（前回の最後の項目のキー）を受け取れるようにする。
    - DynamoDB の`Query`操作を実行し、結果と共に返される **`LastEvaluatedKey`** を取得する。
    - API のレスポンスには、イベントデータの一覧と、次のページを取得するためのキーとしてこの`LastEvaluatedKey`（例: `nextToken`）を含める。
      ```json
      // APIレスポンスの例
      {
        "items": [
          /* ...イベントデータ... */
        ],
        "nextToken": "xxxx-yyyy-zzzz" // DynamoDBのLastEvaluatedKeyをエンコードしたもの
      }
      ```
    - `nextToken`が`null`の場合、それが最終ページであることを示す。

### 受け入れ条件

- [ ] `GET /events` API に`limit`を指定すると、その件数分だけイベントが返される。
- [ ] レスポンスに含まれる`nextToken`を次回の`exclusiveStartKey`としてリクエストすると、**続きのデータ**が取得できる。
- [ ] 最終ページまで到達すると、レスポンスの`nextToken`が`null`になる。
- [ ] 存在しない ID で `GET /events/{eventId}` を叩くと 404 エラーが返る。

---

## Task-005: 認証基盤構築 (IaC + Backend)

**優先度**: 🟡 高  
**所要時間**: 1.5 日  
**担当**: インフラ・バックエンド担当者

### 目的

Amazon Cognito による認証機能を構築

### 成果物

- [ ] Cognito User Pool 設定
- [ ] API Gateway Cognito 認証設定
- [ ] JWT 検証ミドルウェア
- [ ] 認証関連 API

### 詳細作業

1.  **Cognito 設定** (`iac/modules/cognito/main.tf`)
    - User Pool 作成
    - User Pool Client 設定
    - 必要な属性定義
2.  **API Gateway 認証設定**
    - Cognito Authorizer の追加
    - 既存エンドポイントへの認証適用
3.  **Go 認証ミドルウェア**
    ```bash
    mkdir -p backend/internal/middleware
    ```
    - JWT 検証機能
    - JWT 検証機能は自前実装を避け、Auth0 など実績のあるオープンソースの JWT 検証ライブラリの利用を検討します。
    - ユーザー情報抽出

### 受け入れ条件

- [ ] 認証なしで API アクセスできない
- [ ] 正しい JWT トークンでアクセス可能
- [ ] ユーザー情報が Lambda で取得できる

---

## Task-006: CI/CD パイプライン構築

**優先度**: 🟡 高  
**所要時間**: 1 日  
**担当**: DevOps 担当者

### 目的

GitHub Actions による自動デプロイパイプラインを構築

### 成果物

- [ ] Terraform 自動デプロイ
- [ ] Lambda 自動デプロイ
- [ ] 環境別デプロイ（dev/prod）

### 詳細作業

1.  **GitHub Actions 設定** (`.github/workflows/`)
    - `deploy-infrastructure.yml`
    - `deploy-backend.yml`
2.  **AWS 認証設定**
    - OIDC 設定
    - IAM Role for GitHub Actions
3.  **デプロイスクリプト**
    - 環境変数管理
    - ビルド・デプロイ自動化

### 受け入れ条件

- [ ] PR マージで自動デプロイされる
- [ ] dev 環境でのテストが可能
- [ ] 本番デプロイが手動トリガーで実行可能

---

## Task-007: フォーム機能実装 (Backend)

**優先度**: 🟢 中  
**所要時間**: 2 日  
**担当**: バックエンド担当者

### 目的

フォーム作成・回答収集機能を実装

### 成果物

- [ ] フォーム作成 API
- [ ] 公開フォーム取得 API（認証なし）
- [ ] フォーム回答送信 API（認証なし）
- [ ] 回答集計 API

### 詳細作業

1.  **セキュリティ設定 (IaC)**
    - 認証なし API への不正利用（スパム等）を防ぐため、API Gateway で\*\*レート制限（スロットリング）\*\*を設定する。
2.  **DynamoDB 設計拡張**
    - Forms テーブル追加
    - FormResponses テーブル追加
3.  **Lambda 関数実装**
    - フォーム作成
    - 公開フォーム表示
    - 回答送信処理

### 受け入れ条件

- [ ] フォーム URL が生成される
- [ ] 認証なしでフォーム回答可能
- [ ] 回答データが正しく保存される

---

## Task-008: 日程調整機能実装 (Backend)

**優先度**: 🟢 中  
**所要時間**: 2 日  
**担当**: バックエンド担当者

### 目的

日程調整機能を実装

### 成果物

- [ ] 日程候補設定 API
- [ ] 日程回答 API（認証なし）
- [ ] 集計結果 API
- [ ] 日程確定 API

### 詳細作業

1.  **セキュリティ設定 (IaC)**
    - 認証なし API への不正利用を防ぐため、API Gateway で\*\*レート制限（スロットリング）\*\*を設定する。
2.  **DynamoDB 設計**
    - ScheduleOptions テーブル
    - ScheduleResponses テーブル
3.  **集計ロジック実装**
    - 回答状況の統計計算
    - 最適日程の提案

### 受け入れ条件

- [ ] 日程候補を設定できる
- [ ] 参加者が日程回答できる
- [ ] 集計結果が表示される

---

## Task-009: 外部 API 連携実装 (Backend)

**優先度**: 🟢 中  
**所要時間**: 2.5 日  
**担当**: バックエンド担当者

### 目的

Google Maps API・ホットペッパー API 連携を実装

### 成果物

- [ ] 位置情報分析 API
- [ ] レストラン検索 API
- [ ] 推薦アルゴリズム

### 詳細作業

1.  **Secrets Manager 設定**
    - API Key 管理
    - 環境別設定
2.  **外部 API クライアント実装**

    - Google Maps API 連携
    - ホットペッパー API 連携
      - **タイムアウト処理**を実装し、外部 API の遅延が自サービスに影響を与えないようにする。
      - **リトライ処理**（Exponential Backoff など）を実装し、一時的なエラーからの回復力を高める。

3.  **推薦ロジック**
    - メンバー嗜好分析
    - レストラン提案アルゴリズム

### 受け入れ条件

- [ ] 中心地点が計算される
- [ ] レストラン候補が提案される
- [ ] 推薦理由が表示される

---

## Task-010: 記録管理機能実装 (Backend)

**優先度**: 🔵 低  
**所要時間**: 2 日  
**担当**: バックエンド担当者

### 目的

イベント記録・共有機能を実装

### 成果物

- [ ] 記録作成 API
- [ ] 記録共有 API
- [ ] 共有記録検索 API
- [ ] いいね・通報機能

### 詳細作業

1.  **DynamoDB 設計**
    - EventLogs テーブル
    - SharedRecords テーブル
2.  **共有ロジック**
    - 個人情報マスキング
    - 個人情報マスキングのロジックは、重点的に単体テストを行う。
    - 共有範囲設定

### 受け入れ条件

- [ ] 記録を作成・共有できる
- [ ] 他人の記録を検索できる
- [ ] 個人情報が適切にマスキングされる

---

## Task-011: 本番環境向けセキュリティ堅牢化 (IaC + Backend)

**優先度**: 🔴 最高  
**所要時間**: 0.5 日  
**担当**: インフラ・バックエンド担当者

### 目的

本番リリースに向けて、開発中に許容していたセキュリティ設定を本番レベルに引き上げ、サービスを保護する。

### 詳細作業

1.  **CORS (Cross-Origin Resource Sharing) 設定の厳格化 (IaC)**
    - API Gateway または Lambda のレスポンスヘッダーで設定している `Access-Control-Allow-Origin` を `"*"` から、Web フォームがホストされる**本番環境のドメインのみ**に限定する。
    - この設定は Terraform の環境別変数 (`iac/environments/prd/`) で管理する。
2.  **API Gateway ロギングとモニタリングの有効化 (IaC)**
    - 本番環境の API Gateway でアクセスログと実行ログを有効化し、CloudWatch Logs に出力する。
    - 不正なリクエストパターンを検知するため、CloudWatch Alarms で特定のエラー（例: 401 Unauthorized, 403 Forbidden）が多発した場合のアラートを設定する。

### 受け入れ条件

- [ ] 本番ドメイン以外からの Web フォームの API リクエストがブラウザによってブロックされる。
- [ ] dev 環境では、引き続き開発用のオリジンからのアクセスが可能である。
- [ ] API へのすべてのリクエストが CloudWatch Logs に記録されている。

---

## 📊 開発スケジュール概算

```
Week 1: Task-001 → Task-002 → Task-003
Week 2: Task-004 → Task-005 → Task-006
Week 3: Task-007 → Task-008
Week 4: Task-009 → Task-010 → Task-011
```

_(最終週にセキュリティ堅牢化タスクを追加)_

**Total**: 約 4.5 週間（1 人フルタイムの場合）

## 🎯 成功の指標

- [ ] 全 API エンドポイントが仕様書通りに動作
- [ ] フロントエンドとの結合テストが成功
- [ ] 本番環境でのパフォーマンステスト通過
- [ ] **セキュリティ監査通過**

## ⚠️ リスク・注意事項

1.  **外部 API 制限**: Google Maps/ホットペッパー API の利用制限に注意
2.  **コスト管理**: DynamoDB の使用量監視を実装
3.  **セキュリティ**: Cognito 設定と IAM 権限の適切な設定
4.  **パフォーマンス**: Lambda Cold Start 対策の検討

## 📚 参考資料

- [AWS Lambda Go Programming Model](https://docs.aws.amazon.com/lambda/latest/dg/lambda-golang.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [API Gateway + Lambda Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
