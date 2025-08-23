import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseComponentProps } from '@/types/common/ui';
import { BudgetRange } from '@/types/common/base';
import { Colors } from '@/constants';

interface BudgetRangeDisplayProps extends BaseComponentProps {
  budgetRange: BudgetRange;
}

/**
 * 予算帯表示 - 希望予算帯の表示
 */
export const BudgetRangeDisplay: React.FC<BudgetRangeDisplayProps> = ({
  budgetRange,
  style,
  testID,
}) => {
  return (
    <View style={[styles.budgetContainer, style]} testID={testID}>
      <Text style={styles.budgetText}>
        ¥{budgetRange.min.toLocaleString()} - ¥
        {budgetRange.max.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  budgetContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.success[100],
    borderRadius: 12,
  },
  budgetText: {
    color: Colors.success[700],
    fontWeight: '500',
  },
});
