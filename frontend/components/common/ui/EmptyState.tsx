import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/utils/constants/design/colors';
import { Layout } from '@/utils/constants/design/layout';
import { EmptyStateProps } from '@/types/common/ui';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  style,
  testID,
}) => {
  // アイコン名のバリデーション関数
  const isValidIconName = (
    name: string
  ): name is keyof typeof Ionicons.glyphMap => {
    return name in Ionicons.glyphMap;
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {isValidIconName(icon) && (
        <Ionicons name={icon} size={48} color={Colors.neutral[400]} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
