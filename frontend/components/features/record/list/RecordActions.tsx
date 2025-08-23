import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/constants';

interface RecordActionsProps extends BaseComponentProps {
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  onUserPress: () => void;
}

/**
 * レコードアクション - いいねボタン等のアクション
 */
export const RecordActions: React.FC<RecordActionsProps> = ({
  likeCount,
  isLiked,
  onLike,
  onUserPress,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={isLiked ? Colors.error[500] : Colors.neutral[400]}
        />
        <Text style={[styles.likeText, isLiked && styles.likedText]}>
          {likeCount}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.userButton}
        onPress={onUserPress}
        activeOpacity={0.7}
      >
        <Ionicons name="person-outline" size={16} color={Colors.neutral[500]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 14,
    color: Colors.neutral[500],
    fontWeight: '500',
  },
  likedText: {
    color: Colors.error[500],
  },
  userButton: {
    padding: 4,
  },
});
