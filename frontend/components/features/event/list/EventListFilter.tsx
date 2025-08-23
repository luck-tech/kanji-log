import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar } from '@/components/common/layout';
import { EventStatus } from '@/types/common/base';
import { BaseComponentProps } from '@/types/common/ui';
import { EVENT_STATUS_TABS } from '@/utils/constants/business/event';

interface EventListFilterProps extends BaseComponentProps {
  activeStatus: EventStatus;
  onStatusChange: (status: EventStatus) => void;
  variant?: 'segmented' | 'pills';
}

/**
 * イベント一覧のフィルタリングコンポーネント
 * ステータス別の絞り込み機能を提供
 */
export const EventListFilter: React.FC<EventListFilterProps> = ({
  activeStatus,
  onStatusChange,
  variant = 'segmented',
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <TabBar
        tabs={EVENT_STATUS_TABS}
        activeTab={activeStatus}
        onTabPress={onStatusChange}
        variant={variant}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // フィルター用のコンテナスタイル
    // 将来的に検索ボックスなどを追加する場合のレイアウト準備
  },
});
