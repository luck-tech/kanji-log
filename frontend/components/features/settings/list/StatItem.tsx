import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatItemProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  variant,
  style,
  testID,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: Colors.primary[100],
          numberColor: Colors.primary[700],
        };
      case 'success':
        return {
          backgroundColor: Colors.success[100],
          numberColor: Colors.success[700],
        };
      case 'accent':
        return {
          backgroundColor: Colors.accent[100],
          numberColor: Colors.accent[700],
        };
      default:
        return {
          backgroundColor: Colors.neutral[100],
          numberColor: Colors.neutral[700],
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: variantStyles.backgroundColor },
        ]}
      >
        <Text style={[styles.number, { color: variantStyles.numberColor }]}>
          {value}
        </Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    color: Colors.neutral[600],
    fontWeight: '500',
    textAlign: 'center',
  },
});
