package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/luck-tech/kanji-log/backend/internal/domain"
	"github.com/luck-tech/kanji-log/backend/internal/repository"
)

// EventHandler はイベント関連のビジネスロジックを処理
// リクエストの検証、データ変換、リポジトリ操作を統括
type EventHandler struct {
	// eventRepo はイベントデータの永続化を担当
	eventRepo repository.EventRepository
}

// NewEventHandler は新しいEventHandlerインスタンスを作成
func NewEventHandler(eventRepo repository.EventRepository) *EventHandler {
	return &EventHandler{
		eventRepo: eventRepo,
	}
}

// CreateEvent はイベント作成のビジネスロジックを処理
// リクエスト検証 → ドメインオブジェクト生成 → 永続化 → レスポンス生成
func (h *EventHandler) CreateEvent(ctx context.Context, req *domain.CreateEventRequest, organizerID string) (*domain.CreateEventResponse, error) {
	// 1. 入力値バリデーション
	if err := h.validateCreateEventRequest(req); err != nil {
		return &domain.CreateEventResponse{
			Success: false,
			Error: &domain.ErrorInfo{
				Code:    "VALIDATION_ERROR",
				Message: err.Error(),
			},
		}, nil
	}

	// 2. 一意なイベントIDを生成
	// 形式: "evt_" + UUID（ハイフンなし）
	eventID := fmt.Sprintf("evt_%s", strings.ReplaceAll(uuid.New().String(), "-", ""))

	// 3. ドメインオブジェクトを構築
	event := &domain.Event{
		ID:            eventID,
		Title:         req.Title,
		Purpose:       h.getDefaultPurpose(req.Purpose),
		Status:        "planning", // 初期状態は常に企画中
		Date:          req.Date,
		Time:          req.Time,
		OrganizerID:   organizerID,
		Members:       []domain.Member{}, // 空配列で初期化
		Notes:         req.Notes,
		HasScheduling: req.HasScheduling,
		// CreatedAt, UpdatedAtはリポジトリ層で設定
	}

	// デバッグログ: 生成されたイベント構造体を出力
	fmt.Printf("DEBUG: Generated Event: ID=%s, Title=%s, OrganizerID=%s\n", 
		event.ID, event.Title, event.OrganizerID)

	// 4. データベースに保存
	createdEvent, err := h.eventRepo.CreateEvent(ctx, event)
	if err != nil {
		return &domain.CreateEventResponse{
			Success: false,
			Error: &domain.ErrorInfo{
				Code:    "INTERNAL_ERROR",
				Message: "イベントの作成に失敗しました",
				Details: map[string]interface{}{
					"reason": err.Error(),
				},
			},
		}, nil
	}

	// 5. 成功レスポンスを返却
	return &domain.CreateEventResponse{
		Success: true,
		Data:    createdEvent,
	}, nil
}

// validateCreateEventRequest はイベント作成リクエストのバリデーション
func (h *EventHandler) validateCreateEventRequest(req *domain.CreateEventRequest) error {
	// タイトルの必須チェック
	if strings.TrimSpace(req.Title) == "" {
		return fmt.Errorf("イベントタイトルは必須です")
	}

	// タイトルの長さチェック
	if len(req.Title) > 100 {
		return fmt.Errorf("イベントタイトルは100文字以内で入力してください")
	}

	// 目的の有効性チェック
	if req.Purpose != "" && !h.isValidPurpose(req.Purpose) {
		return fmt.Errorf("無効なイベント目的です: %s", req.Purpose)
	}

	// 日付形式チェック（YYYY-MM-DD）
	if req.Date != "" {
		if err := h.validateDateFormat(req.Date); err != nil {
			return fmt.Errorf("日付の形式が正しくありません: %w", err)
		}

		// 過去日チェック
		if err := h.validateNotPastDate(req.Date); err != nil {
			return fmt.Errorf("過去の日付は指定できません: %w", err)
		}
	}

	// 時刻形式チェック（HH:MM）
	if req.Time != "" {
		if err := h.validateTimeFormat(req.Time); err != nil {
			return fmt.Errorf("時刻の形式が正しくありません: %w", err)
		}
	}

	// 備考の長さチェック
	if len(req.Notes) > 1000 {
		return fmt.Errorf("備考は1000文字以内で入力してください")
	}

	return nil
}

// getDefaultPurpose は目的が未設定の場合にデフォルト値を返す
func (h *EventHandler) getDefaultPurpose(purpose string) string {
	if purpose == "" {
		return "other" // デフォルトは「その他」
	}
	return purpose
}

// isValidPurpose は指定された目的が有効かチェック
func (h *EventHandler) isValidPurpose(purpose string) bool {
	for _, validPurpose := range domain.ValidEventPurposes {
		if purpose == validPurpose {
			return true
		}
	}
	return false
}

