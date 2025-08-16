import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
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
}) => {
  // Base Tailwind classes
  const baseClasses = "rounded-lg flex-row items-center justify-center border";
  
  // Size classes
  const sizeClasses = {
    sm: "px-4 py-1 min-h-8",
    md: "px-6 py-3 min-h-11", 
    lg: "px-8 py-4 min-h-14"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 border-blue-600",
    secondary: "bg-gray-100 border-gray-200",
    outline: "bg-transparent border-blue-600",
    ghost: "bg-transparent border-transparent"
  };
  
  // Text color classes
  const textColorClasses = {
    primary: "text-white",
    secondary: "text-gray-700",
    outline: "text-blue-600",
    ghost: "text-blue-600"
  };
  
  // Combine classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    (disabled || loading) && "opacity-60",
    className
  ].filter(Boolean).join(" ");
  
  const textClasses = [
    "font-medium text-base",
    textColorClasses[variant],
    icon && "ml-2"
  ].filter(Boolean).join(" ");

  return (
    <TouchableOpacity
      className={buttonClasses}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : '#3b82f6'}
          className={icon || title ? "mr-2" : ""}
        />
      )}
      {icon && !loading && icon}
      {title && (
        <Text
          className={textClasses}
          style={textStyle}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
