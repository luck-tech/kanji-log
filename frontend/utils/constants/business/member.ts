import { Colors } from '../design/colors';

/**
 * Member機能関連のビジネス定数
 */

// アルコール嗜好の表示ラベル
export const ALCOHOL_PREFERENCE_LABELS = {
  yes: '飲める',
  no: '飲めない',
  sometimes: '時々飲む',
};

export const ALCOHOL_PREFERENCE_COLORS = {
  yes: Colors.green[500],
  no: Colors.error[500],
  sometimes: Colors.warning[500],
};

// 性別の表示ラベル
export const GENDER_LABELS = {
  male: '男性',
  female: '女性',
  other: 'その他',
  prefer_not_to_say: '回答しない',
};

// ジャンル選択肢
export const GENRE_OPTIONS = [
  '和食',
  'イタリアン',
  'フレンチ',
  '中華',
  'タイ料理',
  'インド料理',
  '焼肉',
  '居酒屋',
  'カフェ',
  'ファストフード',
  'その他',
];

// アレルギー選択肢
export const ALLERGY_OPTIONS = [
  '卵',
  '乳製品',
  '小麦',
  'そば',
  '落花生',
  'えび',
  'かに',
  '魚介類',
  'ナッツ類',
  '大豆',
  'その他',
];

// 食事制限選択肢
export const DIETARY_RESTRICTION_OPTIONS = [
  'ベジタリアン',
  'ヴィーガン',
  'ハラル',
  'コーシャ',
  '糖質制限',
  '塩分制限',
  'その他',
];

// 予算範囲のプリセット
export const BUDGET_PRESETS = [
  { min: 1000, max: 2000, label: '〜2,000円' },
  { min: 2000, max: 3000, label: '2,000〜3,000円' },
  { min: 3000, max: 4000, label: '3,000〜4,000円' },
  { min: 4000, max: 5000, label: '4,000〜5,000円' },
  { min: 5000, max: 8000, label: '5,000〜8,000円' },
  { min: 8000, max: 10000, label: '8,000〜10,000円' },
  { min: 10000, max: 15000, label: '10,000円以上' },
];

// メンバー招待時のデフォルト値
export const MEMBER_DEFAULTS = {
  department: '',
  notes: '',
  preferences: {
    allergies: [],
    favoriteGenres: [],
    budgetRange: { min: 3000, max: 5000 },
    alcoholPreference: 'sometimes' as const,
    dietaryRestrictions: [],
  },
};
