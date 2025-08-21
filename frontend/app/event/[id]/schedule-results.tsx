import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Colors } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScheduleResponse {
  userId: string;
  userName: string;
  responses: {
    dateOptionId: string;
    response: 'available' | 'maybe' | 'unavailable';
  }[];
  respondedAt: string;
}

interface DateOptionWithStats {
  id: string;
  date: string;
  time: string;
  label?: string;
  stats: {
    available: number;
    maybe: number;
    unavailable: number;
    total: number;
    percentage: number;
  };
  responses: ScheduleResponse[];
}

// Mock data
const mockDateOptions: DateOptionWithStats[] = [
  {
    id: '1',
    date: '2024-02-15',
    time: '19:00',
    stats: {
      available: 8,
      maybe: 2,
      unavailable: 1,
      total: 11,
      percentage: 82,
    },
    responses: [],
  },
  {
    id: '2',
    date: '2024-02-16',
    time: '18:30',
    stats: {
      available: 6,
      maybe: 3,
      unavailable: 2,
      total: 11,
      percentage: 64,
    },
    responses: [],
  },
  {
    id: '3',
    date: '2024-02-17',
    time: '20:00',
    stats: {
      available: 4,
      maybe: 4,
      unavailable: 3,
      total: 11,
      percentage: 45,
    },
    responses: [],
  },
];

const mockResponses: ScheduleResponse[] = [
  {
    userId: '1',
    userName: '田中太郎',
    responses: [
      { dateOptionId: '1', response: 'available' },
      { dateOptionId: '2', response: 'maybe' },
      { dateOptionId: '3', response: 'unavailable' },
    ],
    respondedAt: '2024-01-20',
  },
  {
    userId: '2',
    userName: '佐藤花子',
    responses: [
      { dateOptionId: '1', response: 'available' },
      { dateOptionId: '2', response: 'available' },
      { dateOptionId: '3', response: 'maybe' },
    ],
    respondedAt: '2024-01-21',
  },
  {
    userId: '3',
    userName: '鈴木次郎',
    responses: [
      { dateOptionId: '1', response: 'available' },
      { dateOptionId: '2', response: 'unavailable' },
      { dateOptionId: '3', response: 'unavailable' },
    ],
    respondedAt: '2024-01-19',
  },
];

