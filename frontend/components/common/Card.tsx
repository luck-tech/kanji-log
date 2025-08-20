import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'soft' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'medium',
  variant = 'default',
}) => {
  // スタイルを計算
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`padding_${padding}`],
    styles[`shadow_${shadow}`],
    style,
  ];

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[Colors.neutral[50], Colors.neutral[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles[`padding_${padding}`], style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
  },
  default: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  elevated: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    borderRadius: 16,
  },
  padding_sm: {
    padding: 12,
  },
  padding_md: {
    padding: 20,
  },
  padding_lg: {
    padding: 24,
  },
  padding_xl: {
    padding: 32,
  },
  shadow_none: {},
  shadow_soft: {
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  shadow_medium: {
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shadow_large: {
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});
