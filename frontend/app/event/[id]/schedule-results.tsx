import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';

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
        return 'text-success-600';
      case 'maybe':
        return 'text-warning-600';
      case 'unavailable':
        return 'text-error-600';
      default:
        return 'text-neutral-600';
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
    <View className="flex-1 bg-neutral-50">
      <SafeAreaView className="flex-1">
        <Header
          title="日程調整結果"
          subtitle="メンバーの回答状況と最適日程"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 全体サマリー */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="analytics" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-lg font-bold text-neutral-900">
                    調整結果サマリー
                  </Text>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <Text className="text-2xl font-bold text-blue-700 text-center">
                      {responseRate}%
                    </Text>
                    <Text className="text-blue-600 text-center text-sm">
                      回答率
                    </Text>
                  </View>
                  <View className="flex-1 p-3 bg-green-50 rounded-xl border border-green-200">
                    <Text className="text-2xl font-bold text-green-700 text-center">
                      {responses.length}/11
                    </Text>
                    <Text className="text-green-600 text-center text-sm">
                      回答済み
                    </Text>
                  </View>
                  <View className="flex-1 p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <Text className="text-2xl font-bold text-purple-700 text-center">
                      {bestOption.stats.percentage}%
                    </Text>
                    <Text className="text-purple-600 text-center text-sm">
                      最高スコア
                    </Text>
                  </View>
                </View>

                <View className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Text className="text-yellow-800 font-medium mb-1">
                    🏆 最適日程
                  </Text>
                  <Text className="text-yellow-900 text-lg font-bold">
                    {formatDate(bestOption.date)} {bestOption.time}
                  </Text>
                  <Text className="text-yellow-700 text-sm">
                    参加可能 {bestOption.stats.available}名 + おそらく参加{' '}
                    {bestOption.stats.maybe}名
                  </Text>
                </View>
              </View>
            </Card>

            {/* 候補日ごとの結果 */}
            <View className="gap-4">
              <Text className="text-xl font-bold text-neutral-900 px-2">
                候補日の詳細結果
              </Text>

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
                    <Card
                      variant={isSelected ? 'gradient' : 'elevated'}
                      shadow="large"
                      animated={true}
                    >
                      <View className="gap-4">
                        {/* 日程ヘッダー */}
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-3">
                            <View
                              className={`w-8 h-8 rounded-2xl justify-center items-center ${
                                isSelected
                                  ? 'bg-white/20'
                                  : isBest
                                  ? 'bg-yellow-100'
                                  : 'bg-neutral-100'
                              }`}
                            >
                              <Text
                                className={`text-sm font-bold ${
                                  isSelected
                                    ? 'text-white'
                                    : isBest
                                    ? 'text-yellow-700'
                                    : 'text-neutral-600'
                                }`}
                              >
                                {index + 1}
                              </Text>
                            </View>
                            <View>
                              <View className="flex-row items-center gap-2">
                                <Text
                                  className={`text-lg font-bold ${
                                    isSelected
                                      ? 'text-white'
                                      : 'text-neutral-900'
                                  }`}
                                >
                                  {formatDate(option.date)} {option.time}
                                </Text>
                                {isBest && !isSelected && (
                                  <View className="bg-yellow-100 rounded-full px-2 py-0.5">
                                    <Text className="text-xs font-bold text-yellow-700">
                                      最適
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <Text
                                className={`text-sm ${
                                  isSelected
                                    ? 'text-white/90'
                                    : 'text-neutral-600'
                                }`}
                              >
                                参加率 {option.stats.percentage}%
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <View className="w-6 h-6 rounded-full bg-white/20 justify-center items-center">
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color="white"
                              />
                            </View>
                          )}
                        </View>

                        {/* 統計バー */}
                        <View className="gap-2">
                          <View className="flex-row justify-between">
                            <Text
                              className={`text-sm font-medium ${
                                isSelected ? 'text-white' : 'text-neutral-700'
                              }`}
                            >
                              回答状況
                            </Text>
                            <Text
                              className={`text-sm ${
                                isSelected
                                  ? 'text-white/90'
                                  : 'text-neutral-600'
                              }`}
                            >
                              {option.stats.total}名中
                            </Text>
                          </View>

                          <View
                            className={`h-3 rounded-full overflow-hidden ${
                              isSelected ? 'bg-white/20' : 'bg-neutral-200'
                            }`}
                          >
                            <View className="flex-row h-full">
                              <View
                                className="bg-success-500"
                                style={{
                                  width: `${
                                    (option.stats.available /
                                      option.stats.total) *
                                    100
                                  }%`,
                                }}
                              />
                              <View
                                className="bg-warning-500"
                                style={{
                                  width: `${
                                    (option.stats.maybe / option.stats.total) *
                                    100
                                  }%`,
                                }}
                              />
                              <View
                                className="bg-error-500"
                                style={{
                                  width: `${
                                    (option.stats.unavailable /
                                      option.stats.total) *
                                    100
                                  }%`,
                                }}
                              />
                            </View>
                          </View>

                          <View className="flex-row gap-4">
                            <View className="flex-row items-center gap-1">
                              <View className="w-3 h-3 bg-success-500 rounded-full" />
                              <Text
                                className={`text-sm ${
                                  isSelected
                                    ? 'text-white/90'
                                    : 'text-neutral-600'
                                }`}
                              >
                                参加可能 {option.stats.available}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <View className="w-3 h-3 bg-warning-500 rounded-full" />
                              <Text
                                className={`text-sm ${
                                  isSelected
                                    ? 'text-white/90'
                                    : 'text-neutral-600'
                                }`}
                              >
                                おそらく {option.stats.maybe}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <View className="w-3 h-3 bg-error-500 rounded-full" />
                              <Text
                                className={`text-sm ${
                                  isSelected
                                    ? 'text-white/90'
                                    : 'text-neutral-600'
                                }`}
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
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
                    <Ionicons name="people" size={20} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    個別回答状況
                  </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="gap-3">
                    {/* ヘッダー */}
                    <View className="flex-row gap-3">
                      <View className="w-24">
                        <Text className="text-sm font-medium text-neutral-700">
                          メンバー
                        </Text>
                      </View>
                      {sortedDateOptions.map((option) => (
                        <View key={option.id} className="w-20">
                          <Text className="text-xs font-medium text-neutral-600 text-center">
                            {formatDate(option.date)}
                          </Text>
                          <Text className="text-xs text-neutral-500 text-center">
                            {option.time}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* 回答データ */}
                    {responses.map((response) => (
                      <View
                        key={response.userId}
                        className="flex-row gap-3 py-2 border-b border-neutral-100"
                      >
                        <View className="w-24">
                          <Text className="text-sm font-medium text-neutral-900">
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
                            <View key={option.id} className="w-20 items-center">
                              <Text className="text-lg">
                                {getResponseIcon(responseType)}
                              </Text>
                              <Text
                                className={`text-xs ${getResponseColor(
                                  responseType
                                )}`}
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
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
          {selectedDateId ? (
            <View className="gap-3">
              {/* 選択された日程の情報 */}
              <View className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Text className="text-blue-800 font-medium text-center">
                  確定予定の日程
                </Text>
                <Text className="text-blue-900 text-lg font-bold text-center">
                  {formatDate(
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.date || ''
                  )}{' '}
                  {sortedDateOptions.find((o) => o.id === selectedDateId)?.time}
                </Text>
                <Text className="text-blue-700 text-sm text-center">
                  参加可能{' '}
                  {
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.stats.available
                  }
                  名 + おそらく参加{' '}
                  {
                    sortedDateOptions.find((o) => o.id === selectedDateId)
                      ?.stats.maybe
                  }
                  名
                </Text>
              </View>

              {/* ボタン */}
              <View className="flex-row gap-3">
                <Button
                  title="選択を解除"
                  onPress={() => setSelectedDateId(null)}
                  variant="outline"
                  size="lg"
                  style={{ flex: 1 }}
                />
                <Button
                  title="この日程で確定"
                  onPress={handleDateConfirm}
                  variant="gradient"
                  size="lg"
                  style={{ flex: 2 }}
                  icon={
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  }
                />
              </View>
            </View>
          ) : (
            <View className="gap-3">
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
              <Text className="text-neutral-600 text-sm text-center">
                または上記の候補日をタップして手動で選択してください
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
