import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BaseComponentProps } from '@/types/common/ui';
import { RecordTabType } from '@/types/features/record';
import { Colors } from '@/constants';

interface RecordTabsProps extends BaseComponentProps {
  activeTab: RecordTabType;
  onTabChange: (tab: RecordTabType) => void;
  allCount: number;
  likedCount: number;
}

/**
 * レコードタブ - 全件 / いいね済み切り替え
 */
export const RecordTabs: React.FC<RecordTabsProps> = ({
  activeTab,
  onTabChange,
  allCount,
  likedCount,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => onTabChange('all')}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}
        >
          すべて ({allCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
        onPress={() => onTabChange('liked')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'liked' && styles.activeTabText,
          ]}
        >
          いいね済み ({likedCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
});
