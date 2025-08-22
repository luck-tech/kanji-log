import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StaggeredList } from '../../../common/ui/Animations';
import { MemberCard } from './MemberCard';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Member } from '../../../../types/features/member';

interface MembersListProps extends BaseComponentProps {
  members: Member[];
  onMemberPress: (member: Member) => void;
  animationKey?: number;
}

/**
 * メンバーリスト - メンバーカードのリスト表示
 */
export const MembersList: React.FC<MembersListProps> = ({
  members,
  onMemberPress,
  animationKey = 0,
  style,
  testID,
}) => {
  return (
    <View style={[styles.membersList, style]} testID={testID}>
      <StaggeredList key={animationKey} itemDelay={80}>
        {members.map((member, index) => (
          <MemberCard key={member.id} member={member} onPress={onMemberPress} />
        ))}
      </StaggeredList>
    </View>
  );
};

const styles = StyleSheet.create({
  membersList: {
    gap: 12,
  },
});
