import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  statusIcon: React.ReactNode;
  style?: any;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  statusIcon,
  style,
  className,
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
      className={className}
    >
      <Card className="mb-4">
        <View className="flex-row justify-between items-start mb-3">
          <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3">
            {event.title}
          </Text>
          <View className="p-2">{statusIcon}</View>
        </View>

        <View className="gap-3 mb-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600">{formatDate(event)}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Ionicons name="people-outline" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600">{event.members.length}名参加</Text>
          </View>
        </View>

        <View className="pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            目的: {getPurposeLabel(event.purpose)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
