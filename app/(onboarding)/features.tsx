import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

const { width } = Dimensions.get('window');

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: (
      <Ionicons name="trending-down" size={32} color="#3b82f6" />
    ),
    title: '負担削減',
    description:
      '日程調整からお店選び、予約まで。煩雑な作業をすべて一つのアプリで効率的に管理できます。',
    color: "#eff6ff",
  },
  {
    id: 2,
    icon: <Ionicons name="server-outline" size={32} color="#8b5cf6" />,
    title: 'ナレッジ蓄積',
    description:
      '過去のイベント情報を記録して、次回の企画に活かせるあなただけの幹事データベースを構築。',
    color: "#f3e8ff",
  },
  {
    id: 3,
    icon: <Ionicons name="share-social-outline" size={32} color="#f59e0b" />,
    title: '集合知',
    description:
      '他の幹事が共有した経験やおすすめ店舗情報にアクセスして、より良いイベントを企画。',
    color: "#fffbeb",
  },
];

export default function FeaturesScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(onboarding)/auth');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/auth');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-6">
        <Text className="text-2xl font-semibold text-gray-900">3つの価値</Text>
        <Button
          title="スキップ"
          onPress={handleSkip}
          variant="ghost"
          size="sm"
        />
      </View>

      {/* Features Scroll */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-row"
      >
        {features.map((feature, index) => (
          <View key={feature.id} className="px-6 items-center justify-center" style={{width}}>
            <Card
              className="w-40 h-40 justify-center items-center mb-8"
              style={{ backgroundColor: feature.color }}
              shadow={false}
            >
              <View className="p-6">{feature.icon}</View>
            </Card>

            <Text className="text-2xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</Text>
            <Text className="text-base text-gray-600 text-center leading-6 px-4">{feature.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center my-8">
        {features.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>

      {/* Navigation */}
      <View className="px-6 pb-6 mt-auto">
        <Button
          title={currentIndex === features.length - 1 ? 'はじめる' : '次へ'}
          onPress={handleNext}
          size="lg"
          fullWidth
          icon={<Ionicons name="arrow-forward" size={20} color="white" />}
        />
      </View>
    </View>
  );
}
