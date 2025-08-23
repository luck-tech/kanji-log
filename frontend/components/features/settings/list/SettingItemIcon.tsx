import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SettingItemIconProps } from '@/types/features/setting';

export const SettingItemIcon: React.FC<SettingItemIconProps> = ({
  icon,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
