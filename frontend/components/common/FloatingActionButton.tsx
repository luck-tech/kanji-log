import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface FloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: any;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'primary' | 'gradient' | 'secondary';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  size = 'md',
  color,
  variant = 'gradient',
}) => {
  // Size configurations
  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const iconSize = iconSizes[size];

  // Default color based on variant
  const defaultColor =
    color || (variant === 'secondary' ? Colors.neutral[700] : Colors.white);

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
        style={[styles.container, styles[size], style]}
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, styles[size]]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={iconSize} color={defaultColor} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, styles[size], styles[variant], style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={iconSize} color={defaultColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  button: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 4,
  },

  // Sizes
  sm: {
    width: 48,
    height: 48,
  },
  md: {
    width: 64,
    height: 64,
  },
  lg: {
    width: 80,
    height: 80,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary[600],
  },
  secondary: {
    backgroundColor: Colors.neutral[100],
    borderWidth: 2,
    borderColor: Colors.neutral[200],
  },
});
