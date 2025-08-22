import { ViewStyle, TextStyle } from 'react-native';
import { BudgetRange } from './base';

/**
 * UI共通Props型定義
 * コンポーネントで共通利用されるProps型
 */

// 基本コンポーネントProps
export interface BaseComponentProps {
  testID?: string;
  style?: ViewStyle;
}

// テキストコンポーネントProps
export interface BaseTextProps {
  testID?: string;
  style?: TextStyle;
}

// モーダル共通Props
export interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  testID?: string;
}

// タブアイテム
export interface TabItem<T = string> {
  key: T;
  label: string;
  icon?: string;
  badge?: number;
}

// アニメーション共通Props
export interface BaseAnimationProps extends BaseComponentProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

// フェードインアニメーション
export interface FadeInViewProps extends BaseAnimationProps {
  initialOpacity?: number;
  finalOpacity?: number;
}

// スライドインアニメーション
export interface SlideInViewProps extends BaseAnimationProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

// スケールインアニメーション
export interface ScaleInViewProps extends BaseAnimationProps {
  initialScale?: number;
  finalScale?: number;
}

// パルスアニメーション
export interface PulseViewProps extends BaseAnimationProps {
  minScale?: number;
  maxScale?: number;
}

// シェイクアニメーション
export interface ShakeViewProps extends BaseAnimationProps {
  intensity?: number;
  direction?: 'horizontal' | 'vertical';
}

// スタッガードリストアニメーション
export interface StaggeredListProps extends BaseAnimationProps {
  itemDelay?: number;
  direction?: 'up' | 'down';
}

// フィルターオプション
export interface FilterOptions {
  areas: string[];
  purposes: string[];
  genres: string[];
  priceRange: BudgetRange;
}

// エラー情報
export interface ErrorInfo {
  message: string;
  field?: string;
  code?: string;
}

// 読み込み状態
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// ページネーション
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