export default function ScheduleResultsScreen() {
  const router = useRouter();
  const [dateOptions] = useState<DateOptionWithStats[]>(mockDateOptions);
  const [responses] = useState<ScheduleResponse[]>(mockResponses);
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    router.back();
  };

  const handleDateConfirm = () => {
    if (!selectedDateId) {
      Alert.alert('エラー', '確定する日程を選択してください');
      return;
    }

    const selectedDate = dateOptions.find(
      (option) => option.id === selectedDateId
    );
    if (!selectedDate) return;

    Alert.alert(
      '日程確定',
      `${selectedDate.date} ${selectedDate.time}で確定しますか？\n\n参加可能: ${selectedDate.stats.available}名\nおそらく参加: ${selectedDate.stats.maybe}名`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '確定',
          onPress: () => {
            console.log('Date confirmed:', selectedDate);
            // TODO: API call to confirm date
            router.back();
          },
        },
      ]
    );
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'available':
        return '✅';
      case 'maybe':
        return '🤔';
      case 'unavailable':
        return '❌';
      default:
        return '❓';
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'available':
        return styles.successText;
      case 'maybe':
        return styles.warningText;
      case 'unavailable':
        return styles.errorText;
      default:
        return styles.neutralText;
    }
  };

  const getResponseLabel = (response: string) => {
    switch (response) {
      case 'available':
        return '参加可能';
      case 'maybe':
        return 'おそらく参加';
      case 'unavailable':
        return '参加不可';
      default:
        return '未回答';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${
      weekdays[date.getDay()]
    })`;
  };

  const sortedDateOptions = [...dateOptions].sort(
    (a, b) => b.stats.percentage - a.stats.percentage
  );
  const bestOption = sortedDateOptions[0];
  const responseRate = Math.round((responses.length / 11) * 100); // Assuming 11 total members

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Header
          title="日程調整結果"
          subtitle="メンバーの回答状況と最適日程"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* 全体サマリー */}
            <Card variant="elevated" shadow="none">
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
                      {responseRate}%
                    </Text>
                    <Text style={[styles.statLabel, styles.blueStatLabel]}>
                      回答率
                    </Text>
                  </View>
                  <View style={[styles.statCard, styles.greenStatCard]}>
                    <Text style={[styles.statValue, styles.greenStatValue]}>
                      {responses.length}/11
                    </Text>
                    <Text style={[styles.statLabel, styles.greenStatLabel]}>
                      回答済み
                    </Text>
                  </View>
                  <View style={[styles.statCard, styles.purpleStatCard]}>
                    <Text style={[styles.statValue, styles.purpleStatValue]}>
                      {bestOption.stats.percentage}%
                    </Text>
                    <Text style={[styles.statLabel, styles.purpleStatLabel]}>
                      最高スコア
                    </Text>
                  </View>
                </View>

                <View style={styles.bestOptionCard}>
                  <Text style={styles.bestOptionTitle}>🏆 最適日程</Text>
                  <Text style={styles.bestOptionDate}>
                    {formatDate(bestOption.date)} {bestOption.time}
                  </Text>
                  <Text style={styles.bestOptionDetails}>
                    参加可能 {bestOption.stats.available}名 + おそらく参加
                    {bestOption.stats.maybe}名
                  </Text>
                </View>
              </View>
            </Card>

            {/* 候補日ごとの結果 */}
            <View style={styles.dateOptionsContainer}>
              <Text style={styles.sectionTitle}>候補日の詳細結果</Text>

              {sortedDateOptions.map((option, index) => {
                const isSelected = selectedDateId === option.id;
                const isBest = index === 0;

                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() =>
                      setSelectedDateId(isSelected ? null : option.id)
                    }
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="none">
                      <View
                        style={[
                          styles.dateOptionCard,
                          isSelected && styles.selectedDateCard,
                        ]}
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
                                  <View
                                    style={[styles.badge, styles.bestBadge]}
                                  >
                                    <Text
                                      style={[
                                        styles.badgeText,
                                        styles.bestBadgeText,
                                      ]}
                                    >
                                      最適
                                    </Text>
                                  </View>
                                )}
                                {isSelected && (
                                  <View
                                    style={[styles.badge, styles.selectedBadge]}
                                  >
                                    <Text
                                      style={[
                                        styles.badgeText,
                                        styles.selectedBadgeText,
                                      ]}
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
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color="white"
                              />
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
                                      (option.stats.available /
                                        option.stats.total) *
                                      100
                                    }%`,
                                  },
                                ]}
                              />
                              <View
                                style={[
                                  styles.maybeProgress,
                                  {
                                    width: `${
                                      (option.stats.maybe /
                                        option.stats.total) *
                                      100
                                    }%`,
                                  },
                                ]}
                              />
                              <View
                                style={[
                                  styles.unavailableProgress,
                                  {
                                    width: `${
                                      (option.stats.unavailable /
                                        option.stats.total) *
                                      100
                                    }%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>

                          <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                              <View
                                style={[styles.legendDot, styles.availableDot]}
                              />
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
                              <View
                                style={[styles.legendDot, styles.maybeDot]}
                              />
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
                              <View
                                style={[
                                  styles.legendDot,
                                  styles.unavailableDot,
                                ]}
                              />
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
              })}
            </View>

            {/* 個別回答詳細 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.responseSection}>
                <View style={styles.responseHeader}>
                  <View style={[styles.iconContainer, styles.purpleIcon]}>
                    <Ionicons name="people" size={20} color="#7c3aed" />
                  </View>
                  <Text style={styles.responseTitle}>個別回答状況</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.responseTable}>
                    {/* ヘッダー */}
                    <View style={styles.tableHeader}>
                      <View style={styles.memberColumn}>
                        <Text style={styles.memberHeaderText}>メンバー</Text>
                      </View>
                      {sortedDateOptions.map((option) => (
                        <View key={option.id} style={styles.dateColumn}>
                          <Text style={styles.dateHeaderText}>
                            {formatDate(option.date)}
                          </Text>
                          <Text style={styles.dateTimeText}>{option.time}</Text>
                        </View>
                      ))}
                    </View>

                    {/* 回答データ */}
                    {responses.map((response) => (
                      <View key={response.userId} style={styles.responseRow}>
                        <View style={styles.memberColumn}>
                          <Text style={styles.memberName}>
                            {response.userName}
                          </Text>
                        </View>
                        {sortedDateOptions.map((option) => {
                          const userResponse = response.responses.find(
                            (r) => r.dateOptionId === option.id
                          );
                          const responseType =
                            userResponse?.response || 'unavailable';

                          return (
                            <View key={option.id} style={styles.responseCell}>
                              <Text style={styles.responseIcon}>
                                {getResponseIcon(responseType)}
                              </Text>
                              <Text
                                style={[
                                  styles.responseText,
                                  getResponseColor(responseType),
                                ]}
                              >
                                {getResponseLabel(responseType)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Footer - 日程確定と操作ボタン */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          {selectedDateId ? (
            <View style={styles.footerContent}>
              {/* 選択された日程の情報 */}
              <View style={styles.selectedDateInfo}>
                <Text style={styles.selectedDateLabel}>確定予定の日程</Text>
                <Text style={styles.selectedDateInfoTitle}>
                  {formatDate(
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.date || ''
                  )}{' '}
                  {sortedDateOptions.find((o) => o.id === selectedDateId)?.time}
                </Text>
                <Text style={styles.selectedDateStats}>
                  参加可能
                  {
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.stats.available
                  }
                  名 + おそらく参加
                  {
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.stats.maybe
                  }
                  名
                </Text>
              </View>

              {/* ボタン */}
              <Button
                title="この日程で確定"
                onPress={handleDateConfirm}
                variant="gradient"
                size="lg"
                icon={
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                }
                fullWidth
              />
              <Button
                title="選択を解除"
                onPress={() => setSelectedDateId(null)}
                variant="outline"
                size="lg"
              />
            </View>
          ) : (
            <View style={styles.footerButtons}>
              {/* 推奨日程での自動確定ボタン */}
              <Button
                title={`最適日程で確定: ${formatDate(bestOption.date)} ${
                  bestOption.time
                }`}
                onPress={() => {
                  setSelectedDateId(bestOption.id);
                  setTimeout(() => handleDateConfirm(), 100);
                }}
                variant="gradient"
                size="lg"
                fullWidth
                icon={<Ionicons name="trophy" size={20} color="white" />}
              />

              {/* 手動選択の案内 */}
              <Text style={styles.footerNote}>
                または上記の候補日をタップして手動で選択してください
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    paddingHorizontal: 8,
  },
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
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
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
  dateOptionsContainer: {
    gap: 16,
  },
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
  responseSection: {
    gap: 16,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  responseTable: {
    gap: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  memberColumn: {
    width: 96,
  },
  dateColumn: {
    width: 80,
  },
  memberHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  dateHeaderText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  dateTimeText: {
    fontSize: 10,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  responseRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  memberName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  responseCell: {
    alignItems: 'center',
    width: 80,
  },
  responseIcon: {
    fontSize: 18,
  },
  responseText: {
    fontSize: 10,
  },
  successText: {
    color: Colors.success[600],
  },
  warningText: {
    color: Colors.warning[600],
  },
  errorText: {
    color: Colors.error[600],
  },
  neutralText: {
    color: Colors.neutral[600],
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerContent: {
    gap: 12,
  },
  selectedDateInfo: {
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  selectedDateLabel: {
    color: Colors.primary[800],
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedDateInfoTitle: {
    color: Colors.primary[900],
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedDateStats: {
    color: Colors.primary[700],
    fontSize: 12,
    textAlign: 'center',
  },
  buttonColumn: {
    gap: 12,
  },
  footerButtons: {
    gap: 12,
  },
  footerNote: {
    color: Colors.neutral[600],
    fontSize: 12,
    textAlign: 'center',
  },
});
