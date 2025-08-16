import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: any;
  size?: number;
  color?: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  size = 24,
  color = 'white',
  className,
}) => {
  return (
    <TouchableOpacity
      className={`absolute bottom-36 right-6 w-14 h-14 rounded-full bg-blue-600 justify-center items-center shadow-lg elevation-8 ${className || ''}`}
      style={style}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};
