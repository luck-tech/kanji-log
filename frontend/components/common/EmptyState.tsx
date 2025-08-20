import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

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
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={48} color={Colors.gray[400]} />
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
    paddingVertical: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[600],
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
