import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  style?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  style,
}) => {
  return (
    <View style={[styles.emptyState, style]}>
      <Ionicons name={icon} size={48} color={Colors.gray[400]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.padding.xl,
  },
  title: {
    ...Typography.h4,
    color: Colors.gray[600],
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body2,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
