import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { DateOptionWithStats } from '@/types/features/event';
import { Colors } from '@/utils/constants/design/colors';

interface DateOptionCardProps extends BaseComponentProps {
  option: DateOptionWithStats;
  index: number;
  isSelected: boolean;
  isBest: boolean;
  formatDate: (dateString: string) => string;
  onPress: () => void;
}

/**
 * 候補日詳細カード - 候補日の統計情報、選択状態、進捗バーを表示する複合コンポーネント
 */
export const DateOptionCard: React.FC<DateOptionCardProps> = ({
  option,
  index,
  isSelected,
  isBest,
  formatDate,
  onPress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} testID={testID}>
      <Card variant="elevated" shadow="none" style={style}>
        <View
          style={[styles.dateOptionCard, isSelected && styles.selectedDateCard]}
        >
          {/* 日程ヘッダー */}
          <View style={styles.dateHeader}>
            <View style={styles.dateHeaderLeft}>
              <View
                style={[
                  styles.dateIndex,
                  isSelected
                    ? styles.selectedDateIndex
                    : isBest
                    ? styles.bestDateIndex
                    : styles.normalDateIndex,
                ]}
              >
                <Text
                  style={[
                    styles.dateIndexText,
                    isSelected
                      ? styles.selectedDateIndexText
                      : isBest
                      ? styles.bestDateIndexText
                      : styles.normalDateIndexText,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <View>
                <View style={styles.dateInfo}>
                  <Text
                    style={[
                      styles.dateTitle,
                      isSelected
                        ? styles.selectedDateTitle
                        : styles.normalDateTitle,
                    ]}
                  >
                    {formatDate(option.date)} {option.time}
                  </Text>
                  {isBest && !isSelected && (
                    <View style={[styles.badge, styles.bestBadge]}>
                      <Text style={[styles.badgeText, styles.bestBadgeText]}>
                        最適
                      </Text>
                    </View>
                  )}
                  {isSelected && (
                    <View style={[styles.badge, styles.selectedBadge]}>
                      <Text
                        style={[styles.badgeText, styles.selectedBadgeText]}
                      >
                        選択中
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.dateSubtitle,
                    isSelected
                      ? styles.selectedDateSubtitle
                      : styles.normalDateSubtitle,
                  ]}
                >
                  参加率 {option.stats.percentage}%
                </Text>
              </View>
            </View>
            {isSelected && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            )}
          </View>

          {/* 統計バー */}
          <View style={styles.statsSection}>
            <View style={styles.statsHeader}>
              <Text
                style={[
                  styles.statsLabel,
                  isSelected
                    ? styles.selectedStatsLabel
                    : styles.normalStatsLabel,
                ]}
              >
                回答状況
              </Text>
              <Text
                style={[
                  styles.statsCount,
                  isSelected
                    ? styles.selectedStatsCount
                    : styles.normalStatsCount,
                ]}
              >
                {option.stats.total}名中
              </Text>
            </View>

            <View
              style={[
                styles.progressBar,
                isSelected
                  ? styles.selectedProgressBar
                  : styles.normalProgressBar,
              ]}
            >
              <View style={styles.progressBarContent}>
                <View
                  style={[
                    styles.availableProgress,
                    {
                      width: `${
                        (option.stats.available / option.stats.total) * 100
                      }%`,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.maybeProgress,
                    {
                      width: `${
                        (option.stats.maybe / option.stats.total) * 100
                      }%`,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.unavailableProgress,
                    {
                      width: `${
                        (option.stats.unavailable / option.stats.total) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.availableDot]} />
                <Text
                  style={[
                    styles.legendText,
                    isSelected
                      ? styles.selectedLegendText
                      : styles.normalLegendText,
                  ]}
                >
                  参加可能 {option.stats.available}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.maybeDot]} />
                <Text
                  style={[
                    styles.legendText,
                    isSelected
                      ? styles.selectedLegendText
                      : styles.normalLegendText,
                  ]}
                >
                  おそらく {option.stats.maybe}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.unavailableDot]} />
                <Text
                  style={[
                    styles.legendText,
                    isSelected
                      ? styles.selectedLegendText
                      : styles.normalLegendText,
                  ]}
                >
                  不可 {option.stats.unavailable}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateOptionCard: {
    gap: 16,
  },
  selectedDateCard: {
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    borderRadius: 12,
    margin: -16,
    padding: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalDateIndex: {
    backgroundColor: Colors.neutral[100],
  },
  bestDateIndex: {
    backgroundColor: Colors.warning[100],
  },
  selectedDateIndex: {
    backgroundColor: Colors.primary[500],
  },
  dateIndexText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  normalDateIndexText: {
    color: Colors.neutral[600],
  },
  bestDateIndexText: {
    color: Colors.warning[700],
  },
  selectedDateIndexText: {
    color: Colors.white,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  normalDateTitle: {
    color: Colors.neutral[900],
  },
  selectedDateTitle: {
    color: Colors.primary[900],
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestBadge: {
    backgroundColor: Colors.warning[100],
  },
  selectedBadge: {
    backgroundColor: Colors.primary[100],
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  bestBadgeText: {
    color: Colors.warning[700],
  },
  selectedBadgeText: {
    color: Colors.primary[700],
  },
  dateSubtitle: {
    fontSize: 12,
  },
  normalDateSubtitle: {
    color: Colors.neutral[600],
  },
  selectedDateSubtitle: {
    color: Colors.primary[700],
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    gap: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalStatsLabel: {
    color: Colors.neutral[700],
  },
  selectedStatsLabel: {
    color: Colors.primary[800],
  },
  statsCount: {
    fontSize: 12,
  },
  normalStatsCount: {
    color: Colors.neutral[600],
  },
  selectedStatsCount: {
    color: Colors.primary[700],
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  normalProgressBar: {
    backgroundColor: Colors.neutral[200],
  },
  selectedProgressBar: {
    backgroundColor: Colors.primary[100],
  },
  progressBarContent: {
    flexDirection: 'row',
    height: '100%',
  },
  availableProgress: {
    backgroundColor: Colors.success[500],
  },
  maybeProgress: {
    backgroundColor: Colors.warning[500],
  },
  unavailableProgress: {
    backgroundColor: Colors.error[500],
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  availableDot: {
    backgroundColor: Colors.success[500],
  },
  maybeDot: {
    backgroundColor: Colors.warning[500],
  },
  unavailableDot: {
    backgroundColor: Colors.error[500],
  },
  legendText: {
    fontSize: 12,
  },
  normalLegendText: {
    color: Colors.neutral[600],
  },
  selectedLegendText: {
    color: Colors.primary[700],
  },
});
