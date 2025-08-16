import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { FilterModal, FilterOptions } from '@/components/common/FilterModal';
import { ActiveFilters } from '@/components/common/ActiveFilters';
import { SharedRecord, EventPurpose } from '@/types';

// Mock data with additional filter data
const mockSharedRecords: SharedRecord[] = [
	{
		id: '1',
		eventLog: {
			id: '1',
			eventId: '1',
			organizerId: '2',
			rating: 4.5,
			notes:
				'雰囲気が良くて料理も美味しかった。予約が取りやすく、大人数でも対応してくれる。',
			totalCost: 25000,
			costPerPerson: 5000,
			venue: {
				name: '居酒屋花月',
				address: '東京都渋谷区',
				phone: '03-1234-5678',
				genre: '居酒屋',
				area: '渋谷区',
			},
			isShared: true,
			createdAt: '2024-01-20',
		},
		event: {
			title: '新年会',
			purpose: 'celebration',
		},
		organizer: {
			name: '田中幹事',
		},
	},
	{
		id: '2',
		eventLog: {
			id: '2',
			eventId: '2',
			organizerId: '3',
			rating: 4.0,
			notes:
				'コスパが良く、若手にも優しい価格帯。カジュアルな雰囲気で話しやすい。',
			totalCost: 18000,
			costPerPerson: 3600,
			venue: {
				name: 'イタリアン ROSSO',
				address: '東京都新宿区',
				genre: 'イタリアン',
				area: '新宿区',
			},
			isShared: true,
			createdAt: '2024-01-15',
		},
		event: {
			title: '部署飲み会',
			purpose: 'team_building',
		},
		organizer: {
			name: '佐藤部長',
		},
	},
	{
		id: '3',
		eventLog: {
			id: '3',
			eventId: '3',
			organizerId: '4',
			rating: 3.8,
			notes:
				'フレンドリーなスタッフで、歓迎会にピッタリ。食事も美味しくボリューム満点。',
			totalCost: 15000,
			costPerPerson: 3000,
			venue: {
				name: '中華料理 龍園',
				address: '東京都港区',
				genre: '中華料理',
				area: '港区',
			},
			isShared: true,
			createdAt: '2024-01-10',
		},
		event: {
			title: '歓迎会',
			purpose: 'welcome',
		},
		organizer: {
			name: '鈴木課長',
		},
	},
	{
		id: '4',
		eventLog: {
			id: '4',
			eventId: '4',
			organizerId: '5',
			rating: 4.2,
			notes:
				'送別会にふさわしい落ち着いた雰囲気。個室があり、ゆっくり話せる。',
			totalCost: 30000,
			costPerPerson: 6000,
			venue: {
				name: 'フレンチビストロ Le Petit',
				address: '東京都千代田区',
				genre: 'フレンチ',
				area: '千代田区',
			},
			isShared: true,
			createdAt: '2024-01-05',
		},
		event: {
			title: '送別会',
			purpose: 'farewell',
		},
		organizer: {
			name: '山田部長',
		},
	},
];



