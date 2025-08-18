import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './Card';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  style?: any;
  className?: string;
  variant?: 'default' | 'gradient' | 'elevated';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
  className,
  variant = 'elevated',
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

  const CardContent = () => (
    <>
      {/* Header Section */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-neutral-900 mb-1 leading-6">
          {event.title}
        </Text>
      </View>

      {/* Info Section */}
      <View className="space-y-3 mb-4">
        <View className="flex-row items-center">
          <View className="p-2 rounded-xl bg-neutral-100 mr-3">
            <Ionicons name="calendar-outline" size={18} color="#0284c7" />
          </View>
          <Text className="text-base text-neutral-700 font-medium">
            {formatDate(event)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="p-2 rounded-xl bg-neutral-100 mr-3">
            <Ionicons name="people-outline" size={18} color="#0284c7" />
          </View>
          <Text className="text-base text-neutral-700 font-medium">
            {event.members.length}名参加
          </Text>
        </View>
      </View>

      {/* Purpose Badge */}
      <View className="pt-4 border-t border-neutral-200">
        <View className="flex-row items-center justify-between">
          <View className="px-3 py-1.5 rounded-full bg-accent-100">
            <Text className="text-sm font-medium text-accent-800">
              {getPurposeLabel(event.purpose)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      onPress={() => onPress(event.id)}
      activeOpacity={0.8}
      style={style}
      className={`mb-4 ${className || ''}`}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5 border border-neutral-200"
        >
          <CardContent />
        </LinearGradient>
      ) : (
        <Card
          variant={variant}
          shadow="none"
          animated={false}
          className="border-0"
        >
          <CardContent />
        </Card>
      )}
    </TouchableOpacity>
  );
};
