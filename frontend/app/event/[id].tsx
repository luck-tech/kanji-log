import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { AreaSelectionModal } from '@/components/modals/AreaSelectionModal';
import {
  DateScheduleModal,
  ScheduleData,
} from '@/components/modals/DateScheduleModal';
import { Event } from '@/types';

// Mock data - 実際のアプリではAPIから取得
const getMockEvent = (id: string): Event => {
  const baseEvent = {
    id,
    title: '新人歓迎会',
    purpose: 'welcome' as const,
    organizerId: '1',
    members: [
      {
        id: '1',
        userId: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '2',
        userId: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '3',
        userId: '3',
        name: '鈴木次郎',
        email: 'suzuki@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    notes: 'みんなで楽しく歓迎しましょう！',
  };

  // IDに基づいてステータスを決定
  switch (id) {
    case '1': // 調整中
      return {
        ...baseEvent,
        status: 'planning' as const,
        dateOptions: [
          {
            id: '1',
            date: '2024-02-15',
            time: '19:00',
            responses: [{ userId: '2', response: 'available' as const }],
          },
          {
            id: '2',
            date: '2024-02-16',
            time: '18:30',
            responses: [],
          },
        ],
      };
    case '2': // 確定済み
      return {
        ...baseEvent,
        status: 'confirmed' as const,
        confirmedDate: {
          date: '2024-02-15',
          time: '19:00',
        },
        members: [
          {
            id: '1',
            userId: '1',
            name: '田中太郎',
            email: 'tanaka@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '2',
            userId: '2',
            name: '佐藤花子',
            email: 'sato@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '3',
            userId: '3',
            name: '鈴木次郎',
            email: 'suzuki@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
        ],
        dateOptions: [
          {
            id: '1',
            date: '2024-02-15',
            time: '19:00',
            responses: [
              { userId: '1', response: 'available' as const },
              { userId: '2', response: 'available' as const },
              { userId: '3', response: 'available' as const },
            ],
          },
          {
            id: '2',
            date: '2024-02-16',
            time: '18:30',
            responses: [
              { userId: '1', response: 'unavailable' as const },
              { userId: '2', response: 'available' as const },
              { userId: '3', response: 'available' as const },
            ],
          },
        ],
      };
    case '3': // 開催済み
      return {
        ...baseEvent,
        status: 'completed' as const,
        confirmedDate: {
          date: '2024-01-20',
          time: '19:00',
        },
        members: [
          {
            id: '1',
            userId: '1',
            name: '田中太郎',
            email: 'tanaka@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '2',
            userId: '2',
            name: '佐藤花子',
            email: 'sato@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '3',
            userId: '3',
            name: '鈴木次郎',
            email: 'suzuki@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
        ],
        venue: {
          name: '居酒屋 楽しい',
          address: '東京都渋谷区○○○',
          phone: '03-1234-5678',
          genre: '居酒屋',
          area: '渋谷',
        },
      };
    default:
      return {
        ...baseEvent,
        status: 'planning' as const,
      };
  }
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event] = useState<Event>(getMockEvent(id || '1'));
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditEvent = () => {
    console.log('Edit event');
    // TODO: イベント編集モーダルを開く
  };

  const handleMemberPress = (memberId: string) => {
    router.push(`/member/${memberId}`);
  };

  const handleCreateForm = () => {
    router.push(`/event/${id}/form-setup`);
  };

  const handleScheduleSetup = () => {
    setIsScheduleModalVisible(true);
  };

  const handleAreaSelection = () => {
    setIsAreaModalVisible(true);
  };

  const handleScheduleSetupComplete = (scheduleData: ScheduleData) => {
    console.log('Schedule setup completed:', scheduleData);
    // TODO: API call to save schedule data
  };

  const handleAreaSelect = (
    areaType: 'center' | 'specified',
    area?: string
  ) => {
    console.log('Area selected:', areaType, area);
    router.push(`/event/${id}/restaurant-suggestions`);
  };

  const handleViewScheduleResults = () => {
    router.push(`/event/${id}/schedule-results`);
  };

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

  const getResponseStats = () => {
    const total = event.members.length;
    const responded = event.members.filter(
      (m) => m.responseStatus !== 'pending'
    ).length;
    return { total, responded };
  };

  const responseStats = getResponseStats();

  return (
    <View className="flex-1 bg-neutral-50">
      <SafeAreaView className="flex-1">
        <Header
          title={event.title}
          subtitle={getPurposeLabel(event.purpose)}
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
          rightIcon="create-outline"
          onRightPress={handleEditEvent}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="p-6 gap-6">
            {/* イベント概要 */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    />
                    <Text className="text-lg font-bold text-neutral-900">
                      {getStatusLabel(event.status)}
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-primary-100">
                    <Text className="text-sm font-semibold text-primary-700">
                      {getPurposeLabel(event.purpose)}
                    </Text>
                  </View>
                </View>

                {/* 確定日程の表示 */}
                {event.status === 'confirmed' && event.confirmedDate && (
                  <View className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10b981"
                      />
                      <Text className="text-base font-semibold text-green-800">
                        確定日程
                      </Text>
                    </View>
                    <Text className="text-base text-green-700 leading-6">
                      {new Date(event.confirmedDate.date).toLocaleDateString(
                        'ja-JP',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long',
                        }
                      )}{' '}
                      {event.confirmedDate.time}
                    </Text>
                  </View>
                )}

                {/* 会場情報 - 開催済みのみで表示 */}
                {event.status === 'completed' && event.venue && (
                  <View className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="location" size={20} color="#0284c7" />
                      <Text className="text-base font-semibold text-blue-800">
                        開催会場
                      </Text>
                    </View>
                    <Text className="text-base text-blue-700 leading-6 mb-1">
                      {event.venue.name}
                    </Text>
                    <Text className="text-sm text-blue-600 leading-5">
                      {event.venue.address}
                    </Text>
                    {event.venue.phone && (
                      <Text className="text-sm text-blue-600 leading-5">
                        {event.venue.phone}
                      </Text>
                    )}
                  </View>
                )}

                {event.notes && (
                  <View className="p-3 bg-neutral-50 rounded-xl">
                    <Text className="text-base text-neutral-700 leading-6">
                      {event.notes}
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="people-outline" size={18} color="#0284c7" />
                    <Text className="text-base text-neutral-700 font-medium">
                      {event.members.length}名招待
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#10b981"
                    />
                    <Text className="text-base text-neutral-700 font-medium">
                      {responseStats.responded}/{responseStats.total}名回答済み
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* アクションカード */}
            <View className="gap-4">
              {/* Webフォーム作成 - 開催済み以外で表示、かつ日程確定済みの場合は全員回答済みでない場合のみ表示 */}
              {event.status !== 'completed' &&
                !(
                  event.status === 'confirmed' &&
                  responseStats.responded === responseStats.total
                ) && (
                  <TouchableOpacity
                    onPress={handleCreateForm}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="medium" animated={true}>
                      <View className="flex-row items-center">
                        <LinearGradient
                          colors={['#0ea5e9', '#0284c7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          className="w-12 h-12 rounded-2xl justify-center items-center mr-4"
                        >
                          <Ionicons
                            name="document-text"
                            size={24}
                            color="white"
                          />
                        </LinearGradient>
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-neutral-900 mb-1">
                            Webフォームを作成
                          </Text>
                          <Text className="text-sm text-neutral-600">
                            メンバーの好みやアレルギー情報を収集
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* 日程調整 */}
              {event.status === 'planning' && (
                <TouchableOpacity
                  onPress={handleScheduleSetup}
                  activeOpacity={0.8}
                >
                  <Card variant="elevated" shadow="medium" animated={true}>
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 rounded-2xl bg-orange-100 justify-center items-center mr-4">
                        <Ionicons name="calendar" size={24} color="#f59e0b" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-neutral-900 mb-1">
                          日程調整を設定
                        </Text>
                        <Text className="text-sm text-neutral-600">
                          複数の候補日でメンバーの都合を確認
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94a3b8"
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              )}

              {/* 日程調整結果 */}
              {event.status === 'planning' &&
                event.dateOptions &&
                event.dateOptions.length > 0 && (
                  <TouchableOpacity
                    onPress={handleViewScheduleResults}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="medium" animated={true}>
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-2xl bg-green-100 justify-center items-center mr-4">
                          <Ionicons
                            name="bar-chart"
                            size={24}
                            color="#10b981"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-neutral-900 mb-1">
                            日程調整の結果
                          </Text>
                          <Text className="text-sm text-neutral-600">
                            メンバーの回答状況を確認して日程を確定
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* レストラン提案 - 確定済みのみで表示 */}
              {event.status === 'confirmed' &&
                responseStats.responded === responseStats.total && (
                  <TouchableOpacity
                    onPress={handleAreaSelection}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="medium" animated={true}>
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-2xl bg-red-100 justify-center items-center mr-4">
                          <Ionicons
                            name="restaurant"
                            size={24}
                            color="#ef4444"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-neutral-900 mb-1">
                            お店を探す
                          </Text>
                          <Text className="text-sm text-neutral-600">
                            AIがメンバー情報を元に最適なお店を提案
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* イベント記録 - 開催済みのみで表示 */}
              {event.status === 'completed' && (
                <TouchableOpacity
                  onPress={() => console.log('Open event log')}
                  activeOpacity={0.8}
                >
                  <Card variant="elevated" shadow="medium" animated={true}>
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 rounded-2xl bg-purple-100 justify-center items-center mr-4">
                        <Ionicons name="book" size={24} color="#8b5cf6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-neutral-900 mb-1">
                          イベント記録を作成
                        </Text>
                        <Text className="text-sm text-neutral-600">
                          開催後の感想や費用を記録して次回に活かす
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94a3b8"
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            </View>

            {/* メンバーリスト */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-neutral-900">
                    {event.status === 'completed' ? '参加者' : '参加メンバー'} (
                    {event.members.length}名)
                  </Text>
                  {event.status !== 'completed' && (
                    <TouchableOpacity className="p-2 rounded-xl bg-primary-100">
                      <Ionicons name="person-add" size={18} color="#0284c7" />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="gap-3">
                  {event.members.map((member, index) => (
                    <TouchableOpacity
                      key={member.id}
                      onPress={() => handleMemberPress(member.id)}
                      activeOpacity={0.7}
                      className="flex-row items-center gap-3 p-2 rounded-xl"
                    >
                      <View className="w-10 h-10 rounded-2xl bg-primary-100 justify-center items-center">
                        <Text className="text-sm font-bold text-primary-700">
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-neutral-900">
                          {member.name}
                        </Text>
                        <Text className="text-sm text-neutral-500">
                          {member.email}
                        </Text>
                      </View>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          member.responseStatus === 'accepted'
                            ? 'bg-success-100'
                            : member.responseStatus === 'declined'
                            ? 'bg-error-100'
                            : 'bg-neutral-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            member.responseStatus === 'accepted'
                              ? 'text-success-700'
                              : member.responseStatus === 'declined'
                              ? 'text-error-700'
                              : 'text-neutral-600'
                          }`}
                        >
                          {event.status === 'completed'
                            ? '参加'
                            : member.responseStatus === 'accepted'
                            ? '参加'
                            : member.responseStatus === 'declined'
                            ? '不参加'
                            : '未回答'}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Modals */}
        <AreaSelectionModal
          isVisible={isAreaModalVisible}
          onClose={() => setIsAreaModalVisible(false)}
          onAreaSelect={handleAreaSelect}
        />

        <DateScheduleModal
          isVisible={isScheduleModalVisible}
          onClose={() => setIsScheduleModalVisible(false)}
          onScheduleSetup={handleScheduleSetupComplete}
        />
      </SafeAreaView>
    </View>
  );
}
