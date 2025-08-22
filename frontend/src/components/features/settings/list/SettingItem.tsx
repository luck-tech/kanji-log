import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SettingItemIcon } from './SettingItemIcon';
import { SettingItemContent } from './SettingItemContent';
import { SettingItemProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const SettingItem: React.FC<SettingItemProps> = ({
  item,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={item.onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <SettingItemIcon icon={item.icon} />
      <SettingItemContent
        title={item.title}
        description={item.description}
        textColor={item.textColor}
        showArrow={item.showArrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
});
