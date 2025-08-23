import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/constants';

interface RecordRatingProps extends BaseComponentProps {
  rating: number;
  size?: number;
}

/**
 * レコード評価 - 星評価表示
 */
export const RecordRating: React.FC<RecordRatingProps> = ({
  rating,
  size = 14,
  style,
  testID,
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // 満点星
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={size} color={Colors.warning[500]} />
      );
    }

    // 半分星
    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={size}
          color={Colors.warning[500]}
        />
      );
    }

    // 空星
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color={Colors.neutral[300]}
        />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
