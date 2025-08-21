import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: any;
  variant?: 'default' | 'gradient' | 'glass';
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  applySafeArea?: boolean;
}

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
}) => {
  const insets = useSafeAreaInsets();
  const hasIcons = leftIcon || rightIcon;

  const safeAreaStyle = applySafeArea ? { paddingTop: insets.top } : {};

  const headerContent = (
    <View
      style={[
        hasIcons ? styles.rowContainer : styles.centerContainer,
        styles.padding,
      ]}
    >
      {leftIcon && (
        <TouchableOpacity
          onPress={onLeftPress}
          style={
            variant === 'gradient'
              ? styles.gradientIconButton
              : styles.iconButton
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name={leftIcon as any}
            size={24}
            color={variant === 'gradient' ? Colors.white : Colors.neutral[700]}
          />
        </TouchableOpacity>
      )}

      <View
        style={
          hasIcons ? styles.titleContainerWithIcons : styles.titleContainer
        }
      >
        <Text
          style={variant === 'gradient' ? styles.gradientTitle : styles.title}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={
              variant === 'gradient' ? styles.gradientSubtitle : styles.subtitle
            }
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          style={
            variant === 'gradient'
              ? styles.gradientIconButton
              : styles.iconButton
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name={rightIcon as any}
            size={24}
            color={variant === 'gradient' ? Colors.white : Colors.neutral[700]}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, safeAreaStyle, style]}
      >
        {headerContent}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.header, styles[variant], safeAreaStyle, style]}>
      {headerContent}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerContainer: {
    alignItems: 'center',
  },
  padding: {
    paddingHorizontal: 24,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    marginHorizontal: 16,
  },
  gradientIconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleContainerWithIcons: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 4,
    fontWeight: '500',
  },
  gradientTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  gradientSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '500',
  },

  // Variants
  default: {
    backgroundColor: Colors.white,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
