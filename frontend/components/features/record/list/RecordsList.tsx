import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { RecordCard } from './RecordCard';
import { RecordsEmptyState } from './RecordsEmptyState';
import { ExtendedSharedRecord } from '@/types/features/record';
import { BaseComponentProps } from '@/types/common/ui';

interface RecordsListProps extends BaseComponentProps {
  records: ExtendedSharedRecord[];
  onRecordPress: (record: ExtendedSharedRecord) => void;
  onLikePress: (recordId: string) => void;
  onSharePress: (recordId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const RecordsList: React.FC<RecordsListProps> = ({
  records,
  onRecordPress,
  onLikePress,
  onSharePress,
  refreshing = false,
  onRefresh,
  style,
  testID,
}) => {
  const renderRecord: ListRenderItem<ExtendedSharedRecord> = ({ item }) => (
    <RecordCard
      record={item}
      onPress={onRecordPress}
      onLikePress={onLikePress}
      onSharePress={onSharePress}
      testID={`record-card-${item.id}`}
    />
  );

  const keyExtractor = (item: ExtendedSharedRecord) => item.id;

  if (records.length === 0) {
    return <RecordsEmptyState />;
  }

  return (
    <FlatList
      data={records}
      renderItem={renderRecord}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={style}
      testID={testID}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};
