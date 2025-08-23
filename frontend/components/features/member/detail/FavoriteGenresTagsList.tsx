import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/constants';

interface FavoriteGenresTagsListProps extends BaseComponentProps {
  genres: string[];
}

/**
 * 好みジャンルタグリスト - 好きな料理ジャンルのタグ表示
 */
export const FavoriteGenresTagsList: React.FC<FavoriteGenresTagsListProps> = ({
  genres,
  style,
  testID,
}) => {
  return (
    <View style={[styles.tagsContainer, style]} testID={testID}>
      {genres.map((genre, index) => (
        <View key={index} style={styles.genreTag}>
          <Text style={styles.genreTagText}>{genre}</Text>
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
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.primary[100],
    borderRadius: 20,
  },
  genreTagText: {
    color: Colors.primary[700],
    fontWeight: '500',
    fontSize: 14,
  },
});
