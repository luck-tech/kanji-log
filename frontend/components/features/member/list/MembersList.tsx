import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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
    <ScrollView
      style={[styles.membersList, style]}
      contentContainerStyle={styles.membersListContent}
      testID={testID}
      showsVerticalScrollIndicator={false}
    >
      <StaggeredList key={animationKey} itemDelay={80}>
        {members.map((member, index) => (
          <View key={member.id} style={styles.memberCardContainer}>
            <MemberCard member={member} onPress={onMemberPress} />
          </View>
        ))}
      </StaggeredList>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  membersList: {
    flex: 1,
  },
  membersListContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // FABとの重複回避
  },
  memberCardContainer: {
    marginBottom: 12,
  },
});
