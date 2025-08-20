import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions } from './FilterModal';
import { Colors } from '@/constants/Colors';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (
    type: 'areas' | 'purposes' | 'genres' | 'price',
    value?: string
  ) => void;
  onClearAll: () => void;
}

const PURPOSE_LABELS: Record<string, string> = {
  celebration: 'お祝い',
  farewell: '送別会',
  welcome: '歓迎会',
  team_building: 'チームビルディング',
  casual: '親睦会',
  other: 'その他',
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const hasActiveFilters =
    filters.areas.length > 0 ||
    filters.purposes.length > 0 ||
    filters.genres.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 10000;

  if (!hasActiveFilters) {
    return null;
  }

  const renderFilterChip = (
    label: string,
    onRemove: () => void,
    type: 'area' | 'purpose' | 'genre' | 'price'
  ) => {
    const chipStyles = {
      area: styles.areaChip,
      purpose: styles.purposeChip,
      genre: styles.genreChip,
      price: styles.priceChip,
    };

    return (
      <View style={[styles.chipContainer, chipStyles[type]]}>
        <Text style={styles.chipText}>{label}</Text>
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={10} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <View style={styles.filtersWrapper}>
          {/* エリアフィルター */}
          {filters.areas.map((area) => (
            <View key={`area-${area}`}>
              {renderFilterChip(
                area,
                () => onRemoveFilter('areas', area),
                'area'
              )}
            </View>
          ))}

          {/* 目的フィルター */}
          {filters.purposes.map((purpose) => (
            <View key={`purpose-${purpose}`}>
              {renderFilterChip(
                PURPOSE_LABELS[purpose] || purpose,
                () => onRemoveFilter('purposes', purpose),
                'purpose'
              )}
            </View>
          ))}

          {/* ジャンルフィルター */}
          {filters.genres.map((genre) => (
            <View key={`genre-${genre}`}>
              {renderFilterChip(
                genre,
                () => onRemoveFilter('genres', genre),
                'genre'
              )}
            </View>
          ))}

          {/* 価格帯フィルター */}
          {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
            <View key="price-range">
              {renderFilterChip(
                `¥${filters.priceRange.min.toLocaleString()}-${filters.priceRange.max.toLocaleString()}`,
                () => onRemoveFilter('price'),
                'price'
              )}
            </View>
          )}

          {/* すべてクリアボタン */}
          <TouchableOpacity
            onPress={onClearAll}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>すべてクリア</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  scrollView: {
    flexDirection: 'row',
  },
  filtersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  areaChip: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[200],
  },
  purposeChip: {
    backgroundColor: Colors.accent[100],
    borderColor: Colors.accent[200],
  },
  genreChip: {
    backgroundColor: Colors.success[100],
    borderColor: Colors.success[200],
  },
  priceChip: {
    backgroundColor: Colors.warning[100],
    borderColor: Colors.warning[200],
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
    marginRight: 4,
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[600],
  },
});
