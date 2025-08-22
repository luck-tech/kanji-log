import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { Card } from '../../../common/ui';
import { usePressAnimation } from '../../../common/ui/Animations';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Member } from '../../../../types/features/member';
import { Colors } from '@/constants';

interface MemberCardProps extends BaseComponentProps {
  member: Member;
  onPress: (member: Member) => void;
}

/**
 * メンバーカード - 個別メンバー表示カード
 */
export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onPress,
  style,
  testID,
}) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      <TouchableOpacity
        onPress={() => onPress(member)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Card variant="elevated" shadow="none">
          <View style={styles.memberCard}>
            {/* Member Avatar */}
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>
                {member.name.charAt(0)}
              </Text>
            </View>

            {/* Member Info */}
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.department && (
                <Text style={styles.memberDepartment}>{member.department}</Text>
              )}
            </View>

            {/* Arrow */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.neutral[400]}
            />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  memberDepartment: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
});
