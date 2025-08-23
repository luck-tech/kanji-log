import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FollowStatItemProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const FollowStatItem: React.FC<FollowStatItemProps> = ({
  count,
  label,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.number}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  number: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
});
