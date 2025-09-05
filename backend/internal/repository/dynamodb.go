package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"

	"github.com/luck-tech/kanji-log/backend/internal/domain"
)

// EventRepository はイベントデータの永続化を担当するインターフェース
// DynamoDB操作を抽象化し、テスト容易性を向上させる
type EventRepository interface {
	// CreateEvent は新しいイベントをDynamoDBに保存
	// 成功時は作成されたEventを返し、失敗時はエラーを返す
	CreateEvent(ctx context.Context, event *domain.Event) (*domain.Event, error)

	// GetEvent はIDでイベントを取得
	// 存在しない場合はnil, ErrorNotFoundを返す
	GetEvent(ctx context.Context, eventID string) (*domain.Event, error)

	// UpdateEvent は既存イベントを更新
	// 楽観的ロック（UpdatedAt比較）を使用して安全に更新
	UpdateEvent(ctx context.Context, event *domain.Event) (*domain.Event, error)

	// DeleteEvent は指定されたイベントを削除
	// ソフトデリート（削除フラグ）ではなく物理削除を実行
	DeleteEvent(ctx context.Context, eventID string) error

	// ListEventsByOrganizer は幹事IDでイベント一覧を取得
	// ページネーション対応、ステータスフィルタリング可能
	ListEventsByOrganizer(ctx context.Context, organizerID string, filters map[string]interface{}) ([]*domain.Event, error)
}

// DynamoDBEventRepository はDynamoDBを使用したEventRepositoryの実装
type DynamoDBEventRepository struct {
	// client はDynamoDB操作用のAWS SDKクライアント
	client *dynamodb.Client

	// tableName はイベントデータを格納するDynamoDBテーブル名
	// 環境別に分離される（例: kanji-log-events-dev）
	tableName string
}

// NewDynamoDBEventRepository は新しいDynamoDBEventRepositoryインスタンスを作成
func NewDynamoDBEventRepository(client *dynamodb.Client, tableName string) EventRepository {
	return &DynamoDBEventRepository{
		client:    client,
		tableName: tableName,
	}
}

// CreateEvent は新しいイベントをDynamoDBに保存
func (r *DynamoDBEventRepository) CreateEvent(ctx context.Context, event *domain.Event) (*domain.Event, error) {
	// 現在時刻を設定
	now := time.Now().UTC()
	event.CreatedAt = now
	event.UpdatedAt = now

	// 初期ステータスを設定（まだ企画中）
	if event.Status == "" {
		event.Status = "planning"
	}

	// メンバーリストが未初期化の場合は空配列で初期化
	if event.Members == nil {
		event.Members = []domain.Member{}
	}

	// デバッグログ: marshalする前のevent構造体を確認
	fmt.Printf("DEBUG: Event before marshalling: %+v\n", event)

	// Go構造体をDynamoDB AttributeValueに変換
	// DynamoDBはJSON形式ではなく独自のAttributeValue形式を使用
	item, err := attributevalue.MarshalMap(event)
	if err != nil {
		return nil, fmt.Errorf("イベントデータのマーシャリングに失敗: %w", err)
	}

	// デバッグログ: マーシャリング後のitem構造を確認
	fmt.Printf("DEBUG: Marshalled item: %+v\n", item)
	
	// id フィールドが実際に存在するかチェック
	if idAttr, exists := item["id"]; exists {
		fmt.Printf("DEBUG: ID attribute found: %+v\n", idAttr)
	} else {
		fmt.Printf("DEBUG: ERROR - ID attribute NOT found in marshalled item\n")
		return nil, fmt.Errorf("ID attribute not found after marshalling")
	}

	// DynamoDBにアイテムを挿入
	// PutItemは条件なし挿入（同じIDが存在する場合は上書き）
	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
		// 条件式：同じIDのアイテムが存在しない場合のみ挿入
		// 重複ID防止のための安全措置
		ConditionExpression: aws.String("attribute_not_exists(id)"),
	})

	if err != nil {
		// DynamoDB固有のエラーハンドリング
		var conditionalCheckFailedException *types.ConditionalCheckFailedException
		if errors.As(err, &conditionalCheckFailedException) {
			return nil, fmt.Errorf("同じIDのイベントが既に存在します: %s", event.ID)
		}
		return nil, fmt.Errorf("DynamoDBへのイベント保存に失敗: %w", err)
	}

	return event, nil
}

