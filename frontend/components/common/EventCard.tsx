import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './Card';
import { Event } from '@/types';
import { Colors } from '@/constants';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  style?: any;
  variant?: 'default' | 'gradient' | 'elevated';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
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
      <View style={styles.headerSection}>
        <Text style={styles.title}>{event.title}</Text>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.primary[600]}
            />
          </View>
          <Text style={styles.infoText}>{formatDate(event)}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="people-outline"
              size={18}
              color={Colors.primary[600]}
            />
          </View>
          <Text style={styles.infoText}>{event.members.length}名参加</Text>
        </View>
      </View>

      {/* Purpose Badge */}
      <View style={styles.footerSection}>
        <View style={styles.footerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {getPurposeLabel(event.purpose)}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.neutral[400]}
          />
        </View>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      onPress={() => onPress(event.id)}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={[Colors.white, Colors.neutral[50]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <CardContent />
        </LinearGradient>
      ) : (
        <Card variant={variant} shadow="none">
          <CardContent />
        </Card>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    marginBottom: 4,
    lineHeight: 24,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.neutral[700],
    fontWeight: '500',
  },
  footerSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.accent[100],
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.accent[800],
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
});
