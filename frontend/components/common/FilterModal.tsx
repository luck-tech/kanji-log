import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Button } from './Button';
import { PriceRangeSlider } from './PriceRangeSlider';
import { Colors } from '@/constants/Colors';

export interface FilterOptions {
  areas: string[];
  purposes: string[];
  genres: string[];
  priceRange: { min: number; max: number };
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

const AVAILABLE_AREAS = [
  '渋谷区',
  '新宿区',
  '港区',
  '千代田区',
  '中央区',
  '品川区',
];
const AVAILABLE_PURPOSES = [
  { key: 'celebration', label: 'お祝い' },
  { key: 'farewell', label: '送別会' },
  { key: 'welcome', label: '歓迎会' },
  { key: 'team_building', label: 'チームビルディング' },
  { key: 'casual', label: '親睦会' },
  { key: 'other', label: 'その他' },
];
const AVAILABLE_GENRES = [
  '居酒屋',
  'イタリアン',
  'フレンチ',
  '中華料理',
  '和食',
  'カフェ',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [expandedSections, setExpandedSections] = useState({
    areas: false,
    purposes: false,
    genres: false,
    price: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (
    type: 'areas' | 'purposes' | 'genres',
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const updatePriceRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      areas: [],
      purposes: [],
      genres: [],
      priceRange: { min: 0, max: 10000 },
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.areas.length +
      filters.purposes.length +
      filters.genres.length +
      (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0)
    );
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const renderFilterChips = (
    items: string[],
    selectedItems: string[],
    onToggle: (item: string) => void
  ) => (
    <View style={styles.chipsContainer}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        return (
          <TouchableOpacity
            key={item}
            onPress={() => onToggle(item)}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                isSelected
                  ? styles.chipTextSelected
                  : styles.chipTextUnselected,
              ]}
            >
              {isSelected ? '✓ ' : ''}
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPurposeChips = () => (
    <View style={styles.chipsContainer}>
      {AVAILABLE_PURPOSES.map((purpose) => {
        const isSelected = filters.purposes.includes(purpose.key);
        return (
          <TouchableOpacity
            key={purpose.key}
            onPress={() => toggleFilter('purposes', purpose.key)}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                isSelected
                  ? styles.chipTextSelected
                  : styles.chipTextUnselected,
              ]}
            >
              {isSelected ? '✓ ' : ''}
              {purpose.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={Colors.neutral[500]} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>フィルター</Text>
              {getActiveFilterCount() > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={clearAllFilters}
              style={styles.headerButton}
            >
              <Text style={styles.clearButtonText}>クリア</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* エリア別フィルター */}
            <Card variant="elevated" shadow="none">
              <TouchableOpacity
                onPress={() => toggleSection('areas')}
                style={styles.sectionHeader}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIcon, styles.blueIcon]}>
                    <Text style={styles.sectionEmoji}>📍</Text>
                  </View>
                  <Text style={styles.sectionTitle}>エリア別</Text>
                  {filters.areas.length > 0 && (
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>
                        {filters.areas.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.areas ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.neutral[500]}
                />
              </TouchableOpacity>
              {expandedSections.areas &&
                renderFilterChips(AVAILABLE_AREAS, filters.areas, (item) =>
                  toggleFilter('areas', item)
                )}
            </Card>

            {/* 目的別フィルター */}
            <Card variant="elevated" shadow="none">
              <TouchableOpacity
                onPress={() => toggleSection('purposes')}
                style={styles.sectionHeader}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIcon, styles.orangeIcon]}>
                    <Text style={styles.sectionEmoji}>🎯</Text>
                  </View>
                  <Text style={styles.sectionTitle}>目的別</Text>
                  {filters.purposes.length > 0 && (
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>
                        {filters.purposes.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={
                    expandedSections.purposes ? 'chevron-up' : 'chevron-down'
                  }
                  size={20}
                  color={Colors.neutral[500]}
                />
              </TouchableOpacity>
              {expandedSections.purposes && renderPurposeChips()}
            </Card>

            {/* ジャンル別フィルター */}
            <Card variant="elevated" shadow="none">
              <TouchableOpacity
                onPress={() => toggleSection('genres')}
                style={styles.sectionHeader}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIcon, styles.greenIcon]}>
                    <Text style={styles.sectionEmoji}>🍽️</Text>
                  </View>
                  <Text style={styles.sectionTitle}>ジャンル別</Text>
                  {filters.genres.length > 0 && (
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>
                        {filters.genres.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.genres ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.neutral[500]}
                />
              </TouchableOpacity>
              {expandedSections.genres &&
                renderFilterChips(AVAILABLE_GENRES, filters.genres, (item) =>
                  toggleFilter('genres', item)
                )}
            </Card>

            {/* 価格帯フィルター */}
            <Card variant="elevated" shadow="none">
              <TouchableOpacity
                onPress={() => toggleSection('price')}
                style={styles.sectionHeader}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View style={[styles.sectionIcon, styles.yellowIcon]}>
                    <Text style={styles.sectionEmoji}>💰</Text>
                  </View>
                  <Text style={styles.sectionTitle}>価格帯</Text>
                  {(filters.priceRange.min > 0 ||
                    filters.priceRange.max < 10000) && (
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>設定済み</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.price ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.neutral[500]}
                />
              </TouchableOpacity>
              {expandedSections.price && (
                <View style={styles.priceRangeContainer}>
                  <PriceRangeSlider
                    min={filters.priceRange.min}
                    max={filters.priceRange.max}
                    onValueChange={updatePriceRange}
                  />
                </View>
              )}
            </Card>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={`フィルターを適用 (${getActiveFilterCount()})`}
            onPress={handleApply}
            variant="gradient"
            size="lg"
            fullWidth
            disabled={getActiveFilterCount() === 0}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  headerBadge: {
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  clearButtonText: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueIcon: {
    backgroundColor: '#dbeafe',
  },
  orangeIcon: {
    backgroundColor: '#fed7aa',
  },
  greenIcon: {
    backgroundColor: '#dcfce7',
  },
  yellowIcon: {
    backgroundColor: '#fef3c7',
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  sectionBadge: {
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  chipUnselected: {
    backgroundColor: Colors.neutral[50],
    borderColor: Colors.neutral[200],
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primary[700],
  },
  chipTextUnselected: {
    color: Colors.neutral[600],
  },
  priceRangeContainer: {
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
});