// GetEvent はIDでイベントを取得
func (r *DynamoDBEventRepository) GetEvent(ctx context.Context, eventID string) (*domain.Event, error) {
	// DynamoDBからアイテムを取得
	// パーティションキー（id）での高速アクセス
	result, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: eventID},
		},
	})

	if err != nil {
		return nil, fmt.Errorf("DynamoDBからのイベント取得に失敗: %w", err)
	}

	// アイテムが存在しない場合
	if result.Item == nil {
		return nil, fmt.Errorf("イベントが見つかりません: %s", eventID)
	}

	// DynamoDB AttributeValueをGo構造体に変換
	var event domain.Event
	err = attributevalue.UnmarshalMap(result.Item, &event)
	if err != nil {
		return nil, fmt.Errorf("イベントデータのアンマーシャリングに失敗: %w", err)
	}

	return &event, nil
}

// UpdateEvent は既存イベントを更新
func (r *DynamoDBEventRepository) UpdateEvent(ctx context.Context, event *domain.Event) (*domain.Event, error) {
	// 更新時刻を現在時刻に設定
	event.UpdatedAt = time.Now().UTC()

	// Go構造体をDynamoDB AttributeValueに変換
	item, err := attributevalue.MarshalMap(event)
	if err != nil {
		return nil, fmt.Errorf("イベントデータのマーシャリングに失敗: %w", err)
	}

	// DynamoDBのアイテムを更新
	// 楽観的ロック：UpdatedAtが期待値と一致する場合のみ更新
	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      item,
		// 条件式：アイテムが存在し、かつIDが一致する場合のみ更新
		ConditionExpression: aws.String("attribute_exists(id) AND id = :id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":id": &types.AttributeValueMemberS{Value: event.ID},
		},
	})

	if err != nil {
		var conditionalCheckFailedException *types.ConditionalCheckFailedException
		if errors.As(err, &conditionalCheckFailedException) {
			return nil, fmt.Errorf("イベントが存在しないか、並行更新が発生しました: %s", event.ID)
		}
		return nil, fmt.Errorf("DynamoDBでのイベント更新に失敗: %w", err)
	}

	return event, nil
}

// DeleteEvent は指定されたイベントを削除
func (r *DynamoDBEventRepository) DeleteEvent(ctx context.Context, eventID string) error {
	// DynamoDBからアイテムを物理削除
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: eventID},
		},
		// 条件式：削除対象のアイテムが実際に存在する場合のみ削除
		ConditionExpression: aws.String("attribute_exists(id)"),
	})

	if err != nil {
		var conditionalCheckFailedException *types.ConditionalCheckFailedException
		if errors.As(err, &conditionalCheckFailedException) {
			return fmt.Errorf("削除対象のイベントが見つかりません: %s", eventID)
		}
		return fmt.Errorf("DynamoDBでのイベント削除に失敗: %w", err)
	}

	return nil
}

// ListEventsByOrganizer は幹事IDでイベント一覧を取得
// 注意：現在の実装はScanベース（将来的にGSI使用を推奨）
func (r *DynamoDBEventRepository) ListEventsByOrganizer(ctx context.Context, organizerID string, filters map[string]interface{}) ([]*domain.Event, error) {
	// Scan操作でorganizerId条件でフィルタリング
	// 注意：Scanは全テーブルスキャンのため、大量データ時は性能問題あり
	// 将来的にはGSI（Global Secondary Index）を作成してQuery操作に変更推奨
	input := &dynamodb.ScanInput{
		TableName:        aws.String(r.tableName),
		FilterExpression: aws.String("organizerId = :organizerId"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":organizerId": &types.AttributeValueMemberS{Value: organizerID},
		},
	}

	// ステータスフィルターがある場合は条件を追加
	if status, exists := filters["status"]; exists {
		input.FilterExpression = aws.String("organizerId = :organizerId AND #status = :status")
		input.ExpressionAttributeNames = map[string]string{
			"#status": "status", // statusは予約語のため別名使用
		}
		input.ExpressionAttributeValues[":status"] = &types.AttributeValueMemberS{Value: status.(string)}
	}

	result, err := r.client.Scan(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("DynamoDBでのイベント一覧取得に失敗: %w", err)
	}

	// 結果をGo構造体の配列に変換
	events := make([]*domain.Event, 0, len(result.Items))
	for _, item := range result.Items {
		var event domain.Event
		err := attributevalue.UnmarshalMap(item, &event)
		if err != nil {
			// 個別のアイテム変換エラーはログに記録して継続
			// 全体処理を停止させない
			continue
		}
		events = append(events, &event)
	}

	return events, nil
}
