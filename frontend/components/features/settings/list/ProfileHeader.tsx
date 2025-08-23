import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EditProfileButton } from './EditProfileButton';
import { FollowButton } from './FollowButton';
import { ProfileHeaderProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  isOwnProfile,
  isFollowing = false,
  onEditProfile,
  onFollowToggle,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarGradient}
      >
        <Ionicons name="person" size={36} color="white" />
      </LinearGradient>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{userData.name}</Text>
      </View>

      {isOwnProfile
        ? onEditProfile && <EditProfileButton onPress={onEditProfile} />
        : onFollowToggle && (
            <FollowButton isFollowing={isFollowing} onPress={onFollowToggle} />
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
});
