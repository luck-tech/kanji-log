import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Layout } from './layout';

/**
 * 共通スタイルパターン定数
 * 頻繁に使用されるスタイルの組み合わせ
 */

export const CommonStyles = StyleSheet.create({
  // Flexbox パターン
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },

  // カード・コンテナスタイル
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.padding.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardSmall: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.padding.sm,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // ボタンスタイル
  primaryButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.secondary[100],
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[500],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 入力フィールドスタイル
  inputContainer: {
    marginVertical: Layout.spacing.xs,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  inputFieldFocused: {
    borderColor: Colors.primary[500],
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFieldError: {
    borderColor: Colors.error[500],
  },

  // テキストスタイル
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  bodyText: {
    fontSize: 16,
    color: Colors.neutral[700],
  },
  captionText: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  errorText: {
    fontSize: 14,
    color: Colors.error[500],
  },

  // 区切り線
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: Layout.spacing.sm,
  },
  dividerThick: {
    height: 8,
    backgroundColor: Colors.neutral[100],
    marginVertical: Layout.spacing.md,
  },

  // スペーシング
  marginTopSmall: {
    marginTop: Layout.spacing.sm,
  },
  marginTopMedium: {
    marginTop: Layout.spacing.md,
  },
  marginTopLarge: {
    marginTop: Layout.spacing.lg,
  },
  marginBottomSmall: {
    marginBottom: Layout.spacing.sm,
  },
  marginBottomMedium: {
    marginBottom: Layout.spacing.md,
  },
  marginBottomLarge: {
    marginBottom: Layout.spacing.lg,
  },

  // リストアイテム
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.padding.md,
    paddingHorizontal: Layout.padding.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  listItemLast: {
    borderBottomWidth: 0,
  },

  // バッジ・ラベル
  badge: {
    backgroundColor: Colors.primary[100],
    borderRadius: Layout.borderRadius.full,
    paddingVertical: Layout.padding.xs,
    paddingHorizontal: Layout.padding.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSuccess: {
    backgroundColor: Colors.success[100],
  },
  badgeWarning: {
    backgroundColor: Colors.warning[100],
  },
  badgeError: {
    backgroundColor: Colors.error[100],
  },
});

// よく使用されるスタイルの組み合わせ
export const StyleCombinations = {
  // セーフエリア対応のコンテナ
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // モーダルのオーバーレイ
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // モーダルのコンテンツ
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.padding.lg,
    minWidth: '80%',
    maxWidth: '90%',
  },
};

// DateTimePicker用の定数
export const DateTimePickerConstants = {
  // アニメーション設定
  animation: {
    fadeInDuration: 250,
    slideUpDuration: 300,
    fadeOutDuration: 200,
    slideDownDuration: 250,
    initialTranslateY: 300,
    finalTranslateY: 400,
  },

  // ピッカーホイール設定
  wheel: {
    itemHeight: 50,
    containerHeight: 250,
    minHeight: 300,
    padding: {
      top: 100, // itemHeight * 2
      bottom: 100, // itemHeight * 2
    },
  },

  // モーダル設定
  modal: {
    maxHeight: '75%',
    minHeight: 400,
    minButtonWidth: 80,
  },
} as const;
