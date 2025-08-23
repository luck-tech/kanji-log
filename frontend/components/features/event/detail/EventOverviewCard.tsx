import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../common/ui';
import { Event } from '../../../../types/features/event';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '../../../../utils/constants/design/colors';

interface EventOverviewCardProps extends BaseComponentProps {
  event: Event;
  responseStats: {
    total: number;
    responded: number;
  };
}

/**
 * イベント概要カード - ステータス、確定日程、会場情報、統計を統合表示
 */
export const EventOverviewCard: React.FC<EventOverviewCardProps> = ({
  event,
  responseStats,
  style,
  testID,
}) => {
  const getPurposeLabel = (purpose: string): string => {
    const purposeMap = {
      welcome: '歓迎会',
      farewell: '送別会',
      celebration: 'お祝い',
      team_building: 'チームビルディング',
      casual: '親睦会',
      other: 'その他',
    };
    return purposeMap[purpose as keyof typeof purposeMap] || 'その他';
  };

  const getStatusLabel = (status: string): string => {
    const statusMap = {
      planning: '日程調整中',
      confirmed: '日程確定済み',
      completed: '開催済み',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      planning: '#f59e0b',
      confirmed: '#10b981',
      completed: '#6b7280',
    };
    return colorMap[status as keyof typeof colorMap] || '#6b7280';
  };

  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.overviewCard}>
        {/* ステータス行 */}
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(event.status) },
              ]}
            />
            <Text style={styles.statusLabel}>
              {getStatusLabel(event.status)}
            </Text>
          </View>
          <View style={styles.purposeBadge}>
            <Text style={styles.purposeText}>
              {getPurposeLabel(event.purpose)}
            </Text>
          </View>
        </View>

        {/* 確定日程の表示 */}
        {event.status === 'confirmed' && event.confirmedDate && (
          <View style={styles.confirmedDateCard}>
            <View style={styles.confirmedHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.confirmedTitle}>確定日程</Text>
            </View>
            <Text style={styles.confirmedDate}>
              {new Date(event.confirmedDate.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}{' '}
              {event.confirmedDate.time}
            </Text>
          </View>
        )}

        {/* 会場情報 - 開催済みのみで表示 */}
        {event.status === 'completed' && event.venue && (
          <View style={styles.venueCard}>
            <View style={styles.venueHeader}>
              <Ionicons name="location" size={20} color="#0284c7" />
              <Text style={styles.venueTitle}>開催会場</Text>
            </View>
            <Text style={styles.venueName}>{event.venue.name}</Text>
            <Text style={styles.venueAddress}>{event.venue.address}</Text>
            {event.venue.phone && (
              <Text style={styles.venuePhone}>{event.venue.phone}</Text>
            )}
          </View>
        )}

        {/* メモ */}
        {event.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{event.notes}</Text>
          </View>
        )}

        {/* 統計情報 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={18} color="#0284c7" />
            <Text style={styles.statText}>{event.members.length}名招待</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#10b981"
            />
            <Text style={styles.statText}>
              {responseStats.responded}/{responseStats.total}名回答済み
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  overviewCard: {
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  purposeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  confirmedDateCard: {
    padding: 12,
    backgroundColor: Colors.success[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  confirmedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success[800],
  },
  confirmedDate: {
    fontSize: 16,
    color: Colors.success[700],
    lineHeight: 24,
  },
  venueCard: {
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  venueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[800],
  },
  venueName: {
    fontSize: 16,
    color: Colors.primary[700],
    lineHeight: 24,
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: Colors.primary[600],
    lineHeight: 20,
  },
  venuePhone: {
    fontSize: 14,
    color: Colors.primary[600],
    lineHeight: 20,
  },
  notesCard: {
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  notesText: {
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
});
