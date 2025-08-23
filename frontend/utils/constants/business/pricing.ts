/**
 * 価格・予算関連のビジネス定数
 */

// 価格プリセット設定
export const PRICE_PRESETS = {
  options: [0, 2000, 3000, 4000, 5000, 6000, 8000, 10000],
  ranges: {
    reasonable: {
      min: 0,
      max: 3000,
      label: 'リーズナブル',
      description: '~¥3,000',
    },
    standard: {
      min: 3000,
      max: 6000,
      label: 'スタンダード',
      description: '¥3,000~¥6,000',
    },
    premium: {
      min: 6000,
      max: 10000,
      label: 'プレミアム',
      description: '¥6,000~',
    },
  },
  defaults: {
    step: 500,
    minRange: 0,
    maxRange: 10000,
    currency: '¥',
  },
} as const;

// 価格フォーマット関数
export const formatPrice = (
  price: number,
  maxRange: number = 10000,
  currency: string = '¥'
) => {
  if (price === 0) return '下限なし';
  if (price >= maxRange) return '上限なし';
  return `${currency}${price.toLocaleString()}`;
};

// 価格範囲表示用フォーマット関数
export const formatPriceRange = (
  min: number,
  max: number,
  maxRange: number = 10000,
  currency: string = '¥'
) => {
  const minText = formatPrice(min, maxRange, currency);
  const maxText = formatPrice(max, maxRange, currency);

  if (min === 0 && max >= maxRange) return '制限なし';
  if (min === 0) return `${maxText}以下`;
  if (max >= maxRange) return `${minText}以上`;
  return `${minText} - ${maxText}`;
};

// 価格カテゴリ判定
export const getPriceCategory = (
  price: number
): keyof typeof PRICE_PRESETS.ranges => {
  if (price <= PRICE_PRESETS.ranges.reasonable.max) return 'reasonable';
  if (price <= PRICE_PRESETS.ranges.standard.max) return 'standard';
  return 'premium';
};
