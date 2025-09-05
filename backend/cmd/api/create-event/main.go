package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"

	"github.com/luck-tech/kanji-log/backend/internal/domain"
	"github.com/luck-tech/kanji-log/backend/internal/handler"
	"github.com/luck-tech/kanji-log/backend/internal/repository"
)

// Lambda関数の設定値
var (
	// TABLE_NAME はDynamoDBテーブル名（環境変数から取得）
	// 例: kanji-log-events-dev
	tableName string

	// eventHandler はイベント作成のビジネスロジック処理
	eventHandler *handler.EventHandler
)

// init はLambda関数起動時に一度だけ実行される初期化関数
// AWS SDK設定、DynamoDBクライアント初期化、依存関係注入を実行
func init() {
	// 環境変数からテーブル名を取得
	tableName = os.Getenv("TABLE_NAME")
	if tableName == "" {
		log.Fatal("環境変数 TABLE_NAME が設定されていません")
	}

	// AWS SDK v2の設定を読み込み
	// Lambda環境では自動的にIAMロールの認証情報が使用される
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("AWS設定の読み込みに失敗: %v", err)
	}

	// DynamoDBクライアントを初期化
	dynamoClient := dynamodb.NewFromConfig(cfg)

	// リポジトリ層とハンドラー層を初期化（依存関係注入）
	eventRepo := repository.NewDynamoDBEventRepository(dynamoClient, tableName)
	eventHandler = handler.NewEventHandler(eventRepo)

	log.Printf("Lambda関数が初期化されました - テーブル名: %s", tableName)
}

// handleRequest はAPI Gateway Proxy統合からのリクエストを処理
// HTTPリクエスト → ビジネスロジック実行 → HTTPレスポンス変換
func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// ログ出力：リクエスト詳細をCloudWatch Logsに記録
	log.Printf("イベント作成リクエスト受信 - Path: %s, Method: %s", request.Path, request.HTTPMethod)
	log.Printf("リクエストボディ: %s", request.Body)

	// HTTPメソッドの検証
	if request.HTTPMethod != "POST" {
		return createErrorResponse(400, "METHOD_NOT_ALLOWED", "POSTメソッドのみサポートされています", nil), nil
	}

	// 認証情報の取得と検証
	// API Gateway Cognitoオーソライザーで認証済みのユーザー情報を取得
	organizerID, err := extractOrganizerID(request)
	if err != nil {
		log.Printf("認証エラー: %v", err)
		return createErrorResponse(401, "UNAUTHORIZED", "認証が必要です", nil), nil
	}

	// リクエストボディをパース
	var createReq domain.CreateEventRequest
	if err := json.Unmarshal([]byte(request.Body), &createReq); err != nil {
		log.Printf("JSONパースエラー: %v", err)
		return createErrorResponse(400, "INVALID_JSON", "リクエストボディのJSON形式が正しくありません", map[string]interface{}{
			"parseError": err.Error(),
		}), nil
	}

	// ビジネスロジックを実行
	response, err := eventHandler.CreateEvent(ctx, &createReq, organizerID)
	if err != nil {
		log.Printf("イベント作成エラー: %v", err)
		return createErrorResponse(500, "INTERNAL_ERROR", "サーバー内部エラーが発生しました", nil), nil
	}

	// ビジネスロジックレベルでのエラー（バリデーションエラー等）
	if !response.Success {
		statusCode := 400 // バリデーションエラーは400
		if response.Error.Code == "INTERNAL_ERROR" {
			statusCode = 500
		}
		
		log.Printf("ビジネスロジックエラー: %s - %s", response.Error.Code, response.Error.Message)
		if response.Error.Details != nil {
			log.Printf("エラー詳細: %+v", response.Error.Details)
		}
		return createErrorResponse(statusCode, response.Error.Code, response.Error.Message, response.Error.Details), nil
	}

	// 成功レスポンスを生成
	responseBody, err := json.Marshal(response)
	if err != nil {
		log.Printf("レスポンスJSONマーシャリングエラー: %v", err)
		return createErrorResponse(500, "RESPONSE_ERROR", "レスポンスの生成に失敗しました", nil), nil
	}

	log.Printf("イベント作成成功 - ID: %s, Title: %s", response.Data.ID, response.Data.Title)

	// 成功時のHTTPレスポンス
	return events.APIGatewayProxyResponse{
		StatusCode: 201, // Created
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*", // CORS対応（開発用）
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(responseBody),
	}, nil
}

// extractOrganizerID はAPI Gatewayのリクエストコンテキストから認証されたユーザーIDを抽出
// Cognitoオーソライザーが設定された場合、requestContext.authorizer.claims.subに格納される
func extractOrganizerID(request events.APIGatewayProxyRequest) (string, error) {
	// 開発環境・テスト時用の簡易認証
	// 本番環境ではCognitoオーソライザーを使用するため、この部分は変更される
	if request.Headers["x-organizer-id"] != "" {
		return request.Headers["x-organizer-id"], nil
	}

	// Cognitoオーソライザー使用時の実装（将来）
	// authorizer := request.RequestContext.Authorizer
	// if claims, ok := authorizer["claims"].(map[string]interface{}); ok {
	//     if sub, ok := claims["sub"].(string); ok {
	//         return sub, nil
	//     }
	// }

	return "", fmt.Errorf("認証情報が見つかりません")
}

// createErrorResponse は統一されたエラーレスポンス形式を生成
func createErrorResponse(statusCode int, code string, message string, details map[string]interface{}) events.APIGatewayProxyResponse {
	errorResponse := map[string]interface{}{
		"success": false,
		"error": map[string]interface{}{
			"code":    code,
			"message": message,
		},
	}

	if details != nil {
		errorResponse["error"].(map[string]interface{})["details"] = details
	}

	responseBody, _ := json.Marshal(errorResponse)

	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*", // CORS対応（開発用）
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(responseBody),
	}
}

// main はLambda関数のエントリーポイント
// AWS Lambda Runtimeによって呼び出される
func main() {
	lambda.Start(handleRequest)
}

/*
動作確認用のサンプルリクエスト：

curl -X POST \
  https://your-api-id.execute-api.ap-northeast-1.amazonaws.com/dev/events \
  -H "Content-Type: application/json" \
  -H "x-organizer-id: test-user-123" \
  -d '{
    "title": "新人歓迎会",
    "purpose": "welcome",
    "date": "2024-03-15",
    "time": "19:00",
    "notes": "みんなで楽しく歓迎しましょう！",
    "hasScheduling": false
  }'

期待されるレスポンス：
{
  "success": true,
  "data": {
    "id": "evt_123456789abcdef...",
    "title": "新人歓迎会",
    "purpose": "welcome",
    "status": "planning",
    "date": "2024-03-15",
    "time": "19:00",
    "organizerId": "test-user-123",
    "members": [],
    "notes": "みんなで楽しく歓迎しましょう！",
    "hasScheduling": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
*/
