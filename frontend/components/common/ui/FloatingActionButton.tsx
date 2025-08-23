import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';
import { FloatingActionButtonProps } from '@/types/common/ui';

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  size = 'md',
  color,
  variant = 'gradient',
  testID,
}) => {
  // アイコン名のバリデーション関数
  const isValidIconName = (
    name: string
  ): name is keyof typeof Ionicons.glyphMap => {
    return name in Ionicons.glyphMap;
  };

  // Size configurations
  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const buttonSizes = {
    sm: 48,
    md: 64,
    lg: 80,
  };

  const iconColor = color || Colors.white;
  const buttonSize = buttonSizes[size];
  const iconSize = iconSizes[size];

  const handlePress = () => {
    // Add haptic feedback for mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    onPress();
  };

  // 無効なアイコン名の場合は何も表示しない
  if (!isValidIconName(icon)) {
    return null;
  }

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize },
          style,
        ]}
        activeOpacity={0.8}
        testID={testID}
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={[
            styles.gradient,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={iconSize} color={iconColor} />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          styles.secondaryButton,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          style,
        ]}
        activeOpacity={0.8}
        testID={testID}
      >
        <Ionicons name={icon} size={iconSize} color={Colors.neutral[600]} />
      </TouchableOpacity>
    );
  }

  // Primary variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        styles.primaryButton,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        style,
      ]}
      activeOpacity={0.8}
      testID={testID}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary[500],
    position: 'absolute',
    bottom: 96,
    right: 24,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    position: 'absolute',
    bottom: 96,
    right: 24,
  },
});
