import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FollowStatItem } from './FollowStatItem';
import { FollowStatsProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const FollowStats: React.FC<FollowStatsProps> = ({
  followCount,
  followerCount,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <FollowStatItem count={followCount} label="フォロー" />
      <View style={styles.separator} />
      <FollowStatItem count={followerCount} label="フォロワー" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  separator: {
    width: 1,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 16,
  },
});
