import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Card } from '@/components/common/ui';
import { BenefitItem } from './BenefitItem';
import { BaseComponentProps } from '@/types/common/ui';
import { BenefitItem as BenefitItemType } from '@/types/features/record';
import { Colors } from '@/constants';

const benefitItems: BenefitItemType[] = [
  {
    icon: 'star',
    text: 'お店の評価とレビュー',
    iconColor: Colors.warning[500],
    backgroundColor: Colors.warning[100],
  },
  {
    icon: 'cash-outline',
    text: '予算と費用の参考情報',
    iconColor: Colors.success[500],
    backgroundColor: Colors.success[100],
  },
  {
    icon: 'location-outline',
    text: 'エリア別のおすすめ店舗',
    iconColor: Colors.primary[500],
    backgroundColor: Colors.primary[100],
  },
  {
    icon: 'share-social-outline',
    text: 'イベント企画のコツ',
    iconColor: Colors.accent[500],
    backgroundColor: Colors.accent[100],
  },
];

/**
 * メリット説明カード - 記録共有のメリット一覧
 */
export const BenefitsCard: React.FC<BaseComponentProps> = ({
  style,
  testID,
}) => {
  return (
    <Card variant="gradient" shadow="none" style={style} testID={testID}>
      <View style={styles.content}>
        <Text style={styles.title}>アクセスできる情報</Text>
        <View style={styles.benefitsList}>
          {benefitItems.map((benefit, index) => (
            <BenefitItem key={index} {...benefit} />
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  benefitsList: {
    gap: 12,
  },
});
