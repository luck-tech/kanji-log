package domain

import (
	"time"
)

// Event は飲み会イベントのドメインモデル
// 幹事が企画・管理する飲み会の基本情報を表現
type Event struct {
	// ID はイベントの一意識別子（DynamoDB パーティションキー）
	// 形式: "evt_" + ランダム文字列（例: evt_123456789）
	ID string `json:"id" dynamodbav:"id"`

	// Title はイベントのタイトル（必須項目）
	// 例: "新人歓迎会", "部署の送別会"
	Title string `json:"title" dynamodbav:"title"`

	// Purpose はイベントの目的・種類
	// 値: "welcome", "farewell", "year_end", "social", "other"
	Purpose string `json:"purpose" dynamodbav:"purpose"`

	// Status はイベントの進行状況
	// 値: "planning"（企画中）, "confirmed"（確定）, "completed"（完了）
	Status string `json:"status" dynamodbav:"status"`

	// Date は開催予定日（YYYY-MM-DD形式）
	// 未定の場合は空文字列
	Date string `json:"date" dynamodbav:"date"`

	// Time は開催時刻（HH:MM形式）
	// 未定の場合は空文字列
	Time string `json:"time" dynamodbav:"time"`

	// OrganizerID は幹事（イベント作成者）のユーザーID
	// Cognito から取得される sub（ユーザー識別子）
	OrganizerID string `json:"organizerId" dynamodbav:"organizerId"`

	// Members は参加メンバーのリスト
	// 初期状態では空配列、後でメンバー追加 API で設定
	Members []Member `json:"members" dynamodbav:"members"`

	// Notes は補足事項・備考
	// 幹事が自由に記載できるメモ
	Notes string `json:"notes" dynamodbav:"notes"`

	// HasScheduling は日程調整機能を使用するかどうか
	// true: 複数候補日で調整, false: 日程確定済み
	HasScheduling bool `json:"hasScheduling" dynamodbav:"hasScheduling"`

	// CreatedAt はイベント作成日時（ISO 8601形式）
	CreatedAt time.Time `json:"createdAt" dynamodbav:"createdAt"`

	// UpdatedAt は最終更新日時（ISO 8601形式）
	UpdatedAt time.Time `json:"updatedAt" dynamodbav:"updatedAt"`
}

// Member は参加メンバーの情報
// Webフォーム経由で収集されるメンバー情報を格納
type Member struct {
	// Name はメンバーの表示名
	// Webフォームで入力される名前
	Name string `json:"name"`

	// Email はメールアドレス（任意）
	// 通知機能で使用（将来拡張）
	Email string `json:"email,omitempty"`

	// Status は参加状況
	// 値: "pending"（未回答）, "attending"（参加）, "declined"（不参加）
	Status string `json:"status"`

	// Preferences は個人の好み情報
	// アレルギー、予算、料理の好みなどの情報
	Preferences map[string]interface{} `json:"preferences,omitempty"`

	// ResponseAt は回答日時
	ResponseAt *time.Time `json:"responseAt,omitempty"`
}

// CreateEventRequest はイベント作成時のリクエスト構造体
// API Gateway 経由で受け取る JSON データの形式を定義
type CreateEventRequest struct {
	// Title はイベントタイトル（必須）
	// バリデーション: 1文字以上100文字以下
	Title string `json:"title" validate:"required,min=1,max=100"`

	// Purpose はイベントの目的（任意、デフォルト: "other"）
	// 許可値: "welcome", "farewell", "year_end", "social", "other"
	Purpose string `json:"purpose,omitempty" validate:"omitempty,oneof=welcome farewell year_end social other"`

	// Date は開催予定日（任意、YYYY-MM-DD形式）
	// バリデーション: 日付形式チェック、過去日禁止
	Date string `json:"date,omitempty" validate:"omitempty,datetime=2006-01-02"`

	// Time は開催時刻（任意、HH:MM形式）
	// バリデーション: 時刻形式チェック
	Time string `json:"time,omitempty" validate:"omitempty,datetime=15:04"`

	// Notes は補足事項（任意）
	// バリデーション: 最大1000文字
	Notes string `json:"notes,omitempty" validate:"omitempty,max=1000"`

	// HasScheduling は日程調整機能使用フラグ（任意、デフォルト: false）
	HasScheduling bool `json:"hasScheduling,omitempty"`
}

// CreateEventResponse はイベント作成時のレスポンス構造体
// API クライアントに返却される JSON データの形式を定義
type CreateEventResponse struct {
	// Success は処理成功フラグ
	Success bool `json:"success"`

	// Data は作成されたイベントデータ
	// 作成成功時のみ設定される
	Data *Event `json:"data,omitempty"`

	// Error はエラー情報
	// 作成失敗時のみ設定される
	Error *ErrorInfo `json:"error,omitempty"`
}

// ErrorInfo はエラー詳細情報
type ErrorInfo struct {
	// Code はエラーコード
	// 例: "VALIDATION_ERROR", "INTERNAL_ERROR"
	Code string `json:"code"`

	// Message はエラーメッセージ
	// ユーザー向けの分かりやすいメッセージ
	Message string `json:"message"`

	// Details は詳細なエラー情報（任意）
	// デバッグ用の追加情報
	Details map[string]interface{} `json:"details,omitempty"`
}

// ValidEventPurposes は有効なイベント目的の一覧
// バリデーション処理で使用
var ValidEventPurposes = []string{
	"welcome",   // 歓迎会
	"farewell",  // 送別会
	"year_end",  // 年末年始
	"social",    // 懇親会
	"other",     // その他
}

// ValidEventStatuses は有効なイベントステータスの一覧
var ValidEventStatuses = []string{
	"planning",  // 企画中
	"confirmed", // 確定
	"completed", // 完了
}

// ValidMemberStatuses は有効なメンバーステータスの一覧
var ValidMemberStatuses = []string{
	"pending",   // 未回答
	"attending", // 参加
	"declined",  // 不参加
}
