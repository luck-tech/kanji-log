import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/common';
import { Colors } from '@/constants';

interface MemberNotesCardProps {
  notes: string;
}

export const MemberNotesCard: React.FC<MemberNotesCardProps> = ({ notes }) => {
  return (
    <Card variant="elevated" shadow="none">
      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.accentIcon]}>
            <Ionicons
              name="document-text"
              size={20}
              color={Colors.accent[600]}
            />
          </View>
          <Text style={styles.sectionTitle}>メモ</Text>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{notes}</Text>
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
  accentIcon: {
    backgroundColor: Colors.accent[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  notesContainer: {
    padding: 16,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral[700],
  },
});
