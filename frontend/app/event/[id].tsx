import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { AreaSelectionModal } from '@/components/modals/AreaSelectionModal';
import {
  DateScheduleModal,
  ScheduleData,
} from '@/components/modals/DateScheduleModal';
import { Event } from '@/types';
import { Colors } from '@/constants';

// Mock data - 実際のアプリではAPIから取得
const getMockEvent = (id: string): Event => {
  const baseEvent = {
    id,
    title: '新人歓迎会',
    purpose: 'welcome' as const,
    organizerId: '1',
    members: [
      {
        id: '1',
        userId: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '2',
        userId: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
      {
        id: '3',
        userId: '3',
        name: '鈴木次郎',
        email: 'suzuki@example.com',
        responseStatus: 'pending' as const,
        dateResponses: [],
        joinedAt: '2024-01-15',
      },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    notes: 'みんなで楽しく歓迎しましょう！',
  };

  // IDに基づいてステータスを決定
  switch (id) {
    case '1': // 調整中
      return {
        ...baseEvent,
        status: 'planning' as const,
        dateOptions: [
          {
            id: '1',
            date: '2024-02-15',
            time: '19:00',
            responses: [{ userId: '2', response: 'available' as const }],
          },
          {
            id: '2',
            date: '2024-02-16',
            time: '18:30',
            responses: [],
          },
        ],
      };
    case '2': // 確定済み
      return {
        ...baseEvent,
        status: 'confirmed' as const,
        confirmedDate: {
          date: '2024-02-15',
          time: '19:00',
        },
        members: [
          {
            id: '1',
            userId: '1',
            name: '田中太郎',
            email: 'tanaka@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '2',
            userId: '2',
            name: '佐藤花子',
            email: 'sato@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '3',
            userId: '3',
            name: '鈴木次郎',
            email: 'suzuki@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
        ],
        dateOptions: [
          {
            id: '1',
            date: '2024-02-15',
            time: '19:00',
            responses: [
              { userId: '1', response: 'available' as const },
              { userId: '2', response: 'available' as const },
              { userId: '3', response: 'available' as const },
            ],
          },
          {
            id: '2',
            date: '2024-02-16',
            time: '18:30',
            responses: [
              { userId: '1', response: 'unavailable' as const },
              { userId: '2', response: 'available' as const },
              { userId: '3', response: 'available' as const },
            ],
          },
        ],
      };
    case '3': // 開催済み
      return {
        ...baseEvent,
        status: 'completed' as const,
        confirmedDate: {
          date: '2024-01-20',
          time: '19:00',
        },
        members: [
          {
            id: '1',
            userId: '1',
            name: '田中太郎',
            email: 'tanaka@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '2',
            userId: '2',
            name: '佐藤花子',
            email: 'sato@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
          {
            id: '3',
            userId: '3',
            name: '鈴木次郎',
            email: 'suzuki@example.com',
            responseStatus: 'accepted' as const,
            dateResponses: [],
            joinedAt: '2024-01-15',
          },
        ],
        venue: {
          name: '居酒屋 楽しい',
          address: '東京都渋谷区○○○',
          phone: '03-1234-5678',
          genre: '居酒屋',
          area: '渋谷',
        },
      };
    default:
      return {
        ...baseEvent,
        status: 'planning' as const,
      };
  }
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event] = useState<Event>(getMockEvent(id || '1'));
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditEvent = () => {
    console.log('Edit event');
    // TODO: イベント編集モーダルを開く
  };

  const handleMemberPress = (memberId: string) => {
    router.push(`/member/${memberId}`);
  };

  const handleCreateForm = () => {
    router.push(`/event/${id}/form-setup`);
  };

  const handleScheduleSetup = () => {
    setIsScheduleModalVisible(true);
  };

  const handleAreaSelection = () => {
    setIsAreaModalVisible(true);
  };

  const handleScheduleSetupComplete = (scheduleData: ScheduleData) => {
    console.log('Schedule setup completed:', scheduleData);
    // TODO: API call to save schedule data
  };

  const handleAreaSelect = (
    areaType: 'center' | 'specified',
    area?: string
  ) => {
    console.log('Area selected:', areaType, area);
    router.push(`/event/${id}/restaurant-suggestions`);
  };

  const handleViewScheduleResults = () => {
    router.push(`/event/${id}/schedule-results`);
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

  const getStatusLabel = (status: string): string => {
    const statusMap = {
      planning: '日程調整中',
      confirmed: '日程確定済み',
      completed: '開催済み',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      planning: '#f59e0b',
      confirmed: '#10b981',
      completed: '#6b7280',
    };
    return colorMap[status as keyof typeof colorMap] || '#6b7280';
  };

  const getResponseStats = () => {
    const total = event.members.length;
    const responded = event.members.filter(
      (m) => m.responseStatus !== 'pending'
    ).length;
    return { total, responded };
  };

  const responseStats = getResponseStats();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title={event.title}
          subtitle={getPurposeLabel(event.purpose)}
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
          rightIcon="create-outline"
          onRightPress={handleEditEvent}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* イベント概要 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.overviewCard}>
                <View style={styles.statusRow}>
                  <View style={styles.statusIndicator}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(event.status) },
                      ]}
                    />
                    <Text style={styles.statusLabel}>
                      {getStatusLabel(event.status)}
                    </Text>
                  </View>
                  <View style={styles.purposeBadge}>
                    <Text style={styles.purposeText}>
                      {getPurposeLabel(event.purpose)}
                    </Text>
                  </View>
                </View>

                {/* 確定日程の表示 */}
                {event.status === 'confirmed' && event.confirmedDate && (
                  <View style={styles.confirmedDateCard}>
                    <View style={styles.confirmedHeader}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10b981"
                      />
                      <Text style={styles.confirmedTitle}>
                        確定日程
                      </Text>
                    </View>
                    <Text style={styles.confirmedDate}>
                      {new Date(event.confirmedDate.date).toLocaleDateString(
                        'ja-JP',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long',
                        }
                      )}{' '}
                      {event.confirmedDate.time}
                    </Text>
                  </View>
                )}

                {/* 会場情報 - 開催済みのみで表示 */}
                {event.status === 'completed' && event.venue && (
                  <View style={styles.venueCard}>
                    <View style={styles.venueHeader}>
                      <Ionicons name="location" size={20} color="#0284c7" />
                      <Text style={styles.venueTitle}>
                        開催会場
                      </Text>
                    </View>
                    <Text style={styles.venueName}>
                      {event.venue.name}
                    </Text>
                    <Text style={styles.venueAddress}>
                      {event.venue.address}
                    </Text>
                    {event.venue.phone && (
                      <Text style={styles.venuePhone}>
                        {event.venue.phone}
                      </Text>
                    )}
                  </View>
                )}

                {event.notes && (
                  <View style={styles.notesCard}>
                    <Text style={styles.notesText}>
                      {event.notes}
                    </Text>
                  </View>
                )}

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="people-outline" size={18} color="#0284c7" />
                    <Text style={styles.statText}>
                      {event.members.length}名招待
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#10b981"
                    />
                    <Text style={styles.statText}>
                      {responseStats.responded}/{responseStats.total}名回答済み
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* アクションカード */}
            <View style={styles.actionsContainer}>
              {/* Webフォーム作成 - 開催済み以外で表示、かつ日程確定済みの場合は全員回答済みでない場合のみ表示 */}
              {event.status !== 'completed' &&
                !(
                  event.status === 'confirmed' &&
                  responseStats.responded === responseStats.total
                ) && (
                  <TouchableOpacity
                    onPress={handleCreateForm}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="none">
                      <View style={styles.actionCard}>
                        <LinearGradient
                          colors={['#0ea5e9', '#0284c7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientIcon}
                        >
                          <Ionicons
                            name="document-text"
                            size={24}
                            color="white"
                          />
                        </LinearGradient>
                        <View style={styles.actionContent}>
                          <Text style={styles.actionTitle}>
                            Webフォームを作成
                          </Text>
                          <Text style={styles.actionDescription}>
                            メンバーの好みやアレルギー情報を収集
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* 日程調整 */}
              {event.status === 'planning' && (
                <TouchableOpacity
                  onPress={handleScheduleSetup}
                  activeOpacity={0.8}
                >
                  <Card variant="elevated" shadow="none">
                    <View style={styles.actionCard}>
                      <View style={[styles.iconContainer, styles.orangeIcon]}>
                        <Ionicons name="calendar" size={24} color="#f59e0b" />
                      </View>
                      <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>
                          日程調整を設定
                        </Text>
                        <Text style={styles.actionDescription}>
                          複数の候補日でメンバーの都合を確認
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94a3b8"
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              )}

              {/* 日程調整結果 */}
              {event.status === 'planning' &&
                event.dateOptions &&
                event.dateOptions.length > 0 && (
                  <TouchableOpacity
                    onPress={handleViewScheduleResults}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="none">
                      <View style={styles.actionCard}>
                        <View style={[styles.iconContainer, styles.greenIcon]}>
                          <Ionicons
                            name="bar-chart"
                            size={24}
                            color="#10b981"
                          />
                        </View>
                        <View style={styles.actionContent}>
                          <Text style={styles.actionTitle}>
                            日程調整の結果
                          </Text>
                          <Text style={styles.actionDescription}>
                            メンバーの回答状況を確認して日程を確定
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* レストラン提案 - 確定済みのみで表示 */}
              {event.status === 'confirmed' &&
                responseStats.responded === responseStats.total && (
                  <TouchableOpacity
                    onPress={handleAreaSelection}
                    activeOpacity={0.8}
                  >
                    <Card variant="elevated" shadow="none">
                      <View style={styles.actionCard}>
                        <View style={[styles.iconContainer, styles.redIcon]}>
                          <Ionicons
                            name="restaurant"
                            size={24}
                            color="#ef4444"
                          />
                        </View>
                        <View style={styles.actionContent}>
                          <Text style={styles.actionTitle}>
                            お店を探す
                          </Text>
                          <Text style={styles.actionDescription}>
                            AIがメンバー情報を元に最適なお店を提案
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#94a3b8"
                        />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )}

              {/* イベント記録 - 開催済みのみで表示 */}
              {event.status === 'completed' && (
                <TouchableOpacity
                  onPress={() => console.log('Open event log')}
                  activeOpacity={0.8}
                >
                  <Card variant="elevated" shadow="none">
                    <View style={styles.actionCard}>
                      <View style={[styles.iconContainer, styles.purpleIcon]}>
                        <Ionicons name="book" size={24} color="#8b5cf6" />
                      </View>
                      <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>
                          イベント記録を作成
                        </Text>
                        <Text style={styles.actionDescription}>
                          開催後の感想や費用を記録して次回に活かす
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94a3b8"
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            </View>

            {/* メンバーリスト */}
            <Card variant="elevated" shadow="none">
              <View style={styles.membersCard}>
                <View style={styles.membersHeader}>
                  <Text style={styles.membersTitle}>
                    {event.status === 'completed' ? '参加者' : '参加メンバー'} (
                    {event.members.length}名)
                  </Text>
                  {event.status !== 'completed' && (
                    <TouchableOpacity style={styles.addMemberButton}>
                      <Ionicons name="person-add" size={18} color="#0284c7" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.membersList}>
                  {event.members.map((member, index) => (
                    <TouchableOpacity
                      key={member.id}
                      onPress={() => handleMemberPress(member.id)}
                      activeOpacity={0.7}
                      style={styles.memberRow}
                    >
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>
                          {member.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>
                          {member.name}
                        </Text>
                        <Text style={styles.memberEmail}>
                          {member.email}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.memberStatusBadge,
                          member.responseStatus === 'accepted'
                            ? styles.memberStatusAccepted
                            : member.responseStatus === 'declined'
                            ? styles.memberStatusDeclined
                            : styles.memberStatusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.memberStatusText,
                            member.responseStatus === 'accepted'
                              ? styles.memberStatusTextAccepted
                              : member.responseStatus === 'declined'
                              ? styles.memberStatusTextDeclined
                              : styles.memberStatusTextPending,
                          ]}
                        >
                          {event.status === 'completed'
                            ? '参加'
                            : member.responseStatus === 'accepted'
                            ? '参加'
                            : member.responseStatus === 'declined'
                            ? '不参加'
                            : '未回答'}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Modals */}
        <AreaSelectionModal
          isVisible={isAreaModalVisible}
          onClose={() => setIsAreaModalVisible(false)}
          onAreaSelect={handleAreaSelect}
        />

        <DateScheduleModal
          isVisible={isScheduleModalVisible}
          onClose={() => setIsScheduleModalVisible(false)}
          onScheduleSetup={handleScheduleSetupComplete}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  overviewCard: {
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  purposeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  confirmedDateCard: {
    padding: 12,
    backgroundColor: Colors.success[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success[200],
  },
  confirmedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success[800],
  },
  confirmedDate: {
    fontSize: 16,
    color: Colors.success[700],
    lineHeight: 24,
  },
  venueCard: {
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  venueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[800],
  },
  venueName: {
    fontSize: 16,
    color: Colors.primary[700],
    lineHeight: 24,
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: Colors.primary[600],
    lineHeight: 20,
  },
  venuePhone: {
    fontSize: 14,
    color: Colors.primary[600],
    lineHeight: 20,
  },
  notesCard: {
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  notesText: {
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    color: Colors.neutral[700],
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orangeIcon: {
    backgroundColor: Colors.warning[100],
  },
  greenIcon: {
    backgroundColor: Colors.success[100],
  },
  redIcon: {
    backgroundColor: Colors.error[100],
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  membersCard: {
    gap: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  addMemberButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.primary[100],
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  memberEmail: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  memberStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  memberStatusAccepted: {
    backgroundColor: Colors.success[100],
  },
  memberStatusDeclined: {
    backgroundColor: Colors.error[100],
  },
  memberStatusPending: {
    backgroundColor: Colors.neutral[100],
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  memberStatusTextAccepted: {
    color: Colors.success[700],
  },
  memberStatusTextDeclined: {
    color: Colors.error[700],
  },
  memberStatusTextPending: {
    color: Colors.neutral[600],
  },
});
