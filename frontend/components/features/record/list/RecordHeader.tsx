import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecordRating } from './RecordRating';
import { ExtendedSharedRecord } from '@/types/features/record';
import { Colors } from '@/constants';

interface RecordHeaderProps {
  record: ExtendedSharedRecord;
}

export const RecordHeader: React.FC<RecordHeaderProps> = ({ record }) => {
  const getPurposeLabel = (purpose: string) => {
    const purposeLabels: Record<string, string> = {
      welcome: '歓迎会',
      farewell: '送別会',
      celebration: '新年会',
      team_building: '懇親会',
      networking: '交流会',
      year_end: '忘年会',
      other: 'その他',
    };
    return purposeLabels[purpose] || purpose;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.venueName} numberOfLines={1}>
          {record.eventLog.venue.name}
        </Text>
        <View style={styles.purposeContainer}>
          <Text style={styles.purposeText}>
            {getPurposeLabel(record.event.purpose)}
          </Text>
        </View>
      </View>
      <View style={styles.ratingRow}>
        <RecordRating rating={record.eventLog.rating} size={16} />
        <Text style={styles.ratingText}>
          {record.eventLog.rating.toFixed(1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
    marginRight: 8,
  },
  purposeContainer: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  purposeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[600],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginLeft: 4,
  },
});
