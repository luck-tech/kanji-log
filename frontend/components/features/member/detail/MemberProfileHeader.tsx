import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Member } from '../../../../types/features/member';
import { Colors } from '@/constants';

interface MemberProfileHeaderProps extends BaseComponentProps {
  member: Pick<Member, 'name' | 'department'>;
}

/**
 * メンバープロフィールヘッダー - プロフィール概要表示
 */
export const MemberProfileHeader: React.FC<MemberProfileHeaderProps> = ({
  member,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.cardContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberDepartment}>
              {member.department || '部署未設定'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  memberDepartment: {
    color: Colors.neutral[600],
    fontSize: 16,
  },
});
