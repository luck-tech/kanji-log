import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/utils/constants/design/colors';
import { Layout } from '@/utils/constants/design/layout';
import { PRICE_PRESETS, formatPrice } from '@/utils/constants/business/pricing';
import { BaseComponentProps } from '@/types/common/ui';

interface PriceRangeSliderProps extends BaseComponentProps {
  min: number;
  max: number;
  onValueChange: (min: number, max: number) => void;
  maxRange?: number;
  currency?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  onValueChange,
  maxRange = PRICE_PRESETS.defaults.maxRange,
  currency = PRICE_PRESETS.defaults.currency,
  style,
  testID,
}) => {
  const priceOptions = PRICE_PRESETS.options;

  const handleMinChange = (newMin: number) => {
    if (newMin < max) {
      onValueChange(newMin, max);
    }
  };

  const handleMaxChange = (newMax: number) => {
    if (newMax > min) {
      onValueChange(min, newMax);
    }
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>価格帯</Text>
        <Text style={styles.range}>
          {formatPrice(min, maxRange, currency)} -{' '}
          {formatPrice(max, maxRange, currency)}
        </Text>
      </View>

      {/* Min Price Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最低価格</Text>
        <View style={styles.optionsContainer}>
          {priceOptions.map((price) => (
            <TouchableOpacity
              key={`min-${price}`}
              style={[styles.option, min === price && styles.selectedOption]}
              onPress={() => handleMinChange(price)}
            >
              <Text
                style={[
                  styles.optionText,
                  min === price && styles.selectedOptionText,
                ]}
              >
                {formatPrice(price, maxRange, currency)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Max Price Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最高価格</Text>
        <View style={styles.optionsContainer}>
          {priceOptions.map((price) => (
            <TouchableOpacity
              key={`max-${price}`}
              style={[styles.option, max === price && styles.selectedOption]}
              onPress={() => handleMaxChange(price)}
            >
              <Text
                style={[
                  styles.optionText,
                  max === price && styles.selectedOptionText,
                ]}
              >
                {formatPrice(price, maxRange, currency)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>プリセット</Text>
        <View style={styles.presetsContainer}>
          <TouchableOpacity
            style={styles.preset}
            onPress={() => onValueChange(0, 3000)}
          >
            <Text style={styles.presetText}>リーズナブル</Text>
            <Text style={styles.presetRange}>~¥3,000</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preset}
            onPress={() => onValueChange(3000, 6000)}
          >
            <Text style={styles.presetText}>スタンダード</Text>
            <Text style={styles.presetRange}>¥3,000~¥6,000</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preset}
            onPress={() => onValueChange(6000, 10000)}
          >
            <Text style={styles.presetText}>プレミアム</Text>
            <Text style={styles.presetRange}>¥6,000~</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: Layout.padding.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  range: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: Layout.spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  option: {
    paddingVertical: Layout.padding.xs,
    paddingHorizontal: Layout.padding.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.white,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionText: {
    fontSize: 12,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  selectedOptionText: {
    color: Colors.white,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  preset: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 2,
  },
  presetRange: {
    fontSize: 10,
    color: Colors.neutral[500],
  },
});
