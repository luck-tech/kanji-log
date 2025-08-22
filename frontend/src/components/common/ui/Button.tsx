import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout } from '@/constants';
import { BaseComponentProps } from '@/types';
import { usePressAnimation } from './Animations';

interface ButtonProps extends BaseComponentProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
  hapticFeedback = true,
  testID,
}) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.95);

  const handlePress = () => {
    if (
      hapticFeedback &&
      typeof navigator !== 'undefined' &&
      navigator.vibrate
    ) {
      navigator.vibrate(50);
    }
    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Layout.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...(fullWidth && { width: '100%' }),
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingVertical: Layout.padding.xs,
        paddingHorizontal: Layout.padding.sm,
        minHeight: 32,
      },
      md: {
        paddingVertical: Layout.padding.sm,
        paddingHorizontal: Layout.padding.md,
        minHeight: 40,
      },
      lg: {
        paddingVertical: Layout.padding.md,
        paddingHorizontal: Layout.padding.lg,
        minHeight: 48,
      },
      xl: {
        paddingVertical: Layout.padding.lg,
        paddingHorizontal: Layout.padding.xl,
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: Colors.primary[500],
      },
      secondary: {
        backgroundColor: Colors.secondary[100],
        borderWidth: 1,
        borderColor: Colors.secondary[300],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      gradient: {
        // Gradient will be handled by LinearGradient component
      },
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: Colors.neutral[200],
        borderColor: Colors.neutral[300],
      };
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseSizeStyles: Record<string, TextStyle> = {
      sm: { fontSize: 14, fontWeight: '500' },
      md: { fontSize: 16, fontWeight: '600' },
      lg: { fontSize: 18, fontWeight: '600' },
      xl: { fontSize: 20, fontWeight: '700' },
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: Colors.white },
      secondary: { color: Colors.neutral[700] },
      outline: { color: Colors.primary[500] },
      ghost: { color: Colors.primary[500] },
      gradient: { color: Colors.white },
    };

    if (disabled) {
      return {
        ...baseSizeStyles[size],
        color: Colors.neutral[400],
      };
    }

    return {
      ...baseSizeStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const buttonStyle = getButtonStyle();
  const finalTextStyle = [getTextStyle(), textStyle];

  if (variant === 'gradient') {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled || loading}
          testID={testID}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary[400], Colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={buttonStyle}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <View style={styles.content}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                {title && <Text style={finalTextStyle}>{title}</Text>}
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        testID={testID}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.white : Colors.primary[500]}
          />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            {title && <Text style={finalTextStyle}>{title}</Text>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});
