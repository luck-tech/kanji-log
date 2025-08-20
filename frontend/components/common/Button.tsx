import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
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
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onPress();
  };

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    textStyle,
  ];

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'gradient' ? Colors.white : Colors.primary[600]}
          style={icon || title ? { marginRight: 8 } : {}}
        />
      )}
      {icon && !loading && (
        <View style={title ? { marginRight: 8 } : {}}>
          {icon}
        </View>
      )}
      {title && (
        <Text style={textStyles}>
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[styles.base, fullWidth && styles.fullWidth, style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={disabled || loading ? 1 : 0.85}
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles[`size_${size}`]]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.85}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary[600],
  },
  secondary: {
    backgroundColor: Colors.neutral[100],
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.primary[600],
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  gradient: {
    backgroundColor: Colors.transparent,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  size_sm: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  size_md: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
  },
  size_lg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  size_xl: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    minHeight: 64,
  },
  
  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: Colors.white,
  },
  text_secondary: {
    color: Colors.neutral[700],
  },
  text_outline: {
    color: Colors.primary[600],
  },
  text_ghost: {
    color: Colors.primary[600],
  },
  text_gradient: {
    color: Colors.white,
  },
  
  // Text sizes
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  textSize_xl: {
    fontSize: 20,
  },
});
