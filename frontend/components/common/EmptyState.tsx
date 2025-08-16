import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  style?: any;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  style,
  className,
}) => {
  return (
    <View className={`flex-1 justify-center items-center py-8 ${className || ''}`} style={style}>
      <Ionicons name={icon} size={48} color="#9ca3af" />
      <Text className="text-lg font-semibold text-gray-600 mt-6 mb-3 text-center">
        {title}
      </Text>
      <Text className="text-sm text-gray-500 text-center leading-5">
        {description}
      </Text>
    </View>
  );
};
