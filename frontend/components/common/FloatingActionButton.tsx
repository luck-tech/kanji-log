import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: any;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  variant?: 'primary' | 'gradient' | 'secondary';
  animated?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  size = 'md',
  color,
  className,
  variant = 'gradient',
  animated = true,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-12 h-12',
      iconSize: 20,
    },
    md: {
      container: 'w-16 h-16',
      iconSize: 24,
    },
    lg: {
      container: 'w-20 h-20',
      iconSize: 28,
    },
  };

  const { container, iconSize } = sizeConfig[size];

  // Default color based on variant
  const defaultColor =
    color || (variant === 'secondary' ? '#334155' : '#ffffff');

  // Base classes
  const baseClasses = `absolute bottom-24 right-6 ${container} rounded-3xl justify-center items-center shadow-large ${
    animated ? 'animate-scale-in' : ''
  }`;

  const handlePress = () => {
    // Add haptic feedback for mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    onPress();
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={style}
        className={className}
      >
        <LinearGradient
          colors={['#0ea5e9', '#0284c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={baseClasses}
        >
          <View className="p-1">
            <Ionicons name={icon} size={iconSize} color={defaultColor} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-neutral-100 border-2 border-neutral-200',
    gradient: '', // handled above
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      style={style}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View className="p-1">
        <Ionicons name={icon} size={iconSize} color={defaultColor} />
      </View>
    </TouchableOpacity>
  );
};
