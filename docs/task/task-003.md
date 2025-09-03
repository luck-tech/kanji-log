# Task-003: イベント作成 API 実装 (Backend + IaC)

**優先度**: 🟡 高  
**所要時間**: 1.5 日  
**担当**: バックエンド担当者

## 実行指示

### 必須作業標準

1. **詳細コメント**: AWS/Go 初心者でも理解できるよう、全コードに説明コメントを追加
2. **作業ログ記録**: `docs/log/task-003.md` に以下を詳細記録
   - 実行コマンド（再現可能な形で）
   - 発生したエラーと解決方法
   - 作成・修正したファイル一覧
   - 動作確認結果
   - 次タスクへの引き継ぎ事項
   - 学習ポイント・気づき

## 目的

最初のビジネスロジック（イベント作成）を実装

## 成果物

- [ ] イベント作成 Lambda 関数
- [ ] DynamoDB 操作コード
- [ ] API Gateway 設定更新
- [ ] ビジネスロジックの単体テストコード
- [ ] 入力値バリデーション

## 詳細作業

### 1. IaC 更新

- API Gateway `/events` POST エンドポイント追加
- 新しい Lambda 関数定義
- DynamoDB 操作権限追加

### 2. Go 実装 (`backend/cmd/api/create-event/main.go`)

- API Gateway Proxy イベント処理
- JSON 入力値バリデーション
- DynamoDB PutItem 操作
- エラーハンドリング

### 3. 内部パッケージ作成

```bash
mkdir -p backend/internal/{domain,repository,handler}
```

- `domain/event.go`: Event 構造体定義
- `repository/dynamodb.go`: DynamoDB 操作層
- `handler/event.go`: ビジネスロジック層

### 4. 単体テスト実装

- `testing`パッケージを利用し、`handler`層および`repository`層のロジックをテストする。

## 受け入れ条件

- [ ] POST `/events` でイベント作成可能
- [ ] DynamoDB にデータが正しく保存される
- [ ] バリデーションエラーが適切に返される
- [ ] レスポンス形式が API 仕様書と一致する

## 前のタスク

[Task-002: Hello World Lambda 実装](./task-002.md)

## 次のタスク

[Task-004: イベント取得 API 実装](./task-004.md)
