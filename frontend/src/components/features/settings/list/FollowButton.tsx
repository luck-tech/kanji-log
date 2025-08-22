import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FollowButtonProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onPress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFollowing ? styles.followingButton : styles.notFollowingButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text
        style={[
          styles.buttonText,
          isFollowing ? styles.followingText : styles.notFollowingText,
        ]}
      >
        {isFollowing ? 'フォロー中' : 'フォロー'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.neutral[300],
  },
  notFollowingButton: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followingText: {
    color: Colors.neutral[700],
  },
  notFollowingText: {
    color: 'white',
  },
});
