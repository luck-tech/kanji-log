import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/common/ui/Card';
import { SettingItem } from './SettingItem';
import { SettingsGroupProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  items,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Card variant="elevated" shadow="soft">
        {items.map((item, index) => (
          <SettingItem
            key={item.id}
            item={item}
            style={index === items.length - 1 ? styles.lastItem : undefined}
          />
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 8,
    marginLeft: 4,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
