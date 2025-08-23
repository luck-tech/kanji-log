import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingItemContentProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const SettingItemContent: React.FC<SettingItemContentProps> = ({
  title,
  description,
  textColor = Colors.neutral[900],
  showArrow = false,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.neutral[400]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
});
