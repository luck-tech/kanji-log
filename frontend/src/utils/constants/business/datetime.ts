/**
 * 日付・時間関連のビジネス定数
 */

export const DATE_TIME_DEFAULTS = {
  minimumDate: new Date(1900, 0, 1),
  maximumDate: new Date(2100, 11, 31),

  titles: {
    date: '日付を選択',
    time: '時間を選択',
  },

  labels: {
    cancel: 'キャンセル',
    confirm: '決定',
    year: '年',
    month: '月',
    day: '日',
    separator: ':',
  },

  // 時間選択設定
  time: {
    minuteInterval: 5,
    maxHours: 24,
  },
} as const;

// 月の配列生成用ヘルパー
export const generateMonths = () => Array.from({ length: 12 }, (_, i) => i);

// 時間の配列生成用ヘルパー
export const generateHours = () => Array.from({ length: 24 }, (_, i) => i);

// 分の配列生成用ヘルパー（5分間隔）
export const generateMinutes = (interval: number = 5) =>
  Array.from({ length: 60 / interval }, (_, i) => i * interval);

// 指定年月の日数を取得
export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

// 年の配列生成用ヘルパー
export const generateYears = (minDate: Date, maxDate: Date) =>
  Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i
  );
