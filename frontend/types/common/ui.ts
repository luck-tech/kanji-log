import { ViewStyle, TextStyle } from 'react-native';

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
  icon?: string; // Ioniconsアイコン名
  badge?: number;
  color?: string; // TabBarで使用される色指定
}

// タブバリエーション
export type TabVariant = 'default' | 'pills' | 'segmented';

// ヘッダーバリエーション
export type HeaderVariant = 'default' | 'gradient' | 'glass';

// ヘッダーアクション
export interface HeaderAction {
  icon: keyof typeof import('@expo/vector-icons').Ionicons['glyphMap'];
  onPress: () => void;
}

// フィルタータイプ
export type FilterType = 'areas' | 'purposes' | 'genres' | 'price';

// コンポーネント間で共有される Props インターフェース

// Header コンポーネント Props
export interface HeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  variant?: HeaderVariant;
  leftIcon?: string; // アイコン名
  rightIcon?: string; // アイコン名
  onLeftPress?: () => void;
  onRightPress?: () => void;
  applySafeArea?: boolean;
}

// FloatingActionButton コンポーネント Props
export interface FloatingActionButtonProps extends BaseComponentProps {
  icon: string; // アイコン名
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'primary' | 'gradient' | 'secondary';
}

// EmptyState コンポーネント Props
export interface EmptyStateProps extends BaseComponentProps {
  icon: string; // アイコン名
  title: string;
  description: string;
}

// TabBar コンポーネント Props
export interface TabBarProps<T> extends BaseComponentProps {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  variant?: TabVariant;
  scrollable?: boolean;
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
