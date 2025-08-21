import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Restaurant {
  id: string;
  name: string;
  genre: string;
  rating: number;
  budget: string;
  address: string;
  phone?: string;
  imageUrl?: string;
  recommendationReason: string;
  recommendationType: 'majority' | 'inclusive' | 'challenge';
  features: string[];
  mapUrl?: string;
  reservationUrl?: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '炭火焼鳥 鳥心',
    genre: '焼鳥・居酒屋',
    rating: 4.3,
    budget: '3,000〜4,000円',
    address: '東京都新宿区歌舞伎町1-2-3',
    phone: '03-1234-5678',
    recommendationReason: '全員が好む和食ジャンルで、アレルギー対応も充実',
    recommendationType: 'majority',
    features: ['個室あり', 'アレルギー対応', '飲み放題', '駅近5分'],
    mapUrl: 'https://maps.google.com/?q=炭火焼鳥+鳥心+新宿',
  },
  {
    id: '2',
    name: 'イタリアン BELLA VISTA',
    genre: 'イタリアン',
    rating: 4.1,
    budget: '4,000〜5,000円',
    address: '東京都新宿区西新宿2-1-1',
    phone: '03-2345-6789',
    recommendationReason: 'メニューの幅が広く、全員の好みに配慮できます',
    recommendationType: 'inclusive',
    features: ['眺望良好', 'ベジタリアン対応', 'ワイン豊富', '禁煙'],
    reservationUrl: 'https://example.com/reservation',
  },
  {
    id: '3',
    name: '韓国料理 ソウルキッチン',
    genre: '韓国料理',
    rating: 4.0,
    budget: '2,500〜3,500円',
    address: '東京都新宿区新宿3-4-5',
    phone: '03-3456-7890',
    recommendationReason: '話題の韓国料理で新しい体験を',
    recommendationType: 'challenge',
    features: ['チーズタッカルビ', 'K-POP', 'インスタ映え', 'コスパ良好'],
  },
];

export default function RestaurantSuggestionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    router.back();
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleMakeReservation = () => {
    if (!selectedRestaurant) return;

    router.push(
      `/event/${id}/reservation-support?restaurantId=${selectedRestaurant.id}`
    );
  };

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
      majority: { bg: Colors.blue['100'], text: Colors.blue['700'] },
      inclusive: { bg: Colors.green['100'], text: Colors.green['700'] },
      challenge: { bg: Colors.purple['100'], text: Colors.purple['700'] },
    };
    return (
      colorMap[type as keyof typeof colorMap] || {
        bg: Colors.neutral['100'],
        text: Colors.neutral['700'],
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

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Header
          title="レストラン提案"
          subtitle="AIが選んだおすすめのお店"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 提案の説明 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.explanationContent}>
                <View style={styles.explanationHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="sparkles"
                      size={20}
                      color={Colors.purple['600']}
                    />
                  </View>
                  <Text style={styles.explanationTitle}>AI分析結果</Text>
                </View>
                <Text style={styles.explanationText}>
                  メンバーの好み、アレルギー情報、予算を分析して、
                  {restaurants.length}つのお店を厳選しました。
                  それぞれ異なるアプローチで選ばれています。
                </Text>
              </View>
            </Card>

            {/* レストラン一覧 */}
            <View style={styles.restaurantList}>
              {restaurants.map((restaurant, index) => {
                const isSelected = selectedRestaurant?.id === restaurant.id;
                const typeColors = getRecommendationTypeColors(
                  restaurant.recommendationType
                );

                return (
                  <TouchableOpacity
                    key={restaurant.id}
                    onPress={() => handleRestaurantSelect(restaurant)}
                    activeOpacity={0.8}
                  >
                    <Card
                      variant="elevated"
                      shadow="none"
                      style={isSelected ? styles.selectedCard : undefined}
                    >
                      <View style={styles.restaurantContent}>
                        {/* レストラン基本情報 */}
                        <View style={styles.restaurantHeader}>
                          <View style={styles.restaurantInfo}>
                            <Text
                              style={[
                                styles.restaurantName,
                                isSelected && styles.selectedRestaurantName,
                              ]}
                            >
                              {restaurant.name}
                            </Text>
                            <View style={styles.ratingRow}>
                              {renderStars(restaurant.rating)}
                              <Text
                                style={[
                                  styles.ratingText,
                                  isSelected && styles.selectedRatingText,
                                ]}
                              >
                                {restaurant.rating} • {restaurant.genre}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.budgetText,
                                isSelected && styles.selectedBudgetText,
                              ]}
                            >
                              予算: {restaurant.budget}
                            </Text>
                            {/* 住所 */}
                            <View style={styles.addressRow}>
                              <Ionicons
                                name="location"
                                size={16}
                                color={
                                  isSelected
                                    ? Colors.blue['600']
                                    : Colors.neutral['500']
                                }
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
                                isSelected
                                  ? styles.selectedTypeTag
                                  : { backgroundColor: typeColors.bg },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.typeTagText,
                                  isSelected
                                    ? styles.selectedTypeTagText
                                    : { color: typeColors.text },
                                ]}
                              >
                                {getRecommendationTypeLabel(
                                  restaurant.recommendationType
                                )}
                              </Text>
                            </View>
                            {isSelected && (
                              <View style={styles.selectedIndicator}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={24}
                                  color={Colors.blue['500']}
                                />
                              </View>
                            )}
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
              })}
            </View>
          </View>
        </ScrollView>

        {/* Footer - 選択したレストランで予約へ進む */}
        {selectedRestaurant && (
          <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            <Button
              title={`${selectedRestaurant.name}で予約する`}
              onPress={handleMakeReservation}
              variant="gradient"
              size="lg"
              fullWidth
              icon={<Ionicons name="restaurant" size={20} color="white" />}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral['50'],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  explanationContent: {
    gap: 12,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.purple['100'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral['900'],
  },
  explanationText: {
    color: Colors.neutral['700'],
    lineHeight: 24,
  },
  restaurantList: {
    gap: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.blue['500'],
    backgroundColor: Colors.blue['50'],
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
    color: Colors.neutral['900'],
  },
  selectedRestaurantName: {
    color: Colors.blue['900'],
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.blue['500'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    marginTop: 4,
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
    color: Colors.neutral['600'],
  },
  selectedRatingText: {
    color: Colors.blue['700'],
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral['700'],
  },
  selectedBudgetText: {
    color: Colors.blue['700'],
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.neutral['600'],
  },
  selectedAddressText: {
    color: Colors.blue['600'],
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedTypeTag: {
    backgroundColor: Colors.blue['200'],
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedTypeTagText: {
    color: Colors.blue['800'],
  },
  reasonContainer: {
    padding: 12,
    borderRadius: 12,
  },
  selectedReasonContainer: {
    backgroundColor: Colors.blue['100'],
  },
  defaultReasonContainer: {
    backgroundColor: Colors.primary['50'],
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.primary['700'],
  },
  selectedReasonTitle: {
    color: Colors.blue['800'],
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary['600'],
  },
  selectedReasonText: {
    color: Colors.blue['700'],
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
    backgroundColor: Colors.blue['100'],
  },
  defaultFeatureTag: {
    backgroundColor: Colors.neutral['100'],
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral['600'],
  },
  selectedFeatureTagText: {
    color: Colors.blue['700'],
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral['200'],
  },
});
