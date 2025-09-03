# Task-002: Hello World Lambda 実装 (Backend)

**優先度**: 🔴 最高  
**所要時間**: 0.5 日  
**担当**: バックエンド担当者

## 目的

Go 言語で Hello World Lambda 関数を実装し、デプロイパイプラインを確立

## 成果物

- [ ] Go Lambda 関数コード
- [ ] ビルドスクリプト
- [ ] 手動デプロイによる動作確認

## 詳細作業

### 1. Go プロジェクト初期化

```bash
mkdir -p backend/cmd/api/hello
cd backend && go mod init github.com/luck-tech/kanji-log/backend
```

### 2. Hello Lambda 実装 (`backend/cmd/api/hello/main.go`)

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

### 3. ビルドスクリプト作成 (`backend/scripts/build.sh`)

```bash
#!/bin/bash
GOOS=linux GOARCH=amd64 go build -o bootstrap cmd/api/hello/main.go
zip hello-lambda.zip bootstrap
```

### 4. ⚠️ セキュリティ注意

- レスポンスヘッダーの`Access-Control-Allow-Origin: "*"`は開発用です。後続タスク(Task-011)で本番ドメインに限定します。

## 受け入れ条件

- [ ] ローカルでコンパイル可能
- [ ] zip 化された Lambda パッケージが作成される
- [ ] AWS CLI 等を使い手動で Lambda 関数にデプロイ可能
- [ ] API Gateway 経由で JSON レスポンスが返される

## 前のタスク

[Task-001: 最小限のインフラ基盤構築](./task-001.md)

## 次のタスク

[Task-003: イベント作成 API 実装](./task-003.md)
