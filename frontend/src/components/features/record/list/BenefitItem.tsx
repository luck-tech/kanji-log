import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '@/constants';

interface BenefitItemProps extends BaseComponentProps {
  icon: string;
  text: string;
  iconColor: string;
  backgroundColor: string;
}

/**
 * 個別メリット項目 - メリット一覧の個別アイテム
 */
export const BenefitItem: React.FC<BenefitItemProps> = ({
  icon,
  text,
  iconColor,
  backgroundColor,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
});
