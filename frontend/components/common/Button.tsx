import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
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
  className,
  hapticFeedback = true,
}) => {
  // Base Tailwind classes with modern styling
  const baseClasses = 'rounded-2xl flex-row items-center justify-center';

  // Size classes with improved proportions
  const sizeClasses = {
    sm: 'px-4 py-2.5 min-h-10',
    md: 'px-6 py-3.5 min-h-12',
    lg: 'px-8 py-4 min-h-14',
    xl: 'px-10 py-5 min-h-16',
  };

  // Enhanced variant classes
  const variantClasses = {
    primary: 'bg-primary-600 border-0',
    secondary: 'bg-neutral-100 border-0',
    outline: 'bg-transparent border-2 border-primary-600',
    ghost: 'bg-transparent border-0',
    gradient: 'border-0',
  };

  // Text color classes
  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-neutral-700',
    outline: 'text-primary-600',
    ghost: 'text-primary-600',
    gradient: 'text-white',
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // Active state styles
  const activeOpacity = disabled || loading ? 1 : 0.85;

  // Combine classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variant !== 'gradient' && variantClasses[variant],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = [
    'font-semibold tracking-wide',
    textSizeClasses[size],
    textColorClasses[variant],
    icon && title && 'ml-2',
  ]
    .filter(Boolean)
    .join(' ');

  const handlePress = () => {
    if (
      hapticFeedback &&
      typeof navigator !== 'undefined' &&
      navigator.vibrate
    ) {
      navigator.vibrate(10); // Light haptic feedback
    }
    onPress();
  };

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'gradient'
              ? '#ffffff'
              : '#0284c7'
          }
          style={icon || title ? { marginRight: 8 } : {}}
        />
      )}
      {icon && !loading && <View className={title ? 'mr-2' : ''}>{icon}</View>}
      {title && (
        <Text className={textClasses} style={textStyle}>
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={activeOpacity}
        style={style}
      >
        <LinearGradient
          colors={['#0ea5e9', '#0284c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={buttonClasses}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={buttonClasses}
      style={style}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};
