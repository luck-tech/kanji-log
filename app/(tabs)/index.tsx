import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Calendar, Users, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { Event, EventStatus } from '@/types';

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

const statusTabs = [
  { key: 'planning' as EventStatus, label: '調整中', color: Colors.warning[500] },
  { key: 'confirmed' as EventStatus, label: '確定済み', color: Colors.success[500] },
  { key: 'completed' as EventStatus, label: '終了済み', color: Colors.gray[500] },
];

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState<EventStatus>('planning');

  const filteredEvents = mockEvents.filter(event => event.status === activeTab);

  const handleCreateEvent = () => {
    router.push('/event/create');
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case 'planning':
        return <Clock size={16} color={Colors.warning[500]} />;
      case 'confirmed':
        return <CheckCircle size={16} color={Colors.success[500]} />;
      case 'completed':
        return <XCircle size={16} color={Colors.gray[500]} />;
    }
  };

  const formatDate = (event: Event) => {
    if (event.date && event.time) {
      const date = new Date(event.date);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${event.time}`;
    }
    return '日程未定';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>イベント管理</Text>
        <Text style={styles.headerSubtitle}>あなたが主催するイベント一覧</Text>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {statusTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && [styles.activeTab, { borderColor: tab.color }],
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && [styles.activeTabText, { color: tab.color }],
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEvents.length > 0 ? (
          <View style={styles.eventList}>
            {filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.statusBadge}>
                      {getStatusIcon(event.status)}
                    </View>
                  </View>
                  
                  <View style={styles.eventInfo}>
                    <View style={styles.infoItem}>
                      <Calendar size={16} color={Colors.gray[500]} />
                      <Text style={styles.infoText}>{formatDate(event)}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                      <Users size={16} color={Colors.gray[500]} />
                      <Text style={styles.infoText}>
                        {event.members.length}名参加
                      </Text>
                    </View>
                  </View>

                  <View style={styles.eventFooter}>
                    <Text style={styles.eventPurpose}>
                      目的: {getPurposeLabel(event.purpose)}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color={Colors.gray[400]} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>
              {getEmptyStateTitle(activeTab)}
            </Text>
            <Text style={styles.emptyDescription}>
              {getEmptyStateDescription(activeTab)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateEvent}
        activeOpacity={0.8}
      >
        <Plus size={24} color={Colors.white} strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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

const getEmptyStateTitle = (status: EventStatus): string => {
  switch (status) {
    case 'planning':
      return '調整中のイベントはありません';
    case 'confirmed':
      return '確定済みのイベントはありません';
    case 'completed':
      return '終了済みのイベントはありません';
  }
};

const getEmptyStateDescription = (status: EventStatus): string => {
  switch (status) {
    case 'planning':
      return '新しいイベントを作成して、メンバーとの調整を開始しましょう';
    case 'confirmed':
      return '日程が確定したイベントがここに表示されます';
    case 'completed':
      return '完了したイベントの記録がここに表示されます';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.lg,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  tabContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  tabScrollContent: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.sm,
  },
  tab: {
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  activeTab: {
    backgroundColor: Colors.white,
    borderWidth: 2,
  },
  tabText: {
    ...Typography.body2,
    color: Colors.gray[600],
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  eventList: {
    gap: Layout.spacing.md,
  },
  eventCard: {
    marginBottom: Layout.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  eventTitle: {
    ...Typography.h4,
    color: Colors.gray[900],
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  statusBadge: {
    padding: Layout.padding.xs,
  },
  eventInfo: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  infoText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  eventFooter: {
    paddingTop: Layout.padding.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  eventPurpose: {
    ...Typography.caption,
    color: Colors.gray[500],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.padding.xxl,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.gray[600],
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.body2,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: Layout.padding.lg + 68, // Tab bar height
    right: Layout.padding.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});