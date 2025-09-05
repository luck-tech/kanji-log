# Kanji-Log バックエンド仕様書

## 📋 概要

Kanji-Log のサーバーレスバックエンドの技術仕様・構成情報。
Go 言語、AWS Lambda、DynamoDB、Terraform を使用したサーバーレスアーキテクチャ。

---

## 🏗️ アーキテクチャ構成

### システム構成図

```
[Client] → [API Gateway] → [Lambda Functions] → [DynamoDB]
                              ↓
                        [CloudWatch Logs]
```

### 使用技術スタック

| 技術                   | バージョン   | 用途                   |
| ---------------------- | ------------ | ---------------------- |
| **Go**                 | 1.25.0       | Lambda 関数の実装言語  |
| **AWS SDK for Go**     | v2.x         | AWS サービスとの連携   |
| **AWS Lambda**         | provided.al2 | サーバーレス実行環境   |
| **Amazon DynamoDB**    | -            | NoSQL データベース     |
| **Amazon API Gateway** | REST API     | HTTPS エンドポイント   |
| **Terraform**          | latest       | Infrastructure as Code |
| **CloudWatch Logs**    | -            | ログ管理               |

### AWS Lambda ランタイム仕様

- **Runtime**: `provided.al2` (Amazon Linux 2)
- **Handler**: `bootstrap` (Go カスタムランタイム)
- **Architecture**: x86_64
- **Memory**: 256MB (デフォルト)
- **Timeout**: 30 秒 (デフォルト)

---## 📁 ディレクトリ構造

```
backend/
├── cmd/                           # 実行可能なアプリケーションのエントリーポイント
│   └── api/                       # Lambda関数ごとのmain.goを格納
│       ├── hello/                 # Hello API（テスト用）
│       │   └── main.go           # エントリーポイント
│       └── create-event/          # イベント作成API
│           └── main.go           # エントリーポイント
├── internal/                      # 内部パッケージ（プロジェクト固有のロジック）
│   ├── domain/                   # ドメインモデル（Event, Userなど）
│   │   └── event.go             # イベントドメインモデル
│   ├── handler/                  # Lambdaのハンドラーロジック
│   │   └── event.go             # イベント関連のビジネスロジック
│   ├── repository/               # データストア（DynamoDB）とのやり取り
│   │   └── dynamodb.go          # DynamoDBリポジトリ実装
│   └── config/                   # 設定管理（将来用）
├── scripts/                      # ビルドスクリプト
│   └── build.sh                 # 汎用ビルドスクリプト
├── build/                        # ビルド成果物（自動生成）
│   └── bootstrap                # Goバイナリ（Lambda用）
├── *.zip                         # Lambda関数デプロイパッケージ（自動生成）
│   ├── hello-lambda.zip         # Hello API用
│   └── create-event-lambda.zip  # イベント作成API用
├── go.mod                        # Goモジュール定義
├── go.sum                        # 依存関係のチェックサム
├── Makefile                      # ビルドコマンド定義
└── README.md                     # このファイル
```

## 📦 Go 依存関係

### メイン依存関係（go.mod）

```go
module github.com/luck-tech/kanji-log/backend

go 1.25.0

require (
    github.com/aws/aws-lambda-go v1.47.0
    github.com/aws/aws-sdk-go-v2 v1.30.3
    github.com/aws/aws-sdk-go-v2/config v1.27.27
    github.com/aws/aws-sdk-go-v2/service/dynamodb v1.34.4
    github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.14.10
    github.com/google/uuid v1.6.0
)
```

### パッケージ構成

| パッケージ            | 説明                            | 主な機能                               |
| --------------------- | ------------------------------- | -------------------------------------- |
| `cmd/api/*`           | Lambda 関数のエントリーポイント | API Gateway 統合、認証、レスポンス処理 |
| `internal/domain`     | ドメインモデル                  | ビジネスオブジェクトの定義             |
| `internal/handler`    | ビジネスロジック層              | バリデーション、ビジネスルール         |
| `internal/repository` | データアクセス層                | DynamoDB 操作の抽象化                  |

---

## 🔧 ビルドシステム

### Makefile コマンド

| コマンド                        | 説明                     | 例                                    |
| ------------------------------- | ------------------------ | ------------------------------------- |
| `make help`                     | ヘルプ表示               | -                                     |
| `make build lambda=<name>`      | 指定 Lambda 関数をビルド | `make build lambda=create-event`      |
| `make deploy`                   | Terraform デプロイ       | -                                     |
| `make dev-deploy lambda=<name>` | ビルド+デプロイ一括実行  | `make dev-deploy lambda=create-event` |
| `make test-api`                 | API 動作確認             | -                                     |
| `make clean`                    | ビルド成果物削除         | -                                     |

