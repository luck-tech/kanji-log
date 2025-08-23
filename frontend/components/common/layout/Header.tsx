import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../utils/constants/design/colors';
import { Layout } from '../../../utils/constants/design/layout';
import { HeaderProps } from '../../../types/common/ui';

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  style,
  variant = 'default',
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  applySafeArea = true,
  testID,
}) => {
  const insets = useSafeAreaInsets();
  const safeAreaStyle = applySafeArea ? { paddingTop: insets.top } : {};

  // アイコン名のバリデーション関数
  const isValidIconName = (
    name: string
  ): name is keyof typeof Ionicons.glyphMap => {
    return name in Ionicons.glyphMap;
  };

  const renderContent = () => (
    <>
      {/* Left action */}
      <View style={styles.leftSection}>
        {leftIcon && onLeftPress && isValidIconName(leftIcon) && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={leftIcon}
              size={24}
              color={
                variant === 'gradient' ? Colors.white : Colors.neutral[700]
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Title section */}
      <View style={styles.centerSection}>
        <Text
          style={[styles.title, variant === 'gradient' && styles.titleGradient]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              variant === 'gradient' && styles.subtitleGradient,
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right action */}
      <View style={styles.rightSection}>
        {rightIcon && onRightPress && isValidIconName(rightIcon) && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rightIcon}
              size={24}
              color={
                variant === 'gradient' ? Colors.white : Colors.neutral[700]
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={[styles.header, safeAreaStyle, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content} testID={testID}>
          {renderContent()}
        </View>
      </LinearGradient>
    );
  }

  if (variant === 'glass') {
    return (
      <View
        style={[styles.header, styles.glassHeader, safeAreaStyle, style]}
        testID={testID}
      >
        <View style={styles.content}>{renderContent()}</View>
      </View>
    );
  }

  // Default variant
  return (
    <View
      style={[styles.header, styles.defaultHeader, safeAreaStyle, style]}
      testID={testID}
    >
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: Layout.padding.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.padding.md,
    minHeight: 56,
  },
  defaultHeader: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  glassHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Layout.padding.sm,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.full,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    textAlign: 'center',
  },
  titleGradient: {
    color: Colors.white,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 2,
    textAlign: 'center',
  },
  subtitleGradient: {
    color: Colors.white,
    opacity: 0.9,
  },
});
