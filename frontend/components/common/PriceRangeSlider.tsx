import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
    <View className="py-4">
      <View className="flex-row justify-between mb-6">
        <View className="items-center">
          <Text className="text-sm text-neutral-500 mb-1">最低価格</Text>
          <Text className="text-lg font-bold text-neutral-900">
            ¥{min.toLocaleString()}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm text-neutral-500 mb-1">最高価格</Text>
          <Text className="text-lg font-bold text-neutral-900">
            ¥{max.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Min Price Selection */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-neutral-700 mb-2">
          最低価格を選択
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {priceOptions
            .filter((price) => price < max)
            .map((price) => (
              <TouchableOpacity
                key={`min-${price}`}
                onPress={() => handleMinChange(price)}
                className={`px-3 py-2 rounded-full border ${
                  min === price
                    ? 'bg-primary-100 border-primary-500'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-medium ${
                    min === price ? 'text-primary-700' : 'text-neutral-600'
                  }`}
                >
                  ¥{price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Max Price Selection */}
      <View>
        <Text className="text-sm font-medium text-neutral-700 mb-2">
          最高価格を選択
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {priceOptions
            .filter((price) => price > min)
            .map((price) => (
              <TouchableOpacity
                key={`max-${price}`}
                onPress={() => handleMaxChange(price)}
                className={`px-3 py-2 rounded-full border ${
                  max === price
                    ? 'bg-primary-100 border-primary-500'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-medium ${
                    max === price ? 'text-primary-700' : 'text-neutral-600'
                  }`}
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
