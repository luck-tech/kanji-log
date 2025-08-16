import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  className,
  inputClassName,
  labelClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Container classes
  const containerClasses = [
    "mb-4",
    className
  ].filter(Boolean).join(" ");

  // Label classes  
  const labelClasses = [
    "text-base font-medium text-gray-700 mb-2",
    labelClassName
  ].filter(Boolean).join(" ");

  // Input container classes
  const inputContainerClasses = [
    "flex-row items-center border rounded-lg bg-white min-h-12",
    error 
      ? "border-red-500" 
      : isFocused 
        ? "border-blue-600" 
        : "border-gray-300"
  ].filter(Boolean).join(" ");

  // Input classes
  const inputClasses = [
    "flex-1 text-base text-gray-900 px-4 py-3",
    inputClassName
  ].filter(Boolean).join(" ");

  return (
    <View className={containerClasses} style={containerStyle}>
      {label && (
        <Text className={labelClasses} style={labelStyle}>
          {label}
        </Text>
      )}
      <View className={inputContainerClasses}>
        {leftIcon && <View className="pl-4">{leftIcon}</View>}
        <TextInput
          className={inputClasses}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {rightIcon && <View className="pr-4">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-2">
          {error}
        </Text>
      )}
    </View>
  );
};