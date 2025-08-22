import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TextStyle,
  ViewStyle,
  Animated,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../../utils/constants/design/colors';
import { Layout } from '../../../utils/constants/design/layout';
import { BaseComponentProps } from '../../../types/common/ui';

interface InputProps extends Omit<TextInputProps, 'style'>, BaseComponentProps {
  label?: string;
  error?: string;
  success?: boolean;
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
  style,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  animated = false,
  testID,
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
    props.onFocus && props.onFocus({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (animated && !props.value) {
      Animated.parallel([
        Animated.timing(animatedLabelPosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBorderColor, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    props.onBlur && props.onBlur({} as any);
  };

  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [
      styles.container,
      styles[`container_${variant}`],
    ];

    if (error) {
      baseStyle.push(styles.containerError);
    } else if (success) {
      baseStyle.push(styles.containerSuccess);
    } else if (isFocused) {
      baseStyle.push(styles.containerFocused);
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle[] => {
    const styleArray: TextStyle[] = [
      styles.input,
      styles[`input_${size}`],
      styles[`input_${variant}`],
    ];

    if (inputStyle) {
      styleArray.push(inputStyle);
    }

    return styleArray;
  };

  const getLabelStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.label];

    if (labelStyle) {
      baseStyle.push(labelStyle);
    }

    if (error) {
      baseStyle.push(styles.labelError);
    } else if (success) {
      baseStyle.push(styles.labelSuccess);
    } else if (isFocused) {
      baseStyle.push(styles.labelFocused);
    }

    return baseStyle;
  };

  const animatedLabelStyleTop = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const animatedLabelStyleFontSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  return (
    <View style={[styles.wrapper, style]} testID={testID}>
      {label && !animated && <Text style={getLabelStyle()}>{label}</Text>}

      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={getInputStyle()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.neutral[400]}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}

        {label && animated && (
          <Animated.Text
            style={[
              styles.animatedLabel,
              {
                top: animatedLabelStyleTop,
                fontSize: animatedLabelStyleFontSize,
                color: error
                  ? Colors.error[500]
                  : success
                  ? Colors.success[500]
                  : isFocused
                  ? Colors.primary[500]
                  : Colors.neutral[500],
              },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Layout.spacing.xs,
  },
  container: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  container_default: {
    backgroundColor: Colors.white,
    borderColor: Colors.neutral[300],
  },
  container_filled: {
    backgroundColor: Colors.neutral[50],
    borderColor: 'transparent',
  },
  container_outlined: {
    backgroundColor: 'transparent',
    borderColor: Colors.neutral[300],
  },
  container_glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  containerFocused: {
    borderColor: Colors.primary[500],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerError: {
    borderColor: Colors.error[500],
  },
  containerSuccess: {
    borderColor: Colors.success[500],
  },
  input: {
    flex: 1,
    fontFamily: 'System',
    color: Colors.neutral[900],
  },
  input_sm: {
    fontSize: 14,
    paddingVertical: Layout.padding.xs,
    paddingHorizontal: Layout.padding.sm,
  },
  input_md: {
    fontSize: 16,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
  },
  input_lg: {
    fontSize: 18,
    paddingVertical: Layout.padding.md,
    paddingHorizontal: Layout.padding.lg,
  },
  input_default: {},
  input_filled: {},
  input_outlined: {},
  input_glass: {},
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: Layout.spacing.xs,
  },
  labelFocused: {
    color: Colors.primary[500],
  },
  labelError: {
    color: Colors.error[500],
  },
  labelSuccess: {
    color: Colors.success[500],
  },
  animatedLabel: {
    position: 'absolute',
    left: Layout.padding.md,
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    fontWeight: '500',
  },
  leftIcon: {
    marginLeft: Layout.padding.sm,
    marginRight: Layout.spacing.xs,
  },
  rightIcon: {
    marginRight: Layout.padding.sm,
    marginLeft: Layout.spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error[500],
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.padding.xs,
  },
});
