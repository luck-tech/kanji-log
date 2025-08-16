import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Plus, Calendar } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { TabBar } from '@/components/common/TabBar';
import { EventCard } from '@/components/common/EventCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
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
          icon={Calendar}
          title={messages.title}
          description={messages.description}
        />
      );
    }

    return (
      <View style={styles.eventList}>
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
    <SafeAreaView style={styles.container}>
      <Header title="イベント管理" subtitle="あなたが主催するイベント一覧" />

      <TabBar
        tabs={EVENT_STATUS_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderEvents()}
      </ScrollView>

      <FloatingActionButton icon={Plus} onPress={handleCreateEvent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  eventList: {
    gap: Layout.spacing.md,
  },
});
