import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/ui';
import { Event } from '@/types/features/event';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/utils/constants/design/colors';

interface EventActionsListProps extends BaseComponentProps {
  event: Event;
  responseStats: {
    total: number;
    responded: number;
  };
  onCreateForm: () => void;
  onScheduleSetup: () => void;
  onViewScheduleResults: () => void;
  onAreaSelection: () => void;
  onCreateEventLog: () => void;
}

/**
 * イベント詳細のアクション一覧 - イベント状態に応じた動的なアクション表示
 * 複雑な表示条件ロジックと複数の関連コンポーネントを組み合わせ
 */
export const EventActionsList: React.FC<EventActionsListProps> = ({
  event,
  responseStats,
  onCreateForm,
  onScheduleSetup,
  onViewScheduleResults,
  onAreaSelection,
  onCreateEventLog,
  style,
  testID,
}) => {
  return (
    <View style={[styles.actionsContainer, style]} testID={testID}>
      {/* Webフォーム作成 - 開催済み以外で表示、かつ日程確定済みの場合は全員回答済みでない場合のみ表示 */}
      {event.status !== 'completed' &&
        !(
          event.status === 'confirmed' &&
          responseStats.responded === responseStats.total
        ) && (
          <TouchableOpacity onPress={onCreateForm} activeOpacity={0.8}>
            <Card variant="elevated" shadow="none">
              <View style={styles.actionCard}>
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientIcon}
                >
                  <Ionicons name="document-text" size={24} color="white" />
                </LinearGradient>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Webフォームを作成</Text>
                  <Text style={styles.actionDescription}>
                    メンバーの好みやアレルギー情報を収集
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </TouchableOpacity>
        )}

      {/* 日程調整 */}
      {event.status === 'planning' && (
        <TouchableOpacity onPress={onScheduleSetup} activeOpacity={0.8}>
          <Card variant="elevated" shadow="none">
            <View style={styles.actionCard}>
              <View style={[styles.iconContainer, styles.orangeIcon]}>
                <Ionicons name="calendar" size={24} color="#f59e0b" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>日程調整を設定</Text>
                <Text style={styles.actionDescription}>
                  複数の候補日でメンバーの都合を確認
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* 日程調整結果 */}
      {event.status === 'planning' &&
        event.dateOptions &&
        event.dateOptions.length > 0 && (
          <TouchableOpacity onPress={onViewScheduleResults} activeOpacity={0.8}>
            <Card variant="elevated" shadow="none">
              <View style={styles.actionCard}>
                <View style={[styles.iconContainer, styles.greenIcon]}>
                  <Ionicons name="bar-chart" size={24} color="#10b981" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>日程調整の結果</Text>
                  <Text style={styles.actionDescription}>
                    メンバーの回答状況を確認して日程を確定
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </TouchableOpacity>
        )}

      {/* レストラン提案 - 確定済みのみで表示 */}
      {event.status === 'confirmed' &&
        responseStats.responded === responseStats.total && (
          <TouchableOpacity onPress={onAreaSelection} activeOpacity={0.8}>
            <Card variant="elevated" shadow="none">
              <View style={styles.actionCard}>
                <View style={[styles.iconContainer, styles.redIcon]}>
                  <Ionicons name="restaurant" size={24} color="#ef4444" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>お店を探す</Text>
                  <Text style={styles.actionDescription}>
                    AIがメンバー情報を元に最適なお店を提案
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </TouchableOpacity>
        )}

      {/* イベント記録 - 開催済みのみで表示 */}
      {event.status === 'completed' && (
        <TouchableOpacity onPress={onCreateEventLog} activeOpacity={0.8}>
          <Card variant="elevated" shadow="none">
            <View style={styles.actionCard}>
              <View style={[styles.iconContainer, styles.purpleIcon]}>
                <Ionicons name="book" size={24} color="#8b5cf6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>イベント記録を作成</Text>
                <Text style={styles.actionDescription}>
                  開催後の感想や費用を記録して次回に活かす
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </View>
          </Card>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  gradientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeIcon: {
    backgroundColor: '#fef3c7',
  },
  greenIcon: {
    backgroundColor: '#dcfce7',
  },
  redIcon: {
    backgroundColor: '#fee2e2',
  },
  purpleIcon: {
    backgroundColor: '#f3e8ff',
  },
  actionContent: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
});
