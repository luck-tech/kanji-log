import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: any;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, style, className }) => {
  return (
    <View className={`px-6 pt-4 pb-6 bg-white ${className || ''}`} style={style}>
      <Text className="text-2xl font-bold text-gray-900 mb-2">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-600">{subtitle}</Text>}
    </View>
  );
};
