import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { ScheduleResultsSummary } from '../../../../types/features/event';
import { Colors } from '../../../../utils/constants/design/colors';

interface ScheduleSummaryCardProps extends BaseComponentProps {
  summary: ScheduleResultsSummary;
  formatDate: (dateString: string) => string;
}

/**
 * 調整結果サマリー - 回答率、回答状況、最適日程を表示する複合コンポーネント
 */
export const ScheduleSummaryCard: React.FC<ScheduleSummaryCardProps> = ({
  summary,
  formatDate,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.blueIcon]}>
            <Ionicons name="analytics" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.cardTitle}>調整結果サマリー</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.blueStatCard]}>
            <Text style={[styles.statValue, styles.blueStatValue]}>
              {summary.responseRate}%
            </Text>
            <Text style={[styles.statLabel, styles.blueStatLabel]}>回答率</Text>
          </View>
          <View style={[styles.statCard, styles.greenStatCard]}>
            <Text style={[styles.statValue, styles.greenStatValue]}>
              {summary.totalResponses}/{summary.totalMembers}
            </Text>
            <Text style={[styles.statLabel, styles.greenStatLabel]}>
              回答済み
            </Text>
          </View>
          <View style={[styles.statCard, styles.purpleStatCard]}>
            <Text style={[styles.statValue, styles.purpleStatValue]}>
              {summary.bestOption.stats.percentage}%
            </Text>
            <Text style={[styles.statLabel, styles.purpleStatLabel]}>
              最高スコア
            </Text>
          </View>
        </View>

        <View style={styles.bestOptionCard}>
          <Text style={styles.bestOptionTitle}>🏆 最適日程</Text>
          <Text style={styles.bestOptionDate}>
            {formatDate(summary.bestOption.date)} {summary.bestOption.time}
          </Text>
          <Text style={styles.bestOptionDetails}>
            参加可能 {summary.bestOption.stats.available}名 + おそらく参加{' '}
            {summary.bestOption.stats.maybe}名
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueIcon: {
    backgroundColor: Colors.primary[100],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  blueStatCard: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  greenStatCard: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[200],
  },
  purpleStatCard: {
    backgroundColor: Colors.secondary[50],
    borderColor: Colors.secondary[200],
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blueStatValue: {
    color: Colors.primary[700],
  },
  greenStatValue: {
    color: Colors.success[700],
  },
  purpleStatValue: {
    color: Colors.secondary[700],
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  blueStatLabel: {
    color: Colors.primary[600],
  },
  greenStatLabel: {
    color: Colors.success[600],
  },
  purpleStatLabel: {
    color: Colors.secondary[600],
  },
  bestOptionCard: {
    padding: 16,
    backgroundColor: Colors.warning[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning[200],
  },
  bestOptionTitle: {
    color: Colors.warning[800],
    fontWeight: '500',
    marginBottom: 4,
  },
  bestOptionDate: {
    color: Colors.warning[900],
    fontSize: 18,
    fontWeight: 'bold',
  },
  bestOptionDetails: {
    color: Colors.warning[700],
    fontSize: 12,
  },
});
