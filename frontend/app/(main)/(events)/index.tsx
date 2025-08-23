import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Header,
  EmptyState,
  FloatingActionButton,
  EventCard,
  FadeInView,
  StaggeredList,
} from '@/components/common';
import { EventListFilter } from '@/components/features/event';
import {
  EventCreateModal,
  type EventCreateData,
} from '@/components/features/event';
import { Event, EventStatus } from '@/types';
import { EMPTY_STATE_MESSAGES } from '@/constants';
import { useRouter, useFocusEffect } from 'expo-router';

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: '新人歓迎会',
    purpose: 'welcome',
    status: 'planning',
    organizerId: '1',
    members: [
      {
        id: '1',
        userId: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        responseStatus: 'pending',
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '2',
        userId: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        responseStatus: 'pending',
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '3',
        userId: '3',
        name: '鈴木次郎',
        email: 'suzuki@example.com',
        responseStatus: 'pending',
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    dateOptions: [
      {
        id: '1',
        date: '2024-02-15',
        time: '19:00',
        responses: [],
      },
      {
        id: '2',
        date: '2024-02-16',
        time: '18:30',
        responses: [],
      },
    ],
  },
  {
    id: '2',
    title: '部署飲み会',
    purpose: 'team_building',
    status: 'confirmed',
    date: '2024-02-10',
    time: '18:30',
    organizerId: '1',
    members: [
      {
        id: '1',
        userId: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-10',
      },
      {
        id: '4',
        userId: '4',
        name: '山田三郎',
        email: 'yamada@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-10',
      },
      {
        id: '5',
        userId: '5',
        name: '高橋四郎',
        email: 'takahashi@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-10',
      },
      {
        id: '6',
        userId: '6',
        name: '伊藤五郎',
        email: 'ito@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-10',
      },
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    title: '送別会',
    purpose: 'farewell',
    status: 'completed',
    date: '2024-01-20',
    time: '19:00',
    organizerId: '1',
    members: [
      {
        id: '1',
        userId: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-05',
      },
      {
        id: '2',
        userId: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        responseStatus: 'accepted',
        dateResponses: [],
        joinedAt: '2024-01-05',
      },
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-21',
  },
];

export default function EventsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EventStatus>('planning');
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [animationKey, setAnimationKey] = useState(0);

  const filteredEvents = events.filter((event) => event.status === activeTab);

  // フォーカス時の処理
  useFocusEffect(
    useCallback(() => {
      // TODO: API call to refresh events
      // アニメーションキーを更新してタブ切り替え毎にアニメーションを発生させる
      setAnimationKey((prev) => prev + 1);
    }, [])
  );

  const handleCreateEvent = () => {
    setIsCreateModalVisible(true);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/(main)/(events)/${eventId}`);
  };

  const handleEventCreate = (eventData: EventCreateData) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title,
      purpose: eventData.purpose || 'other',
      status: eventData.hasScheduling ? 'planning' : 'confirmed',
      date: eventData.date,
      time: eventData.time,
      organizerId: '1',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: eventData.notes,
      dateOptions: eventData.hasScheduling
        ? [
            {
              id: '1',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              time: '19:00',
              responses: [],
            },
            {
              id: '2',
              date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              time: '18:30',
              responses: [],
            },
          ]
        : undefined,
    };

    setEvents((prev) => [newEvent, ...prev]);
    console.log('Created event:', newEvent);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderEvents = () => {
    if (filteredEvents.length === 0) {
      const messages = EMPTY_STATE_MESSAGES[activeTab];
      return (
        <View style={styles.emptyContainer}>
          <FadeInView delay={300}>
            <EmptyState
              icon="calendar-outline"
              title={messages.title}
              description={messages.description}
            />
          </FadeInView>
        </View>
      );
    }

    return (
      <View style={styles.eventList}>
        <StaggeredList key={animationKey} itemDelay={100}>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
              variant="elevated"
            />
          ))}
        </StaggeredList>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <Header
        title="イベント"
        subtitle="飲み会の企画・管理"
        variant="gradient"
      />

      <EventListFilter
        activeStatus={activeTab}
        onStatusChange={setActiveTab}
        variant="segmented"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0284c7"
            colors={['#0284c7']}
          />
        }
      >
        <View style={styles.content}>{renderEvents()}</View>
      </ScrollView>

      <FloatingActionButton
        icon="add"
        onPress={handleCreateEvent}
        variant="gradient"
        size="md"
      />

      <EventCreateModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleEventCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  eventList: {
    gap: 8,
  },
});
