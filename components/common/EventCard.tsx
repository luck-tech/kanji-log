import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Users } from 'lucide-react-native';
import { Card } from './Card';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  statusIcon: React.ReactNode;
  style?: any;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  statusIcon,
  style,
}) => {
  const formatDate = (event: Event) => {
    if (event.date && event.time) {
      const date = new Date(event.date);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${event.time}`;
    }
    return '日程未定';
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

  return (
    <TouchableOpacity
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
      style={style}
    >
      <Card style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.statusBadge}>{statusIcon}</View>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={Colors.gray[500]} />
            <Text style={styles.infoText}>{formatDate(event)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Users size={16} color={Colors.gray[500]} />
            <Text style={styles.infoText}>{event.members.length}名参加</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <Text style={styles.eventPurpose}>
            目的: {getPurposeLabel(event.purpose)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
