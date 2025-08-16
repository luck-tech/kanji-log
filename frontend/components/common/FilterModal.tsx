import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './Card';
import { Button } from './Button';
import { PriceRangeSlider } from './PriceRangeSlider';

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

const AVAILABLE_AREAS = ['渋谷区', '新宿区', '港区', '千代田区', '中央区', '品川区'];
const AVAILABLE_PURPOSES = [
  { key: 'celebration', label: 'お祝い' },
  { key: 'farewell', label: '送別会' },
  { key: 'welcome', label: '歓迎会' },
  { key: 'team_building', label: 'チームビルディング' },
  { key: 'casual', label: '親睦会' },
  { key: 'other', label: 'その他' },
];
const AVAILABLE_GENRES = ['居酒屋', 'イタリアン', 'フレンチ', '中華料理', '和食', 'カフェ'];

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
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (type: 'areas' | 'purposes' | 'genres', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value],
    }));
  };

  const updatePriceRange = (min: number, max: number) => {
    setFilters(prev => ({
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
    return filters.areas.length + filters.purposes.length + filters.genres.length +
      (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0);
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
    <View className="flex-row flex-wrap gap-2 mt-3">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        return (
          <TouchableOpacity
            key={item}
            onPress={() => onToggle(item)}
            className={`px-3 py-2 rounded-full border ${
              isSelected
                ? 'bg-primary-100 border-primary-500'
                : 'bg-neutral-50 border-neutral-200'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-primary-700' : 'text-neutral-600'
              }`}
            >
              {isSelected ? '✓ ' : ''}{item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPurposeChips = () => (
    <View className="flex-row flex-wrap gap-2 mt-3">
      {AVAILABLE_PURPOSES.map((purpose) => {
        const isSelected = filters.purposes.includes(purpose.key);
        return (
          <TouchableOpacity
            key={purpose.key}
            onPress={() => toggleFilter('purposes', purpose.key)}
            className={`px-3 py-2 rounded-full border ${
              isSelected
                ? 'bg-primary-100 border-primary-500'
                : 'bg-neutral-50 border-neutral-200'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-primary-700' : 'text-neutral-600'
              }`}
            >
              {isSelected ? '✓ ' : ''}{purpose.label}
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
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-neutral-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-neutral-900">フィルター</Text>
              {getActiveFilterCount() > 0 && (
                <View className="bg-primary-600 rounded-full px-2 py-1 min-w-6 justify-center items-center">
                  <Text className="text-xs font-bold text-white">
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={clearAllFilters} className="p-2 -mr-2">
              <Text className="text-primary-600 font-semibold">クリア</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6 gap-4">
            {/* エリア別フィルター */}
            <Card variant="elevated" shadow="soft">
              <TouchableOpacity
                onPress={() => toggleSection('areas')}
                className="flex-row justify-between items-center"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Text className="text-lg">📍</Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">エリア別</Text>
                  {filters.areas.length > 0 && (
                    <View className="bg-primary-100 rounded-full px-2 py-1">
                      <Text className="text-xs font-bold text-primary-700">
                        {filters.areas.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.areas ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
              {expandedSections.areas &&
                renderFilterChips(AVAILABLE_AREAS, filters.areas, (item) =>
                  toggleFilter('areas', item)
                )}
            </Card>

            {/* 目的別フィルター */}
            <Card variant="elevated" shadow="soft">
              <TouchableOpacity
                onPress={() => toggleSection('purposes')}
                className="flex-row justify-between items-center"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
                    <Text className="text-lg">🎯</Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">目的別</Text>
                  {filters.purposes.length > 0 && (
                    <View className="bg-primary-100 rounded-full px-2 py-1">
                      <Text className="text-xs font-bold text-primary-700">
                        {filters.purposes.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.purposes ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
              {expandedSections.purposes && renderPurposeChips()}
            </Card>

            {/* ジャンル別フィルター */}
            <Card variant="elevated" shadow="soft">
              <TouchableOpacity
                onPress={() => toggleSection('genres')}
                className="flex-row justify-between items-center"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
                    <Text className="text-lg">🍽️</Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">ジャンル別</Text>
                  {filters.genres.length > 0 && (
                    <View className="bg-primary-100 rounded-full px-2 py-1">
                      <Text className="text-xs font-bold text-primary-700">
                        {filters.genres.length}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.genres ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
              {expandedSections.genres &&
                renderFilterChips(AVAILABLE_GENRES, filters.genres, (item) =>
                  toggleFilter('genres', item)
                )}
            </Card>

            {/* 価格帯フィルター */}
            <Card variant="elevated" shadow="soft">
              <TouchableOpacity
                onPress={() => toggleSection('price')}
                className="flex-row justify-between items-center"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-yellow-100 justify-center items-center">
                    <Text className="text-lg">💰</Text>
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">価格帯</Text>
                  {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
                    <View className="bg-primary-100 rounded-full px-2 py-1">
                      <Text className="text-xs font-bold text-primary-700">設定済み</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSections.price ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
              {expandedSections.price && (
                <View className="mt-4">
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
        <View className="px-6 py-4 bg-white border-t border-neutral-200">
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
