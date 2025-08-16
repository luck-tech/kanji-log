import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = true,
  className,
}) => {
  // Padding classes
  const paddingClasses = {
    sm: "p-3",
    md: "p-4", 
    lg: "p-6"
  };
  
  // Combine classes
  const cardClasses = [
    "bg-white rounded-lg border border-gray-100",
    paddingClasses[padding],
    shadow && "shadow-md elevation-5",
    className
  ].filter(Boolean).join(" ");

  return (
    <View
      className={cardClasses}
      style={style}
    >
      {children}
    </View>
  );
};