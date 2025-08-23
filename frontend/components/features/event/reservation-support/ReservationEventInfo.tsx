import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/utils/constants/design/colors';

interface ReservationEventInfoProps extends BaseComponentProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  memberCount: number;
  formatDate: (dateString: string) => string;
}

/**
 * 予約イベント情報 - イベント概要と参加者数を表示するコンポーネント
 */
export const ReservationEventInfo: React.FC<ReservationEventInfoProps> = ({
  eventTitle,
  eventDate,
  eventTime,
  memberCount,
  formatDate,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.eventIcon}>
            <Ionicons name="calendar" size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Text style={styles.eventDetailLabel}>開催日時</Text>
            <Text style={styles.eventDetailValue}>{formatDate(eventDate)}</Text>
            <Text style={styles.eventDetailValue}>{eventTime}〜</Text>
          </View>
          <View style={styles.eventDetailItem}>
            <Text style={styles.eventDetailLabel}>参加人数</Text>
            <Text style={styles.eventMemberCount}>{memberCount}名</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    gap: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  eventDetailItem: {
    flex: 1,
  },
  eventDetailLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  eventDetailValue: {
    fontSize: 16,
    color: Colors.neutral[900],
    fontWeight: '500',
  },
  eventMemberCount: {
    fontSize: 20,
    color: Colors.primary[700],
    fontWeight: 'bold',
  },
});
