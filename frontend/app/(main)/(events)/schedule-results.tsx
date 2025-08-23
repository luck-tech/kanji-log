import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/common/layout';
import {
  ScheduleSummaryCard,
  DateOptionCard,
  ResponseTable,
  DateConfirmFooter,
} from '../../../src/components/features/event/schedule-results';
import {
  ScheduleResponse,
  DateOptionWithStats,
  ScheduleResultsSummary,
} from '../../../src/types/features/event';
import { Colors } from '@/constants';

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

  // サマリー情報を構築
  const summary: ScheduleResultsSummary = {
    responseRate,
    totalResponses: responses.length,
    totalMembers: 11,
    bestOption,
  };

  const selectedOption = selectedDateId
    ? sortedDateOptions.find((o) => o.id === selectedDateId)
    : undefined;

  const handleQuickConfirm = () => {
    setSelectedDateId(bestOption.id);
    setTimeout(() => handleDateConfirm(), 100);
  };

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
            <ScheduleSummaryCard summary={summary} formatDate={formatDate} />

            {/* 候補日ごとの結果 */}
            <View style={styles.dateOptionsContainer}>
              <Text style={styles.sectionTitle}>候補日の詳細結果</Text>

              {sortedDateOptions.map((option, index) => {
                const isSelected = selectedDateId === option.id;
                const isBest = index === 0;

                return (
                  <DateOptionCard
                    key={option.id}
                    option={option}
                    index={index}
                    isSelected={isSelected}
                    isBest={isBest}
                    formatDate={formatDate}
                    onPress={() =>
                      setSelectedDateId(isSelected ? null : option.id)
                    }
                  />
                );
              })}
            </View>

            {/* 個別回答詳細 */}
            <ResponseTable
              responses={responses}
              dateOptions={sortedDateOptions}
              formatDate={formatDate}
            />
          </View>
        </ScrollView>

        {/* Footer - 日程確定と操作ボタン */}
        <DateConfirmFooter
          selectedDateId={selectedDateId}
          bestOption={bestOption}
          selectedOption={selectedOption}
          formatDate={formatDate}
          onDateConfirm={handleDateConfirm}
          onClearSelection={() => setSelectedDateId(null)}
          onQuickConfirm={handleQuickConfirm}
        />
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
  dateOptionsContainer: {
    gap: 16,
  },
});
