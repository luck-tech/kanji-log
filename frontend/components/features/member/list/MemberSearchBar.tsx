import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/constants';

interface MemberSearchBarProps extends BaseComponentProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddPress: () => void;
}

/**
 * メンバー検索バー - 検索入力とメンバー追加ボタン
 */
export const MemberSearchBar: React.FC<MemberSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onAddPress,
  style,
  testID,
}) => {
  return (
    <View style={[styles.searchContainer, style]} testID={testID}>
      <Input
        placeholder="名前、部署で検索"
        value={searchQuery}
        onChangeText={onSearchChange}
        leftIcon={
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.neutral[500]}
          />
        }
        containerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInputText}
      />
      <TouchableOpacity
        onPress={onAddPress}
        style={styles.addButton}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
    minWidth: 0,
  },
  searchInputText: {
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
