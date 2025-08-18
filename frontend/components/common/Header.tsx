import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: any;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  animated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  style,
  className,
  variant = 'default',
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  animated = true,
}) => {
  const hasIcons = leftIcon || rightIcon;
  const baseClasses = `py-6`;

  const variantClasses = {
    default: 'bg-white',
    gradient: '',
    glass: 'glass',
  };

  const headerContent = (
    <View
      className={
        hasIcons ? 'flex-row items-center justify-between' : 'items-center'
      }
    >
      {leftIcon && (
        <TouchableOpacity
          onPress={onLeftPress}
          className="p-2 rounded-xl bg-neutral-100 mr-4"
          activeOpacity={0.7}
        >
          <Ionicons name={leftIcon as any} size={24} color="#334155" />
        </TouchableOpacity>
      )}

      <View className={hasIcons ? 'flex-1 items-center' : 'items-center'}>
        <Text className="text-3xl font-bold text-neutral-900 tracking-tight">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-base text-neutral-600 mt-1 font-medium">
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          className="p-2 rounded-xl bg-neutral-100 ml-4"
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon as any} size={24} color="#334155" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${baseClasses} ${className || ''}`}
        style={style}
      >
        <View
          className={`${
            hasIcons ? 'flex-row items-center justify-between' : 'items-center'
          } px-6`}
        >
          {leftIcon && (
            <TouchableOpacity
              onPress={onLeftPress}
              className="p-2 rounded-xl bg-white/20 mr-4"
              activeOpacity={0.7}
            >
              <Ionicons name={leftIcon as any} size={24} color="#ffffff" />
            </TouchableOpacity>
          )}

          <View className={hasIcons ? 'flex-1 items-center' : 'items-center'}>
            <Text className="text-3xl font-bold text-white tracking-tight">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-base text-white/90 mt-1 font-medium">
                {subtitle}
              </Text>
            )}
          </View>

          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              className="p-2 rounded-xl bg-white/20 ml-4"
              activeOpacity={0.7}
            >
              <Ionicons name={rightIcon as any} size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      style={style}
    >
      {headerContent}
    </View>
  );
};
