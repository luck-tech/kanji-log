import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { Event } from '@/types/features/event';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/utils/constants/design/colors';

interface EventMembersListProps extends BaseComponentProps {
  event: Event;
  onMemberPress: (memberId: string) => void;
  onAddMember?: () => void;
}

/**
 * イベントメンバー一覧 - メンバー情報とステータス表示を組み合わせた複合コンポーネント
 */
export const EventMembersList: React.FC<EventMembersListProps> = ({
  event,
  onMemberPress,
  onAddMember,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.membersCard}>
        <View style={styles.membersHeader}>
          <Text style={styles.membersTitle}>
            {event.status === 'completed' ? '参加者' : '参加メンバー'} (
            {event.members.length}名)
          </Text>
          {event.status !== 'completed' && onAddMember && (
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={onAddMember}
            >
              <Ionicons name="person-add" size={18} color="#0284c7" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.membersList}>
          {event.members.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              onPress={() => onMemberPress(member.id)}
              activeOpacity={0.7}
              style={styles.memberRow}
            >
              <View style={styles.memberAvatar}>
                <Text style={styles.memberAvatarText}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
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
              <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.neutral[50],
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  memberEmail: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  memberStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  memberStatusAccepted: {
    backgroundColor: Colors.success[100],
  },
  memberStatusDeclined: {
    backgroundColor: Colors.error[100],
  },
  memberStatusPending: {
    backgroundColor: Colors.neutral[200],
  },
  memberStatusText: {
    fontSize: 12,
    fontWeight: '600',
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
