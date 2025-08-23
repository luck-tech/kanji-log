import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { RestaurantRecommendationSummary } from '@/types/features/event';
import { Colors } from '@/utils/constants/design/colors';

interface RecommendationExplanationProps extends BaseComponentProps {
  summary: RestaurantRecommendationSummary;
}

/**
 * AI分析結果説明 - レストラン提案の分析結果と概要を表示するコンポーネント
 */
export const RecommendationExplanation: React.FC<
  RecommendationExplanationProps
> = ({ summary, style, testID }) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.explanationContent}>
        <View style={styles.explanationHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={20} color={Colors.secondary[600]} />
          </View>
          <Text style={styles.explanationTitle}>AI分析結果</Text>
        </View>
        <Text style={styles.explanationText}>
          {summary.analysisBase}を分析して、
          {summary.totalRestaurants}つのお店を厳選しました。
          それぞれ異なるアプローチで選ばれています。
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: Colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  explanationText: {
    color: Colors.neutral[700],
    lineHeight: 24,
  },
});
