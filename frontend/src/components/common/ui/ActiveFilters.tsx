import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../utils/constants/design/colors';
import { Layout } from '../../../utils/constants/design/layout';
import {
  PURPOSE_LABELS,
  GENRE_LABELS,
} from '../../../utils/constants/business/labels';
import { BaseComponentProps } from '../../../types/common/ui';
import { FilterOptions } from '../../../types/common/base';

interface ActiveFiltersProps extends BaseComponentProps {
  filters: FilterOptions;
  onRemoveFilter: (
    type: 'areas' | 'purposes' | 'genres' | 'price',
    value?: string
  ) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  style,
  testID,
}) => {
  const hasActiveFilters =
    filters.areas.length > 0 ||
    filters.purposes.length > 0 ||
    filters.genres.length > 0 ||
    filters.price.min > 0 ||
    filters.price.max < 10000;

  if (!hasActiveFilters) {
    return null;
  }

  const renderFilterChip = (
    label: string,
    onRemove: () => void,
    color: string = Colors.primary[500]
  ) => (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Ionicons name="close" size={14} color={color} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>適用中のフィルター</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
          <Text style={styles.clearButtonText}>すべてクリア</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Areas */}
        {filters.areas.map((area) =>
          renderFilterChip(
            area,
            () => onRemoveFilter('areas', area),
            Colors.primary[500]
          )
        )}

        {/* Purposes */}
        {filters.purposes.map((purpose) =>
          renderFilterChip(
            PURPOSE_LABELS[purpose] || purpose,
            () => onRemoveFilter('purposes', purpose),
            Colors.success[500]
          )
        )}

        {/* Genres */}
        {filters.genres.map((genre) =>
          renderFilterChip(
            GENRE_LABELS[genre] || genre,
            () => onRemoveFilter('genres', genre),
            Colors.secondary[500]
          )
        )}

        {/* Price */}
        {(filters.price.min > 0 || filters.price.max < 10000) &&
          renderFilterChip(
            `¥${filters.price.min.toLocaleString()} - ¥${filters.price.max.toLocaleString()}`,
            () => onRemoveFilter('price'),
            Colors.warning[500]
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Layout.padding.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.padding.md,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: Layout.padding.xs,
  },
  clearButtonText: {
    fontSize: 12,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  scrollView: {
    paddingLeft: Layout.padding.md,
  },
  scrollContent: {
    paddingRight: Layout.padding.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.full,
    paddingVertical: 6,
    paddingLeft: Layout.padding.sm,
    paddingRight: Layout.padding.xs,
    marginRight: Layout.spacing.xs,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: Layout.spacing.xs,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: Layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
