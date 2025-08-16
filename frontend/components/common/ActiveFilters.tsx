import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions } from './FilterModal';

interface ActiveFiltersProps {
	filters: FilterOptions;
	onRemoveFilter: (type: 'areas' | 'purposes' | 'genres' | 'price', value?: string) => void;
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
		const colors = {
			area: 'bg-blue-100 border-blue-200',
			purpose: 'bg-orange-100 border-orange-200',
			genre: 'bg-green-100 border-green-200',
			price: 'bg-yellow-100 border-yellow-200',
		};

		return (
			<View className={`flex-row items-center px-3 py-2 rounded-full border ${colors[type]} mr-2 mb-2`}>
				<Text className="text-sm font-medium text-neutral-700 mr-1">
					{label}
				</Text>
				<TouchableOpacity
					onPress={onRemove}
					className="w-4 h-4 rounded-full bg-neutral-400 justify-center items-center"
					activeOpacity={0.7}
				>
					<Ionicons name="close" size={10} color="white" />
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View className="px-6 py-3 bg-white border-b border-neutral-100">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="flex-row"
				contentContainerStyle={{ paddingRight: 24 }}
			>
				<View className="flex-row flex-wrap">
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
						className="flex-row items-center px-3 py-2 rounded-full bg-neutral-100 border border-neutral-200"
						activeOpacity={0.7}
					>
						<Text className="text-sm font-medium text-neutral-600">
							すべてクリア
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};
