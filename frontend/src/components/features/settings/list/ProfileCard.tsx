import React from 'react';
import { Card } from '@/components/common/ui/Card';
import { ProfileHeader } from './ProfileHeader';
import { ProfileDetails } from './ProfileDetails';
import { FollowStats } from './FollowStats';
import { ProfileCardProps } from '@/types/features/setting';

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userData,
  isOwnProfile,
  isFollowing,
  onEditProfile,
  onFollowToggle,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="medium" style={style} testID={testID}>
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onEditProfile={onEditProfile}
        onFollowToggle={onFollowToggle}
      />

      <ProfileDetails userData={userData} />

      <FollowStats
        followCount={userData.followCount}
        followerCount={userData.followerCount}
      />
    </Card>
  );
};
