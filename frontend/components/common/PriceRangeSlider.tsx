import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onValueChange: (min: number, max: number) => void;
  step?: number;
  minRange?: number;
  maxRange?: number;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  onValueChange,
  step = 500,
  minRange = 0,
  maxRange = 10000,
}) => {
  const priceOptions = [0, 2000, 3000, 4000, 5000, 6000, 8000, 10000];

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
    <View style={styles.container}>
      <View style={styles.priceDisplay}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>最低価格</Text>
          <Text style={styles.priceValue}>¥{min.toLocaleString()}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>最高価格</Text>
          <Text style={styles.priceValue}>¥{max.toLocaleString()}</Text>
        </View>
      </View>

      {/* Min Price Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最低価格を選択</Text>
        <View style={styles.optionsContainer}>
          {priceOptions
            .filter((price) => price < max)
            .map((price) => (
              <TouchableOpacity
                key={`min-${price}`}
                onPress={() => handleMinChange(price)}
                style={[
                  styles.priceOption,
                  min === price ? styles.activeOption : styles.inactiveOption,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    min === price ? styles.activeText : styles.inactiveText,
                  ]}
                >
                  ¥{price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Max Price Selection */}
      <View>
        <Text style={styles.sectionTitle}>最高価格を選択</Text>
        <View style={styles.optionsContainer}>
          {priceOptions
            .filter((price) => price > min)
            .map((price) => (
              <TouchableOpacity
                key={`max-${price}`}
                onPress={() => handleMaxChange(price)}
                style={[
                  styles.priceOption,
                  max === price ? styles.activeOption : styles.inactiveOption,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    max === price ? styles.activeText : styles.inactiveText,
                  ]}
                >
                  {price === 10000 ? '¥10,000+' : `¥${price.toLocaleString()}`}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeOption: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  inactiveOption: {
    backgroundColor: Colors.gray[50],
    borderColor: Colors.gray[200],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.primary[700],
  },
  inactiveText: {
    color: Colors.gray[600],
  },
});
