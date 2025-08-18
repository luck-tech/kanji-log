import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'soft' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
  className?: string;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'medium',
  variant = 'default',
  className,
  animated = false,
}) => {
  // Padding classes with expanded options
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Shadow classes
  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large',
  };

  // Base classes with modern styling
  const baseClasses = 'rounded-2xl';

  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-neutral-200',
    elevated: 'bg-white',
    outline: 'bg-transparent border-2 border-neutral-300',
    glass: 'glass',
    gradient: '',
  };

  // Animation classes
  const animationClasses = animated ? 'animate-scale-in' : '';

  // Combine classes
  const cardClasses = [
    baseClasses,
    paddingClasses[padding],
    variant !== 'gradient' && variantClasses[variant],
    shadow !== 'none' && shadowClasses[shadow],
    animationClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={cardClasses}
        style={style}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View className={cardClasses} style={style}>
      {children}
    </View>
  );
};
