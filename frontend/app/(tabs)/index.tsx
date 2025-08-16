import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: '新人歓迎会',
    purpose: 'welcome',
    status: 'planning',
    organizerId: '1',
    members: [
      { id: '1', name: '田中太郎', email: 'tanaka@example.com' },
      { id: '2', name: '佐藤花子', email: 'sato@example.com' },
      { id: '3', name: '鈴木次郎', email: 'suzuki@example.com' },
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
      { id: '1', name: '田中太郎', email: 'tanaka@example.com' },
      { id: '4', name: '山田三郎', email: 'yamada@example.com' },
      { id: '5', name: '高橋四郎', email: 'takahashi@example.com' },
      { id: '6', name: '伊藤五郎', email: 'ito@example.com' },
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
      { id: '1', name: '田中太郎', email: 'tanaka@example.com' },
      { id: '2', name: '佐藤花子', email: 'sato@example.com' },
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-21',
  },
];

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState<EventStatus>('planning');
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
              statusIcon={<StatusIcon status={event.status} />}
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
          title="幹事ナビ" 
          subtitle="飲み会の企画・管理をスマートに"
          variant="gradient"
          rightIcon="notifications-outline"
          onRightPress={() => console.log('Notifications')}
        />

        <TabBar
          tabs={EVENT_STATUS_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          variant="pills"
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
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="mt-4">
            {renderEvents()}
          </View>
        </ScrollView>

        <FloatingActionButton 
          icon="add" 
          onPress={handleCreateEvent}
          variant="gradient"
          size="lg"
          animated={true}
        />
      </SafeAreaView>
    </View>
  );
}
