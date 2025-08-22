import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyState } from '../../../common/ui';
import { FadeInView } from '../../../common/ui/Animations';
import { BaseComponentProps } from '../../../../types/common/ui';

interface MembersEmptyStateProps extends BaseComponentProps {
  searchQuery: string;
}

/**
 * メンバー空状態 - メンバーがいない場合の表示
 */
export const MembersEmptyState: React.FC<MembersEmptyStateProps> = ({
  searchQuery,
  style,
  testID,
}) => {
  const title = searchQuery
    ? '該当するメンバーが見つかりません'
    : 'メンバーがいません';
  const description = searchQuery
    ? '検索条件を変更してお試しください'
    : '新しいメンバーを追加してメモしましょう';

  return (
    <View style={[styles.emptyContainer, style]} testID={testID}>
      <FadeInView delay={300}>
        <EmptyState
          icon="people-outline"
          title={title}
          description={description}
        />
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
});
