/**
 * ビジネスラベル関連の定数
 * UI表示用のラベル、翻訳対応を想定した文字列管理
 */

// イベント目的のラベル
export const PURPOSE_LABELS: Record<string, string> = {
  celebration: 'お祝い',
  farewell: '送別会',
  welcome: '歓迎会',
  team_building: 'チームビルディング',
  casual: '親睦会',
  other: 'その他',
} as const;

// レストランジャンルのラベル
export const GENRE_LABELS: Record<string, string> = {
  japanese: '和食',
  italian: 'イタリアン',
  chinese: '中華',
  french: 'フレンチ',
  korean: '韓国料理',
  bar: '居酒屋',
  cafe: 'カフェ',
  other: 'その他',
} as const;

// エリアラベル（例）
export const AREA_LABELS: Record<string, string> = {
  tokyo_station: '東京駅周辺',
  shinjuku: '新宿',
  shibuya: '渋谷',
  ginza: '銀座',
  roppongi: '六本木',
  akasaka: '赤坂',
  marunouchi: '丸の内',
  other: 'その他',
} as const;

// ステータスラベル
export const STATUS_LABELS: Record<string, string> = {
  planning: '企画中',
  confirmed: '確定',
  completed: '完了',
  cancelled: 'キャンセル',
} as const;

// 応答ステータスラベル
export const RESPONSE_LABELS: Record<string, string> = {
  pending: '未回答',
  accepted: '参加',
  declined: '不参加',
  maybe: '未定',
} as const;
