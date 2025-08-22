import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, Button } from '@/components/common';
import { Colors } from '@/constants';

interface MemberActionsCardProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const MemberActionsCard: React.FC<MemberActionsCardProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <Card variant="elevated" shadow="none">
      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.warningIcon]}>
            <Ionicons name="settings" size={20} color={Colors.warning[500]} />
          </View>
          <Text style={styles.sectionTitle}>アクション</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="プロフィールを編集"
            onPress={onEdit}
            variant="primary"
            size="md"
            fullWidth
            icon={<Ionicons name="create-outline" size={18} color="white" />}
          />

          <Button
            title="メンバーを削除"
            onPress={onDelete}
            variant="outline"
            size="md"
            fullWidth
            icon={
              <Ionicons
                name="trash-outline"
                size={18}
                color={Colors.error[500]}
              />
            }
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    backgroundColor: Colors.warning[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  actionsContainer: {
    gap: 12,
  },
});
