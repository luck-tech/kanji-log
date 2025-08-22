import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { Card } from './Card';
import { Event } from '../../../types/features/event';
import { EventStatus } from '../../../types/common/base';
import { Colors } from '../../../utils/constants/design/colors';
import { Layout } from '../../../utils/constants/design/layout';
import { BaseComponentProps } from '../../../types/common/ui';
import { usePressAnimation } from './Animations';

interface EventCardProps extends BaseComponentProps {
  event: Event;
  onPress: (eventId: string) => void;
  variant?: 'default' | 'gradient' | 'elevated';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
  variant = 'elevated',
  testID,
}) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);

  const formatDate = (event: Event) => {
    if (event.date && event.time) {
      const date = new Date(event.date);
      return `${date.getMonth() + 1}月${date.getDate()}日 ${event.time}`;
    }
    return '日時未設定';
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'planning':
        return Colors.neutral[400];
      case 'confirmed':
        return Colors.primary[500];
      case 'completed':
        return Colors.success[500];
      default:
        return Colors.neutral[400];
    }
  };

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case 'planning':
        return '企画中';
      case 'confirmed':
        return '確定';
      case 'completed':
        return '完了';
      default:
        return '不明';
    }
  };

  if (variant === 'gradient') {
    return (
      <Animated.View style={[animatedStyle, style]} testID={testID}>
        <TouchableOpacity
          onPress={() => onPress(event.id)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.gradientContent}>
              <Text style={styles.gradientTitle}>{event.title}</Text>
              <Text style={styles.gradientDate}>{formatDate(event)}</Text>
              <View style={styles.gradientMeta}>
                <View style={styles.gradientMetaItem}>
                  <Ionicons name="people" size={16} color={Colors.white} />
                  <Text style={styles.gradientMetaText}>
                    {event.members?.length || 0}名
                  </Text>
                </View>
                <View style={styles.gradientStatus}>
                  <Text style={styles.gradientStatusText}>
                    {getStatusText(event.status)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      <TouchableOpacity
        onPress={() => onPress(event.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        <Card variant={variant}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{event.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(event.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(event.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.date}>{formatDate(event)}</Text>

            {event.description && (
              <Text style={styles.description} numberOfLines={2}>
                {event.description}
              </Text>
            )}

            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Ionicons name="people" size={16} color={Colors.neutral[500]} />
                <Text style={styles.metaText}>
                  {event.members?.length || 0}名
                </Text>
              </View>
              {event.venue && (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={Colors.neutral[500]}
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {event.venue?.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Layout.padding.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Layout.padding.xs,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  date: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[500],
    lineHeight: 20,
    marginBottom: Layout.spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  metaText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: Layout.spacing.xs,
  },
  // Gradient variant styles
  gradientCard: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  gradientContent: {
    padding: Layout.padding.lg,
  },
  gradientTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  gradientDate: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Layout.spacing.md,
  },
  gradientMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientMetaText: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: Layout.spacing.xs,
    fontWeight: '500',
  },
  gradientStatus: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Layout.padding.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.full,
  },
  gradientStatusText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
});
