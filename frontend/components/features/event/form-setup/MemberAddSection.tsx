import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Input } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { NewMember } from '@/types/features/event';
import { Colors } from '@/utils/constants/design/colors';

interface MemberAddSectionProps extends BaseComponentProps {
  newMembers: NewMember[];
  newMemberName: string;
  onNewMemberNameChange: (name: string) => void;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
}

/**
 * 新規参加者追加セクション - メンバー登録とリスト表示を組み合わせた複合コンポーネント
 */
export const MemberAddSection: React.FC<MemberAddSectionProps> = ({
  newMembers,
  newMemberName,
  onNewMemberNameChange,
  onAddMember,
  onRemoveMember,
  style,
  testID,
}) => {
  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }
    onAddMember();
  };

  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={20} color={Colors.primary[600]} />
          </View>
          <Text style={styles.sectionTitle}>新規参加者を追加</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{newMembers.length}人</Text>
          </View>
        </View>

        <Text style={styles.description}>
          フォームで回答を収集する新規参加者の名前を事前に登録できます（任意）
        </Text>

        {/* 名前入力 */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="新規参加者の名前"
              value={newMemberName}
              onChangeText={onNewMemberNameChange}
            />
          </View>
          <TouchableOpacity
            onPress={handleAddMember}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 追加済みメンバー一覧 */}
        {newMembers.length > 0 && (
          <View style={styles.memberList}>
            <Text style={styles.memberListTitle}>
              追加予定のメンバー ({newMembers.length}人)
            </Text>
            {newMembers.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <TouchableOpacity
                  onPress={() => onRemoveMember(member.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.error[500]}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  badge: {
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberList: {
    gap: 8,
  },
  memberListTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary[900],
  },
  deleteButton: {
    padding: 4,
  },
});
