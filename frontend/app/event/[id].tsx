import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/common';
import {
  EventOverviewCard,
  EventActionsList,
  EventMembersList,
} from '@/components/features/event';
import {
  DateScheduleModal,
  AreaSelectionModal,
  EventLogModal,
  type ScheduleData,
  type EventLogData,
} from '@/components/features/event';
import { Event } from '@/types';
import { Colors } from '@/constants';

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
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [isEventLogModalVisible, setIsEventLogModalVisible] = useState(false);

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

  const handleViewScheduleResults = () => {
    router.push(`/event/${id}/schedule-results`);
  };

  const handleCreateEventLog = () => {
    setIsEventLogModalVisible(true);
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

  const getResponseStats = () => {
    const total = event.members.length;
    const responded = event.members.filter(
      (m) => m.responseStatus !== 'pending'
    ).length;
    return { total, responded };
  };

  const responseStats = getResponseStats();

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <EventOverviewCard event={event} responseStats={responseStats} />
            <EventActionsList
              event={event}
              responseStats={responseStats}
              onCreateForm={handleCreateForm}
              onScheduleSetup={handleScheduleSetup}
              onViewScheduleResults={handleViewScheduleResults}
              onAreaSelection={handleAreaSelection}
              onCreateEventLog={handleCreateEventLog}
            />
            <EventMembersList event={event} onMemberPress={handleMemberPress} />
          </View>
        </ScrollView>

        {/* モーダル */}
        <DateScheduleModal
          isVisible={isScheduleModalVisible}
          onClose={() => setIsScheduleModalVisible(false)}
          onScheduleSetup={(scheduleData: ScheduleData) => {
            console.log('Schedule setup:', scheduleData);
            setIsScheduleModalVisible(false);
          }}
        />

        <AreaSelectionModal
          isVisible={isAreaModalVisible}
          onClose={() => setIsAreaModalVisible(false)}
          onAreaSelect={(areaType, area) => {
            console.log('Area selected:', areaType, area);
            setIsAreaModalVisible(false);
            // レストランサジェスト画面に遷移（選択されたエリア情報をクエリパラメータで渡す）
            const queryParams = new URLSearchParams({
              areaType,
              ...(area && { area }),
            });
            router.push(
              `/event/${id}/restaurant-suggestions?${queryParams.toString()}`
            );
          }}
        />

        <EventLogModal
          isVisible={isEventLogModalVisible}
          onClose={() => setIsEventLogModalVisible(false)}
          onSave={(eventLogData: EventLogData) => {
            console.log('Event log saved:', eventLogData);
            setIsEventLogModalVisible(false);
          }}
          eventTitle={event.title}
          venue={event.venue}
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
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    padding: 24,
    gap: 24,
  },
});