### ビルドプロセス

1. **クロスコンパイル**: macOS/arm64 → Linux/x86_64
2. **バイナリ作成**: `build/bootstrap` として出力
3. **ZIP 作成**: `<function-name>-lambda.zip` として出力
4. **サイズ最適化**: `-ldflags="-s -w"` でバイナリサイズ削減

```bash
# ビルドコマンド例
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 \
go build -ldflags="-s -w" \
-o build/bootstrap cmd/api/create-event/main.go
```

---

## 🌐 API 仕様

### 認証方式

- **開発環境**: カスタムヘッダー `x-organizer-id: <user-id>`
- **本番環境**: Amazon Cognito JWT（将来実装）

### エンドポイント一覧

| エンドポイント | メソッド | 説明                     | 認証           |
| -------------- | -------- | ------------------------ | -------------- |
| `/hello`       | GET      | ヘルスチェック・動作確認 | 不要           |
| `/events`      | POST     | イベント作成             | 必要           |
| `/events/{id}` | GET      | イベント取得             | 必要（未実装） |
| `/events/{id}` | PUT      | イベント更新             | 必要（未実装） |
| `/events/{id}` | DELETE   | イベント削除             | 必要（未実装） |

### 現在の API Gateway 設定

- **ベース URL**: `https://sepimmk54m.execute-api.ap-northeast-1.amazonaws.com/dev`
- **CORS**: 有効（`*`での Origin 許可）
- **リクエスト検証**: 有効（JSON Schema 使用）
- **エラーハンドリング**: 統一された JSON 形式

---

## 📊 DynamoDB 仕様

### テーブル構成

```
テーブル名: kanji-log-events-dev
パーティションキー: id (String)
課金モード: PAY_PER_REQUEST
```

### イベントデータスキーマ

```go
type Event struct {
    ID               string    `json:"id" dynamodbav:"id"`
    Title           string    `json:"title" dynamodbav:"title"`
    Purpose         string    `json:"purpose" dynamodbav:"purpose"`
    Status          string    `json:"status" dynamodbav:"status"`
    Date            string    `json:"date" dynamodbav:"date"`
    Time            string    `json:"time" dynamodbav:"time"`
    OrganizerID     string    `json:"organizerId" dynamodbav:"organizerId"`
    Members         []string  `json:"members" dynamodbav:"members"`
    Notes           string    `json:"notes" dynamodbav:"notes"`
    HasScheduling   bool      `json:"hasScheduling" dynamodbav:"hasScheduling"`
    CreatedAt       time.Time `json:"createdAt" dynamodbav:"createdAt"`
    UpdatedAt       time.Time `json:"updatedAt" dynamodbav:"updatedAt"`
}
```

### インデックス設計

- **現在**: プライマリインデックスのみ
- **将来**: GSI (`organizerId`, `status`) 予定

---

## 🔍 監視・ログ

### CloudWatch Logs

```
ロググループ: /aws/lambda/kanji-log-<function-name>-dev
保持期間: 30日
```

### メトリクス監視（CloudWatch）

- Lambda 実行時間
- Lambda 呼び出し数
- Lambda エラー数
- DynamoDB 読み取り/書き込みユニット数

### パフォーマンス指標

- **Lambda 初期化時間**: ~100ms
- **Lambda 実行時間**: ~2-10ms
- **API 応答時間**: ~200ms
- **パッケージサイズ**: 3-5MB

---

## 🚀 デプロイメント

### 開発環境（dev）

- **AWS Region**: ap-northeast-1 (東京)
- **Lambda 関数名**: `kanji-log-<function-name>-dev`
- **DynamoDB テーブル名**: `kanji-log-events-dev`
- **API Gateway**: `kanji-log-api-dev`

### インフラ管理

- **IaC**: Terraform
- **状態管理**: S3 バックエンド + DynamoDB ロック
- **環境分離**: dev/prd 完全分離

---

## 📚 参考資料

- [AWS SDK for Go v2 API Reference](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2)
- [AWS Lambda Go Runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-golang.html)
- [Go Modules Reference](https://go.dev/ref/mod)
- [DynamoDB Data Types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html)

---

**最終更新**: 2025 年 9 月 5 日  
**更新理由**: 技術仕様書として再構成、開発指示は別ファイルに分離
