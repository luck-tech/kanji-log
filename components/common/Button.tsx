import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
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
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Layout.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = Layout.padding.md;
        baseStyle.paddingVertical = Layout.padding.xs;
        baseStyle.minHeight = 32;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = Layout.padding.xl;
        baseStyle.paddingVertical = Layout.padding.md;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = Layout.padding.lg;
        baseStyle.paddingVertical = Layout.padding.sm + 2;
        baseStyle.minHeight = 44;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = Colors.gray[100];
        baseStyle.borderColor = Colors.gray[200];
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = Colors.primary[600];
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = 'transparent';
        break;
      default:
        baseStyle.backgroundColor = Colors.primary[600];
        baseStyle.borderColor = Colors.primary[600];
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...Typography.button,
    };

    switch (variant) {
      case 'secondary':
        baseStyle.color = Colors.gray[700];
        break;
      case 'outline':
        baseStyle.color = Colors.primary[600];
        break;
      case 'ghost':
        baseStyle.color = Colors.primary[600];
        break;
      default:
        baseStyle.color = Colors.white;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary[600]}
          style={[{ marginRight: icon || title ? Layout.spacing.xs : 0 }]}
        />
      )}
      {icon && !loading && <>{icon}</>}
      {title && (
        <Text style={[getTextStyle(), textStyle, icon && { marginLeft: Layout.spacing.xs }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};