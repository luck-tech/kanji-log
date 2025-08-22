import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';
import { BaseComponentProps } from '@/types/common/ui';

interface RecordsEmptyStateProps extends BaseComponentProps {
  message?: string;
}

export const RecordsEmptyState: React.FC<RecordsEmptyStateProps> = ({
  message = '該当する記録がありません',
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="document-text-outline"
          size={64}
          color={Colors.neutral[300]}
        />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subMessage}>条件を変更して再度検索してください</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
