import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '@/constants';

interface RecordFilterButtonProps extends BaseComponentProps {
  onPress: () => void;
  activeFilterCount: number;
}

/**
 * レコードフィルターボタン - フィルター機能呼び出し
 */
export const RecordFilterButton: React.FC<RecordFilterButtonProps> = ({
  onPress,
  activeFilterCount,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        activeFilterCount > 0 && styles.activeButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <Ionicons
        name="filter-outline"
        size={20}
        color={activeFilterCount > 0 ? 'white' : Colors.neutral[600]}
      />
      <Text style={[styles.text, activeFilterCount > 0 && styles.activeText]}>
        フィルター
        {activeFilterCount > 0 && ` (${activeFilterCount})`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.neutral[100],
    gap: 8,
  },
  activeButton: {
    backgroundColor: Colors.primary[600],
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  activeText: {
    color: 'white',
  },
});