// validateDateFormat は日付形式（YYYY-MM-DD）をチェック
func (h *EventHandler) validateDateFormat(date string) error {
	// 正規表現による形式チェック
	dateRegex := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)
	if !dateRegex.MatchString(date) {
		return fmt.Errorf("日付はYYYY-MM-DD形式で入力してください")
	}

	// time.Parseによる有効性チェック
	_, err := time.Parse("2006-01-02", date)
	if err != nil {
		return fmt.Errorf("無効な日付です: %s", date)
	}

	return nil
}

// validateNotPastDate は過去日でないことをチェック
func (h *EventHandler) validateNotPastDate(date string) error {
	inputDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		return err
	}

	// 今日の日付と比較（時刻は無視）
	today := time.Now().UTC().Truncate(24 * time.Hour)
	inputDateTruncated := inputDate.Truncate(24 * time.Hour)

	if inputDateTruncated.Before(today) {
		return fmt.Errorf("過去の日付は指定できません: %s", date)
	}

	return nil
}

// validateTimeFormat は時刻形式（HH:MM）をチェック
func (h *EventHandler) validateTimeFormat(timeStr string) error {
	// 正規表現による形式チェック
	timeRegex := regexp.MustCompile(`^\d{2}:\d{2}$`)
	if !timeRegex.MatchString(timeStr) {
		return fmt.Errorf("時刻はHH:MM形式で入力してください")
	}

	// time.Parseによる有効性チェック
	_, err := time.Parse("15:04", timeStr)
	if err != nil {
		return fmt.Errorf("無効な時刻です: %s", timeStr)
	}

	return nil
}

// GetEvent はイベント詳細取得のビジネスロジックを処理
func (h *EventHandler) GetEvent(ctx context.Context, eventID string, organizerID string) (*domain.Event, error) {
	// 1. イベントIDの形式チェック
	if !h.isValidEventID(eventID) {
		return nil, fmt.Errorf("無効なイベントIDです: %s", eventID)
	}

	// 2. データベースからイベントを取得
	event, err := h.eventRepo.GetEvent(ctx, eventID)
	if err != nil {
		return nil, fmt.Errorf("イベントの取得に失敗しました: %w", err)
	}

	// 3. 権限チェック：イベントの作成者のみアクセス可能
	if event.OrganizerID != organizerID {
		return nil, fmt.Errorf("このイベントにアクセスする権限がありません")
	}

	return event, nil
}

// isValidEventID はイベントIDの形式をチェック
// 期待形式: "evt_" + 32文字の英数字
func (h *EventHandler) isValidEventID(eventID string) bool {
	eventIDRegex := regexp.MustCompile(`^evt_[a-f0-9]{32}$`)
	return eventIDRegex.MatchString(eventID)
}

// ListEventsByOrganizer は幹事のイベント一覧取得ビジネスロジック
func (h *EventHandler) ListEventsByOrganizer(ctx context.Context, organizerID string, filters map[string]interface{}) ([]*domain.Event, error) {
	// フィルター条件の検証
	if status, exists := filters["status"]; exists {
		if !h.isValidStatus(status.(string)) {
			return nil, fmt.Errorf("無効なステータスです: %s", status)
		}
	}

	// データベースから一覧を取得
	events, err := h.eventRepo.ListEventsByOrganizer(ctx, organizerID, filters)
	if err != nil {
		return nil, fmt.Errorf("イベント一覧の取得に失敗しました: %w", err)
	}

	return events, nil
}

// isValidStatus はステータスの有効性をチェック
func (h *EventHandler) isValidStatus(status string) bool {
	for _, validStatus := range domain.ValidEventStatuses {
		if status == validStatus {
			return true
		}
	}
	return false
}

// EventHandlerから利用するヘルパー関数群

// ParseJSONBody はHTTPリクエストボディをJSONパース
func ParseJSONBody(body string, target interface{}) error {
	if body == "" {
		return fmt.Errorf("リクエストボディが空です")
	}

	if err := json.Unmarshal([]byte(body), target); err != nil {
		return fmt.Errorf("JSONの解析に失敗しました: %w", err)
	}

	return nil
}

// CreateSuccessResponse は成功レスポンスのJSONを生成
func CreateSuccessResponse(data interface{}) (string, error) {
	response := map[string]interface{}{
		"success": true,
		"data":    data,
	}

	responseJSON, err := json.Marshal(response)
	if err != nil {
		return "", fmt.Errorf("レスポンスJSONの生成に失敗しました: %w", err)
	}

	return string(responseJSON), nil
}

// CreateErrorResponse はエラーレスポンスのJSONを生成
func CreateErrorResponse(code string, message string, details map[string]interface{}) (string, error) {
	response := map[string]interface{}{
		"success": false,
		"error": map[string]interface{}{
			"code":    code,
			"message": message,
		},
	}

	if details != nil {
		response["error"].(map[string]interface{})["details"] = details
	}

	responseJSON, err := json.Marshal(response)
	if err != nil {
		return "", fmt.Errorf("エラーレスポンスJSONの生成に失敗しました: %w", err)
	}

	return string(responseJSON), nil
}