export default function RecordsScreen() {
	const [hasSharedRecord] = useState(true); // Changed to true to show records by default
	const [filteredRecords, setFilteredRecords] = useState(mockSharedRecords);
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
	const [filters, setFilters] = useState<FilterOptions>({
		areas: [],
		purposes: [],
		genres: [],
		priceRange: { min: 0, max: 10000 },
	});

	const handleUnlock = () => {
		console.log('Navigate to my events for sharing');
	};

	const handleRecordPress = (record: SharedRecord) => {
		console.log('View record details:', record.id);
	};

	const applyFilters = (newFilters: FilterOptions) => {
		let filtered = mockSharedRecords;

		// Area filter
		if (newFilters.areas.length > 0) {
			filtered = filtered.filter(record =>
				newFilters.areas.includes(record.eventLog.venue.area || '')
			);
		}

		// Purpose filter
		if (newFilters.purposes.length > 0) {
			filtered = filtered.filter(record =>
				newFilters.purposes.includes(record.event.purpose)
			);
		}

		// Genre filter
		if (newFilters.genres.length > 0) {
			filtered = filtered.filter(record =>
				newFilters.genres.includes(record.eventLog.venue.genre || '')
			);
		}

		// Price range filter
		if (newFilters.priceRange.min > 0 || newFilters.priceRange.max < 10000) {
			filtered = filtered.filter(record =>
				record.eventLog.costPerPerson >= newFilters.priceRange.min &&
				record.eventLog.costPerPerson <= newFilters.priceRange.max
			);
		}

		setFilteredRecords(filtered);
		setFilters(newFilters);
	};

	const removeFilter = (type: 'areas' | 'purposes' | 'genres' | 'price', value?: string) => {
		const newFilters = { ...filters };

		if (type === 'price') {
			newFilters.priceRange = { min: 0, max: 10000 };
		} else if (value) {
			newFilters[type] = newFilters[type].filter(item => item !== value);
		}

		applyFilters(newFilters);
	};

	const clearAllFilters = () => {
		const emptyFilters = {
			areas: [],
			purposes: [],
			genres: [],
			priceRange: { min: 0, max: 10000 },
		};
		applyFilters(emptyFilters);
	};

	const getActiveFilterCount = () => {
		return filters.areas.length + filters.purposes.length + filters.genres.length +
			(filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0);
	};

	const getPurposeLabel = (purpose: EventPurpose): string => {
		const purposeMap = {
			welcome: '歓迎会',
			farewell: '送別会',
			celebration: 'お祝い',
			team_building: 'チームビルディング',
			casual: '親睦会',
			other: 'その他',
		};
		return purposeMap[purpose] || 'その他';
	};

	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Ionicons
					key={i}
					name="star"
					size={14}
					color="#f59e0b"
				/>
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Ionicons
					key="half"
					name="star-half"
					size={14}
					color="#f59e0b"
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#d1d5db" />
			);
		}

		return <View className="flex-row gap-0.5">{stars}</View>;
	};

	return (
		<View className="flex-1">
			{/* Background */}
			<LinearGradient
				colors={['#f8fafc', '#f1f5f9']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="absolute inset-0"
			/>

			<SafeAreaView className="flex-1">
				<Header
					title="みんなの記録"
					subtitle="他の幹事が共有した貴重な経験とナレッジ"
					variant="gradient"
				/>

				{!hasSharedRecord ? (
					/* Unlock Screen */
					<ScrollView
						className="flex-1 px-6"
						contentContainerStyle={{ paddingTop: 40, paddingBottom: 120 }}
						showsVerticalScrollIndicator={false}
					>
						<View className="items-center">
							<LinearGradient
								colors={['#f59e0b', '#d97706']}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								className="w-24 h-24 rounded-3xl justify-center items-center mb-8"
							>
								<Ionicons name="lock-closed" size={48} color="white" />
							</LinearGradient>

							<Text className="text-2xl font-bold text-neutral-900 text-center mb-2">
								記録を共有して、
							</Text>
							<Text className="text-2xl font-bold text-neutral-900 text-center mb-6">
								他の幹事のナレッジを閲覧しよう
							</Text>

							<Text className="text-base text-neutral-600 text-center leading-6 mb-8 max-w-sm">
								あなたの終了済みイベントの記録を1つ以上共有すると、他の幹事が投稿した貴重な情報にアクセスできます。
							</Text>

							<Card variant="gradient" shadow="large" animated={true} className="w-full mb-8">
								<Text className="text-lg font-bold text-neutral-900 mb-4">
									アクセスできる情報
								</Text>
								<View className="gap-4">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-warning-100 justify-center items-center">
											<Ionicons name="star" size={20} color="#f59e0b" />
										</View>
										<Text className="text-base text-neutral-700 flex-1">お店の評価とレビュー</Text>
									</View>
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-success-100 justify-center items-center">
											<Ionicons name="cash-outline" size={20} color="#10b981" />
										</View>
										<Text className="text-base text-neutral-700 flex-1">予算と費用の参考情報</Text>
									</View>
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-primary-100 justify-center items-center">
											<Ionicons name="location-outline" size={20} color="#0284c7" />
										</View>
										<Text className="text-base text-neutral-700 flex-1">エリア別のおすすめ店舗</Text>
									</View>
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-accent-100 justify-center items-center">
											<Ionicons name="share-social-outline" size={20} color="#ec7c30" />
										</View>
										<Text className="text-base text-neutral-700 flex-1">イベント企画のコツ</Text>
									</View>
								</View>
							</Card>

							<Button
								title="記録を共有する"
								onPress={handleUnlock}
								size="lg"
								variant="gradient"
								fullWidth
								icon={<Ionicons name="lock-open-outline" size={20} color="white" />}
								className="mb-6"
							/>

							<Text className="text-sm text-neutral-500 text-center leading-5 max-w-xs">
								共有する記録は、店舗情報と評価のみ表示され、個人情報は一切公開されません。
							</Text>
						</View>
					</ScrollView>
				) : (
					/* Records List */
					<View className="flex-1">
						{/* Filter Button */}
						<View className="px-6 py-4">
							<TouchableOpacity
								onPress={() => setIsFilterModalVisible(true)}
								className="flex-row items-center justify-center py-3 px-4 bg-white rounded-2xl shadow-soft border border-neutral-200"
								activeOpacity={0.8}
							>
								<Ionicons name="options-outline" size={20} color="#0284c7" />
								<Text className="text-base font-semibold text-primary-600 ml-2">
									フィルター
								</Text>
								{getActiveFilterCount() > 0 && (
									<View className="bg-primary-600 rounded-full px-2 py-1 ml-2 min-w-6 justify-center items-center">
										<Text className="text-xs font-bold text-white">
											{getActiveFilterCount()}
										</Text>
									</View>
								)}
							</TouchableOpacity>
						</View>

						{/* Active Filters */}
						<ActiveFilters
							filters={filters}
							onRemoveFilter={removeFilter}
							onClearAll={clearAllFilters}
						/>

						{/* Results Count */}
						<View className="px-6 py-2">
							<Text className="text-sm text-neutral-500">
								{filteredRecords.length}件の記録が見つかりました
							</Text>
						</View>

						<ScrollView
							className="flex-1 px-6"
							contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
							showsVerticalScrollIndicator={false}
						>
							<View className="gap-4">
								{filteredRecords.map((record, index) => (
									<TouchableOpacity
										key={record.id}
										onPress={() => handleRecordPress(record)}
										activeOpacity={0.8}
										className="animate-fade-in"
										style={{ animationDelay: `${index * 100}ms` }}
									>
										<Card variant="elevated" shadow="large" animated={true}>
											<View className="flex-row justify-between items-start mb-4">
												<View className="flex-1 mr-4">
													<Text className="text-xl font-bold text-neutral-900 mb-2">
														{record.eventLog.venue.name}
													</Text>
													<View className="flex-row items-center gap-3 mb-1">
														{renderStars(record.eventLog.rating)}
														<Text className="text-base text-neutral-600 font-semibold">
															{record.eventLog.rating.toFixed(1)}
														</Text>
													</View>
												</View>

												<View className="px-3 py-1.5 rounded-full bg-primary-100">
													<Text className="text-sm font-semibold text-primary-700">
														{getPurposeLabel(record.event.purpose)}
													</Text>
												</View>
											</View>

											<Text className="text-base text-neutral-700 leading-6 mb-4" numberOfLines={2}>
												{record.eventLog.notes}
											</Text>

											<View className="flex-row gap-6 mb-4">
												<View className="flex-row items-center gap-2">
													<View className="p-2 rounded-xl bg-success-100">
														<Ionicons name="cash-outline" size={16} color="#10b981" />
													</View>
													<Text className="text-base text-neutral-700 font-medium">
														¥{record.eventLog.costPerPerson.toLocaleString()}/人
													</Text>
												</View>

												<View className="flex-row items-center gap-2">
													<View className="p-2 rounded-xl bg-neutral-100">
														<Ionicons name="location-outline" size={16} color="#64748b" />
													</View>
													<Text className="text-base text-neutral-700">
														{record.eventLog.venue.address}
													</Text>
												</View>
											</View>

											<View className="pt-4 border-t border-neutral-200 flex-row justify-between items-center">
												<Text className="text-sm text-neutral-500">
													{record.organizer.name}さんの記録
												</Text>
												<Ionicons name="chevron-forward" size={20} color="#94a3b8" />
											</View>
										</Card>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>

						{/* Filter Modal */}
						<FilterModal
							isVisible={isFilterModalVisible}
							onClose={() => setIsFilterModalVisible(false)}
							onApply={applyFilters}
							initialFilters={filters}
						/>
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}


