import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowRight,
  TrendingDown,
  Database,
  Share2,
} from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

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
      <TrendingDown size={32} color={Colors.primary[600]} strokeWidth={2} />
    ),
    title: '負担削減',
    description:
      '日程調整からお店選び、予約まで。煩雑な作業をすべて一つのアプリで効率的に管理できます。',
    color: Colors.primary[50],
  },
  {
    id: 2,
    icon: <Database size={32} color={Colors.secondary[600]} strokeWidth={2} />,
    title: 'ナレッジ蓄積',
    description:
      '過去のイベント情報を記録して、次回の企画に活かせるあなただけの幹事データベースを構築。',
    color: Colors.secondary[50],
  },
  {
    id: 3,
    icon: <Share2 size={32} color={Colors.accent[600]} strokeWidth={2} />,
    title: '集合知',
    description:
      '他の幹事が共有した経験やおすすめ店舗情報にアクセスして、より良いイベントを企画。',
    color: Colors.accent[50],
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>3つの価値</Text>
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
        contentContainerStyle={styles.scrollContent}
      >
        {features.map((feature, index) => (
          <View key={feature.id} style={styles.featureContainer}>
            <Card
              style={{
                ...styles.featureCard,
                backgroundColor: feature.color,
              }}
              shadow={false}
            >
              <View style={styles.iconContainer}>{feature.icon}</View>
            </Card>

            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {features.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Button
          title={currentIndex === features.length - 1 ? 'はじめる' : '次へ'}
          onPress={handleNext}
          size="lg"
          fullWidth
          icon={<ArrowRight size={20} color={Colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.xl + 20,
    paddingBottom: Layout.padding.lg,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.gray[900],
  },
  scrollContent: {
    flexDirection: 'row',
  },
  featureContainer: {
    width: width,
    paddingHorizontal: Layout.padding.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCard: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  iconContainer: {
    padding: Layout.padding.lg,
  },
  featureTitle: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  featureDescription: {
    ...Typography.body1,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Layout.padding.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary[600],
  },
  inactiveDot: {
    backgroundColor: Colors.gray[300],
  },
  navigation: {
    paddingHorizontal: Layout.padding.lg,
    paddingBottom: Layout.padding.lg,
    marginTop: 'auto',
  },
});
