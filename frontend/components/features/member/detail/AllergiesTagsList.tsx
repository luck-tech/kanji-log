import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '@/constants';

interface AllergiesTagsListProps extends BaseComponentProps {
  allergies: string[];
}

/**
 * アレルギータグリスト - アレルギー情報のタグ表示
 */
export const AllergiesTagsList: React.FC<AllergiesTagsListProps> = ({
  allergies,
  style,
  testID,
}) => {
  return (
    <View style={[styles.tagsContainer, style]} testID={testID}>
      {allergies.map((allergy, index) => (
        <View key={index} style={styles.allergyTag}>
          <Text style={styles.allergyTagText}>{allergy}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.error[100],
    borderRadius: 20,
  },
  allergyTagText: {
    color: Colors.error[700],
    fontWeight: '500',
    fontSize: 14,
  },
});
