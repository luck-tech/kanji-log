import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout } from '@/constants';
import { BaseComponentProps } from '@/types';

interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
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
  testID,
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
        colors={[Colors.primary[50], Colors.primary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles}
      >
        <View testID={testID}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.white,
  },
  default: {
    backgroundColor: Colors.white,
  },
  elevated: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  gradient: {
    backgroundColor: 'transparent',
  },
  // Padding styles
  padding_sm: {
    padding: Layout.padding.sm,
  },
  padding_md: {
    padding: Layout.padding.md,
  },
  padding_lg: {
    padding: Layout.padding.lg,
  },
  padding_xl: {
    padding: Layout.padding.xl,
  },
  // Shadow styles
  shadow_none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  shadow_soft: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  shadow_medium: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  shadow_large: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
});
