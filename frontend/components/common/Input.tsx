import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  animated = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = useRef(
    new Animated.Value(props.value ? 1 : 0)
  ).current;
  const animatedBorderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (animated) {
      Animated.parallel([
        Animated.timing(animatedLabelPosition, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBorderColor, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (animated && !props.value) {
      Animated.timing(animatedLabelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if (animated) {
      Animated.timing(animatedBorderColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    props.onBlur?.({} as any);
  };

  // スタイル計算
  const getContainerStyle = () => {
    let borderColor: string = Colors.neutral[200];

    if (error) {
      borderColor = Colors.error[500];
    } else if (success) {
      borderColor = Colors.success[500];
    } else if (isFocused) {
      borderColor = Colors.primary[500];
    }

    return [
      styles.inputContainer,
      styles[variant],
      styles[`size_${size}`],
      { borderColor },
    ];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && !animated && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      <View style={styles.relative}>
        <View style={getContainerStyle()}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

          <TextInput
            style={[styles.input, styles[`textSize_${size}`], inputStyle]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={Colors.neutral[400]}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity style={styles.iconContainer}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Animated floating label */}
        {label && animated && (
          <Animated.View
            style={[
              styles.floatingLabel,
              {
                top: 16,
              },
            ]}
          >
            <View style={styles.floatingLabelBackground}>
              <Text
                style={[
                  styles.floatingLabelText,
                  error && styles.errorText,
                  success && styles.successText,
                  isFocused && styles.focusedText,
                  labelStyle,
                ]}
              >
                {label}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

      {success && !error && (
        <Text style={styles.successMessage}>入力が正常です</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  relative: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: Colors.neutral[900],
  },
  iconContainer: {
    paddingHorizontal: 12,
  },

  // Variants
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: Colors.neutral[200],
  },
  filled: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.transparent,
  },
  outlined: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.neutral[300],
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Sizes
  size_sm: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_md: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_lg: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },

  // Floating label
  floatingLabel: {
    position: 'absolute',
    left: 16,
    pointerEvents: 'none',
  },
  floatingLabelBackground: {
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  floatingLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  focusedText: {
    color: Colors.primary[600],
  },
  errorText: {
    color: Colors.error[600],
  },
  successText: {
    color: Colors.success[600],
  },

  // Messages
  errorMessage: {
    fontSize: 14,
    color: Colors.error[600],
    marginTop: 8,
    fontWeight: '500',
  },
  successMessage: {
    fontSize: 14,
    color: Colors.success[600],
    marginTop: 8,
    fontWeight: '500',
  },
});
