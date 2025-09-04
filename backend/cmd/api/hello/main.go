package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// HelloResponse は、Hello API のレスポンス構造体です
// 
// 幹事ナビでの用途:
// - API 動作確認のためのテストエンドポイント
// - インフラ構築後の疎通確認
// - 将来的な API レスポンス形式の基盤
type HelloResponse struct {
	Success   bool   `json:"success"`   // API 実行成功フラグ
	Message   string `json:"message"`   // 返却メッセージ
	Timestamp string `json:"timestamp"` // レスポンス生成時刻（UTC）
}

// handler は、AWS Lambda の関数ハンドラーです
//
// AWS Lambda Go ランタイムでの動作:
// 1. API Gateway からのリクエストを events.APIGatewayProxyRequest として受信
// 2. ビジネスロジックを実行（今回は Hello メッセージ生成）
// 3. events.APIGatewayProxyResponse として HTTP レスポンスを返却
//
// 参考資料:
// - AWS Lambda Go Programming Model: https://docs.aws.amazon.com/lambda/latest/dg/golang-programming-model.html
// - API Gateway Lambda Proxy Integration: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-lambda-function-create.html
//
// 引数:
//   ctx: Lambda 実行コンテキスト（タイムアウト制御、キャンセル処理に使用）
//   request: API Gateway からのHTTPリクエスト情報（ヘッダー、クエリパラメータ、ボディ等）
//
// 戻り値:
//   events.APIGatewayProxyResponse: HTTP レスポンス（ステータスコード、ヘッダー、ボディ）
//   error: エラーが発生した場合のエラー情報
func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// ログ出力: CloudWatch Logs でリクエスト内容を確認可能
	// デバッグ時は request.Body, request.QueryStringParameters も確認推奨
	log.Printf("Received request: %s %s", request.HTTPMethod, request.Path)

	// レスポンスデータを構築
	// time.RFC3339: ISO 8601 形式のタイムスタンプ（例: "2025-09-04T12:34:56Z"）
	response := HelloResponse{
		Success:   true,
		Message:   "Hello from Kanji-Log!",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	// 構造体を JSON 文字列に変換
	// json.Marshal は []byte を返すため、string() でキャストが必要
	body, err := json.Marshal(response)
	if err != nil {
		// JSON 変換エラー時は 500 Internal Server Error を返却
		log.Printf("Failed to marshal response: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
			Body: `{"success": false, "message": "Internal server error"}`,
		}, nil
	}

	// HTTP レスポンスを構築して返却
	return events.APIGatewayProxyResponse{
		StatusCode: 200, // HTTP 200 OK
		Headers: map[string]string{
			"Content-Type": "application/json",
			// CORS ヘッダー: ブラウザからのクロスオリジンリクエストを許可
			// 注意: "*" は開発用設定。本番環境では特定ドメインに限定が必要
			// Task-011 で本番ドメイン（例: https://kanji-navi.app）に限定予定
			"Access-Control-Allow-Origin": "*",
			// プリフライトリクエスト対応（今後のPOST/PUT API で必要）
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		},
		Body: string(body),
	}, nil
}

// main は、Lambda 関数のエントリーポイントです
//
// AWS Lambda Go ランタイムでの動作:
// 1. lambda.Start() が Lambda ランタイムとの通信を開始
// 2. リクエストを受信するたびに handler 関数が呼び出される
// 3. 関数の実行が完了するまで待機し、レスポンスを返却
//
// 重要: 
// - main 関数は Lambda の初期化時に1回だけ実行される
// - 変数やDB接続の初期化はここで行う（今回は不要）
// - handler 関数はリクエストごとに実行される
func main() {
	// AWS Lambda Go SDK の起動
	// これにより、Lambda ランタイムがこの関数を呼び出し可能になる
	lambda.Start(handler)
}
