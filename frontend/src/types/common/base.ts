/**
 * 基本型定義
 * 全プロジェクトで共通利用される基本的な型定義
 */

// 応答状態
export type ResponseStatus = 'pending' | 'accepted' | 'declined' | 'maybe';

// イベントステータス
export type EventStatus = 'planning' | 'confirmed' | 'completed';

// イベント目的
export type EventPurpose =
  | 'welcome'
  | 'farewell'
  | 'celebration'
  | 'team_building'
  | 'casual'
  | 'other';

// 日程調整の回答
export type DateResponseType = 'available' | 'maybe' | 'unavailable';

// アルコール嗜好
export type AlcoholPreference = 'yes' | 'no' | 'sometimes';

// 性別
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// 通知設定
export interface NotificationSettings {
  eventUpdates: boolean;
  reminders: boolean;
  suggestions: boolean;
  follows: boolean;
}

// 予算範囲
export interface BudgetRange {
  min: number;
  max: number;
}
