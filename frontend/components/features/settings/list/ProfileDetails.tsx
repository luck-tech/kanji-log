import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileDetailItem } from './ProfileDetailItem';
import { ProfileDetailsProps } from '@/types/features/setting';

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  userData,
  style,
  testID,
}) => {
  const profileDetails = [
    {
      icon: 'person-outline',
      text: userData.gender,
    },
    {
      icon: 'location-outline',
      text: userData.prefecture,
    },
    {
      icon: 'calendar-outline',
      text: `${userData.joinDate}から利用開始`,
    },
  ];

  return (
    <View style={[styles.container, style]} testID={testID}>
      {profileDetails.map((detail, index) => (
        <ProfileDetailItem key={index} icon={detail.icon} text={detail.text} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
});
