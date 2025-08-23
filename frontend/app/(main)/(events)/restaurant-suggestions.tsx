import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/common/layout';
import { Button } from '../../../src/components/common/ui';
import {
  RecommendationExplanation,
  RestaurantSelection,
} from '../../../src/components/features/event/restaurant-suggestions';
import {
  RestaurantSuggestion,
  RestaurantRecommendationSummary,
} from '../../../src/types/features/event';
import { Colors } from '@/constants';

// Mock data
const mockRestaurants: RestaurantSuggestion[] = [
  {
    id: '1',
    name: '炭火焼鳥 鳥心',
    genre: '焼鳥・居酒屋',
    area: '新宿',
    phone: '03-1234-5678',
    address: '東京都新宿区歌舞伎町1-2-3',
    rating: 4.3,
    priceRange: '3,000〜4,000円',
    imageUrl: undefined,
    recommendationReason: '全員が好む和食ジャンルで、アレルギー対応も充実',
    mapUrl: 'https://maps.google.com/?q=炭火焼鳥+鳥心+新宿',
    reservationUrl: undefined,
    recommendationType: 'majority',
    features: ['個室あり', 'アレルギー対応', '飲み放題', '駅近5分'],
    budget: '3,000〜4,000円',
  },
  {
    id: '2',
    name: 'イタリアン BELLA VISTA',
    genre: 'イタリアン',
    area: '新宿',
    phone: '03-2345-6789',
    address: '東京都新宿区西新宿2-4-5',
    rating: 4.1,
    priceRange: '4,000〜5,000円',
    imageUrl: undefined,
    recommendationReason: 'アレルギーに配慮したヘルシーなオプションが豊富',
    mapUrl: 'https://maps.google.com/?q=BELLA+VISTA+新宿',
    reservationUrl: undefined,
    recommendationType: 'inclusive',
    features: ['アレルギー対応', 'ヘルシーメニュー', 'テラス席', '駅直結'],
    budget: '4,000〜5,000円',
  },
  {
    id: '3',
    name: 'スパイスカレー MUMBAI',
    genre: 'インド・カレー',
    area: '新宿',
    phone: '03-3456-7890',
    address: '東京都新宿区新宿3-6-7',
    rating: 3.8,
    priceRange: '2,500〜3,500円',
    imageUrl: undefined,
    recommendationReason:
      'チャレンジ精神のあるメンバーにおすすめの本格スパイス料理',
    mapUrl: 'https://maps.google.com/?q=MUMBAI+新宿',
    reservationUrl: undefined,
    recommendationType: 'challenge',
    features: ['本格スパイス', 'ベジタリアン対応', '辛さ調整可', '深夜営業'],
    budget: '2,500〜3,500円',
  },
];

export default function RestaurantSuggestionsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    areaType?: string;
    area?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantSuggestion | null>(null);
  const [restaurants] = useState<RestaurantSuggestion[]>(mockRestaurants);

  // 選択されたエリア情報を取得
  const selectedAreaType = params.areaType;
  const selectedArea = params.area;

  // ヘッダーのサブタイトルを動的に生成
  const getSubtitle = () => {
    if (selectedAreaType === 'center') {
      return 'AIが選んだ最適エリアのお店';
    } else if (selectedAreaType === 'specified' && selectedArea) {
      return `${selectedArea}エリアのおすすめのお店`;
    }
    return 'AIが選んだおすすめのお店';
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleRestaurantSelect = (restaurant: RestaurantSuggestion) => {
    setSelectedRestaurant(
      selectedRestaurant?.id === restaurant.id ? null : restaurant
    );
  };

  const handleMakeReservation = () => {
    if (!selectedRestaurant) return;

    console.log('Making reservation for:', selectedRestaurant);
    // TODO: Navigate to reservation support screen
    router.push(`/(main)/(events)/${params.id}/reservation-support`);
  };

  // サマリー情報を構築
  const summary: RestaurantRecommendationSummary = {
    totalRestaurants: restaurants.length,
    analysisBase: 'メンバーの好み、アレルギー情報、予算',
    memberCount: 11, // Mock value
  };

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Header
          title="レストラン提案"
          subtitle={getSubtitle()}
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
            <RecommendationExplanation summary={summary} />

            {/* レストラン一覧 */}
            <RestaurantSelection
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              onRestaurantSelect={handleRestaurantSelect}
            />
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
    backgroundColor: Colors.neutral[50],
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
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
