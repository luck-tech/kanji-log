import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SameCompanyBadge } from './SameCompanyBadge';
import { RecordActions } from './RecordActions';
import { ExtendedSharedRecord } from '@/types/features/record';
import { Colors } from '@/constants';

interface RecordFooterProps {
  record: ExtendedSharedRecord;
  onLikePress: (recordId: string) => void;
  onSharePress: (recordId: string) => void;
}

export const RecordFooter: React.FC<RecordFooterProps> = ({
  record,
  onLikePress,
  onSharePress,
}) => {
  return (
    <View style={styles.container}>
      {/* 主催者情報 */}
      <View style={styles.organizerInfo}>
        <Text style={styles.organizerText}>主催: {record.organizer.name}</Text>
        {record.organizer.company && (
          <Text style={styles.companyText}>({record.organizer.company})</Text>
        )}
        {record.organizer.isSameCompany && (
          <View style={styles.badgeContainer}>
            <SameCompanyBadge />
          </View>
        )}
      </View>

      {/* アクションボタン */}
      <RecordActions
        likeCount={record.likeCount}
        isLiked={record.isLiked}
        onLike={() => onLikePress(record.id)}
        onUserPress={() => onSharePress(record.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerText: {
    fontSize: 13,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  companyText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  badgeContainer: {
    marginLeft: 8,
  },
});
