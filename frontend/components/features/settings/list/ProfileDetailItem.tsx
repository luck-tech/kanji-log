import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileDetailItemProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({
  icon,
  text,
  iconColor = Colors.neutral[500],
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: Colors.neutral[600],
    flex: 1,
  },
});
