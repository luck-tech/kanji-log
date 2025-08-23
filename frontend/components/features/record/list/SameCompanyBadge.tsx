import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '@/constants';

/**
 * 同じ会社バッジ - 同じ会社の幹事による投稿表示
 */
export const SameCompanyBadge: React.FC<BaseComponentProps> = ({
  style,
  testID,
}) => {
  return (
    <View style={[styles.badge, style]} testID={testID}>
      <Text style={styles.text}>同じ会社</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary[100],
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary[700],
  },
});
