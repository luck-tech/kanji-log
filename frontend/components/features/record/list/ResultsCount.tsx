import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { BaseComponentProps } from '@/types/common/ui';

interface ResultsCountProps extends BaseComponentProps {
  count: number;
  totalCount?: number;
  hasFilters?: boolean;
}

export const ResultsCount: React.FC<ResultsCountProps> = ({
  count,
  totalCount,
  hasFilters = false,
  style,
  testID,
}) => {
  const getCountText = () => {
    if (hasFilters && totalCount !== undefined) {
      return `${count}件の記録（全${totalCount}件中）`;
    }
    return `${count}件の記録`;
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.countText}>{getCountText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 14,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
});
