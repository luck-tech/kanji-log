import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { RestaurantSuggestion } from '@/types/features/event';
import { Colors } from '@/utils/constants/design/colors';

interface RestaurantCardProps extends BaseComponentProps {
  restaurant: RestaurantSuggestion;
  isSelected: boolean;
  onPress: (restaurant: RestaurantSuggestion) => void;
}

/**
 * レストラン表示カード - レストラン情報、選択状態、推薦理由を表示する複合コンポーネント
 */
export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSelected,
  onPress,
  style,
  testID,
}) => {
  const getRecommendationTypeLabel = (type: string) => {
    const typeMap = {
      majority: '多数派満足型',
      inclusive: '全員配慮型',
      challenge: 'チャレンジ型',
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getRecommendationTypeColors = (type: string) => {
    const colorMap = {
      majority: { bg: Colors.primary[100], text: Colors.primary[700] },
      inclusive: { bg: Colors.success[100], text: Colors.success[700] },
      challenge: { bg: Colors.secondary[100], text: Colors.secondary[700] },
    };
    return (
      colorMap[type as keyof typeof colorMap] || {
        bg: Colors.neutral[100],
        text: Colors.neutral[700],
      }
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#f59e0b" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#f59e0b" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#d1d5db"
        />
      );
    }

    return <View style={styles.starContainer}>{stars}</View>;
  };

  const typeColors = getRecommendationTypeColors(restaurant.recommendationType);

  return (
    <TouchableOpacity
      onPress={() => onPress(restaurant)}
      activeOpacity={0.8}
      style={style}
      testID={testID}
    >
      <Card
        variant="elevated"
        shadow="none"
        style={isSelected ? styles.selectedCard : styles.card}
      >
        <View style={styles.restaurantContent}>
          {/* レストランヘッダー */}
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantInfo}>
              <View style={styles.nameRow}>
                <Text
                  style={[
                    styles.restaurantName,
                    isSelected && styles.selectedRestaurantName,
                  ]}
                >
                  {restaurant.name}
                </Text>
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>

              <View style={styles.ratingRow}>
                {restaurant.rating && renderStars(restaurant.rating)}
                <Text
                  style={[
                    styles.ratingText,
                    isSelected && styles.selectedRatingText,
                  ]}
                >
                  {restaurant.rating || 'N/A'}
                </Text>
              </View>

              <View style={styles.addressRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={isSelected ? Colors.primary[600] : Colors.neutral[500]}
                />
                <Text
                  style={[
                    styles.addressText,
                    isSelected && styles.selectedAddressText,
                  ]}
                >
                  {restaurant.address}
                </Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View
                style={[
                  styles.typeTag,
                  { backgroundColor: typeColors.bg },
                  isSelected && styles.selectedTypeTag,
                ]}
              >
                <Text
                  style={[
                    styles.typeTagText,
                    { color: typeColors.text },
                    isSelected && styles.selectedTypeTagText,
                  ]}
                >
                  {getRecommendationTypeLabel(restaurant.recommendationType)}
                </Text>
              </View>

              <Text
                style={[
                  styles.budgetText,
                  isSelected && styles.selectedBudgetText,
                ]}
              >
                {restaurant.budget}
              </Text>
            </View>
          </View>

          {/* 推薦理由 */}
          <View
            style={[
              styles.reasonContainer,
              isSelected
                ? styles.selectedReasonContainer
                : styles.defaultReasonContainer,
            ]}
          >
            <Text
              style={[
                styles.reasonTitle,
                isSelected && styles.selectedReasonTitle,
              ]}
            >
              推薦理由
            </Text>
            <Text
              style={[
                styles.reasonText,
                isSelected && styles.selectedReasonText,
              ]}
            >
              {restaurant.recommendationReason}
            </Text>
          </View>

          {/* 特徴 */}
          <View style={styles.featuresContainer}>
            {restaurant.features.map((feature, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureTag,
                  isSelected
                    ? styles.selectedFeatureTag
                    : styles.defaultFeatureTag,
                ]}
              >
                <Text
                  style={[
                    styles.featureTagText,
                    isSelected && styles.selectedFeatureTagText,
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  restaurantContent: {
    gap: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 16,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  selectedRestaurantName: {
    color: Colors.primary[900],
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  selectedRatingText: {
    color: Colors.primary[700],
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  selectedBudgetText: {
    color: Colors.primary[700],
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  selectedAddressText: {
    color: Colors.primary[600],
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedTypeTag: {
    backgroundColor: Colors.primary[200],
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedTypeTagText: {
    color: Colors.primary[800],
  },
  reasonContainer: {
    padding: 12,
    borderRadius: 12,
  },
  selectedReasonContainer: {
    backgroundColor: Colors.primary[100],
  },
  defaultReasonContainer: {
    backgroundColor: Colors.neutral[50],
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.neutral[700],
  },
  selectedReasonTitle: {
    color: Colors.primary[800],
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral[600],
  },
  selectedReasonText: {
    color: Colors.primary[700],
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedFeatureTag: {
    backgroundColor: Colors.primary[100],
  },
  defaultFeatureTag: {
    backgroundColor: Colors.neutral[100],
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  selectedFeatureTagText: {
    color: Colors.primary[700],
  },
});
