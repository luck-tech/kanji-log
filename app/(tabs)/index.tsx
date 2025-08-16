import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Header } from '@/components/common/Header';
import { TabBar } from '@/components/common/TabBar';
import { EventCard } from '@/components/common/EventCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { Event, EventStatus } from '@/types';
import {
  EVENT_STATUS_TABS,
  EMPTY_STATE_MESSAGES,
} from '@/constants/EventConstants';
import { StatusIcon } from '@/constants/StatusIcons';

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: '新人歓迎会',
    purpose: 'welcome',
    status: 'planning',
    organizerId: '1',
    members: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    dateOptions: [
      {
        id: '1',
        date: '2024-02-15',
        time: '19:00',
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
    members: [],
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
    members: [],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-21',
  },
];

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState<EventStatus>('planning');

  const filteredEvents = mockEvents.filter(
    (event) => event.status === activeTab
  );

  const handleCreateEvent = () => {
    console.log('Create event');
    // TODO: Navigate to event creation page
  };

  const handleEventPress = (eventId: string) => {
    console.log('Event pressed:', eventId);
    // TODO: Navigate to event detail page
  };

  const renderEvents = () => {
    if (filteredEvents.length === 0) {
      const messages = EMPTY_STATE_MESSAGES[activeTab];
      return (
        <EmptyState
          icon="calendar-outline"
          title={messages.title}
          description={messages.description}
        />
      );
    }

    return (
      <View className="gap-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={handleEventPress}
            statusIcon={<StatusIcon status={event.status} />}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="イベント管理" subtitle="あなたが主催するイベント一覧" />

      <TabBar
        tabs={EVENT_STATUS_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {renderEvents()}
      </ScrollView>

      <FloatingActionButton icon="add" onPress={handleCreateEvent} />
    </SafeAreaView>
  );
}
