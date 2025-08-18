import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/common/Header';
import { TabBar } from '@/components/common/TabBar';
import { EventCard } from '@/components/common/EventCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import {
  EventCreateModal,
  EventCreateData,
} from '@/components/modals/EventCreateModal';
import { Event, EventStatus } from '@/types';
import {
  EVENT_STATUS_TABS,
  EMPTY_STATE_MESSAGES,
} from '@/constants/EventConstants';
import { useRouter } from 'expo-router';

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

  const filteredEvents = events.filter((event) => event.status === activeTab);

  const handleCreateEvent = () => {
    setIsCreateModalVisible(true);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleEventCreate = (eventData: EventCreateData) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title,
      purpose: (eventData.purpose as any) || 'other',
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
        <View className="flex-1 justify-center items-center py-16">
          <EmptyState
            icon="calendar-outline"
            title={messages.title}
            description={messages.description}
          />
        </View>
      );
    }

    return (
      <View className="gap-2">
        {filteredEvents.map((event, index) => (
          <View
            key={event.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <EventCard
              event={event}
              onPress={handleEventPress}
              variant="elevated"
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <Header
          title="イベント"
          subtitle="飲み会の企画・管理"
          variant="gradient"
        />

        <TabBar
          tabs={EVENT_STATUS_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="segmented"
          animated={true}
          className="bg-transparent"
        />

        <ScrollView
          className="flex-1 px-6"
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
          <View className="mt-4">{renderEvents()}</View>
        </ScrollView>

        <FloatingActionButton
          icon="add"
          onPress={handleCreateEvent}
          variant="gradient"
          size="md"
          animated={true}
        />

        <EventCreateModal
          isVisible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onCreate={handleEventCreate}
        />
      </SafeAreaView>
    </View>
  );
}
