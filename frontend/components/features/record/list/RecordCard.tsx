import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@/components/common/ui/Card';
import { RecordHeader } from './RecordHeader';
import { RecordDetails } from './RecordDetails';
import { RecordFooter } from './RecordFooter';
import { ExtendedSharedRecord } from '@/types/features/record';
import { BaseComponentProps } from '@/types/common/ui';

interface RecordCardProps extends BaseComponentProps {
  record: ExtendedSharedRecord;
  onPress: (record: ExtendedSharedRecord) => void;
  onLikePress: (recordId: string) => void;
  onSharePress: (recordId: string) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onPress,
  onLikePress,
  onSharePress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(record)}
      testID={testID}
      activeOpacity={0.7}
    >
      <Card variant="elevated">
        <RecordHeader record={record} />
        <RecordDetails record={record} />
        <RecordFooter
          record={record}
          onLikePress={onLikePress}
          onSharePress={onSharePress}
        />
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
