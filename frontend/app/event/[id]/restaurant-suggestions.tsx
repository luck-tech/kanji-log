import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';

interface Restaurant {
	id: string;
	name: string;
	genre: string;
	rating: number;
	budget: string;
	address: string;
	phone?: string;
	imageUrl?: string;
	recommendationReason: string;
	recommendationType: 'majority' | 'inclusive' | 'challenge';
	features: string[];
	mapUrl?: string;
	reservationUrl?: string;
}

const mockRestaurants: Restaurant[] = [
	{
		id: '1',
		name: '炭火焼鳥 鳥心',
		genre: '焼鳥・居酒屋',
		rating: 4.3,
		budget: '3,000〜4,000円',
		address: '東京都新宿区歌舞伎町1-2-3',
		phone: '03-1234-5678',
		recommendationReason: '全員が好む和食ジャンルで、アレルギー対応も充実',
		recommendationType: 'majority',
		features: ['個室あり', 'アレルギー対応', '飲み放題', '駅近5分'],
		mapUrl: 'https://maps.google.com/?q=炭火焼鳥+鳥心+新宿',
	},
	{
		id: '2',
		name: 'イタリアン BELLA VISTA',
		genre: 'イタリアン',
		rating: 4.1,
		budget: '4,000〜5,000円',
		address: '東京都新宿区西新宿2-1-1',
		phone: '03-2345-6789',
		recommendationReason: 'メニューの幅が広く、全員の好みに配慮できます',
		recommendationType: 'inclusive',
		features: ['眺望良好', 'ベジタリアン対応', 'ワイン豊富', '禁煙'],
		reservationUrl: 'https://example.com/reservation',
	},
	{
		id: '3',
		name: '韓国料理 ソウルキッチン',
		genre: '韓国料理',
		rating: 4.0,
		budget: '2,500〜3,500円',
		address: '東京都新宿区新宿3-4-5',
		phone: '03-3456-7890',
		recommendationReason: '話題の韓国料理で新しい体験を',
		recommendationType: 'challenge',
		features: ['チーズタッカルビ', 'K-POP', 'インスタ映え', 'コスパ良好'],
	},
];

export default function RestaurantSuggestionsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
	const [restaurants] = useState<Restaurant[]>(mockRestaurants);

	const handleBackPress = () => {
		router.back();
	};

	const handleRestaurantSelect = (restaurant: Restaurant) => {
		setSelectedRestaurant(restaurant);
	};

	const handleMakeReservation = () => {
		if (!selectedRestaurant) return;

		router.push(`/event/${id}/reservation-support?restaurantId=${selectedRestaurant.id}`);
	};

	const handleCallRestaurant = (phone: string) => {
		Linking.openURL(`tel:${phone}`);
	};

	const handleOpenMap = (mapUrl: string) => {
		Linking.openURL(mapUrl);
	};

	const handleOpenReservation = (url: string) => {
		Linking.openURL(url);
	};

	const getRecommendationTypeLabel = (type: string) => {
		const typeMap = {
			majority: '多数派満足型',
			inclusive: '全員配慮型',
			challenge: 'チャレンジ型',
		};
		return typeMap[type as keyof typeof typeMap] || type;
	};

	const getRecommendationTypeColor = (type: string) => {
		const colorMap = {
			majority: 'bg-blue-100 text-blue-700',
			inclusive: 'bg-green-100 text-green-700',
			challenge: 'bg-purple-100 text-purple-700',
		};
		return colorMap[type as keyof typeof colorMap] || 'bg-neutral-100 text-neutral-700';
	};

	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Ionicons key={i} name="star" size={16} color="#f59e0b" />
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Ionicons key="half" name="star-half" size={16} color="#f59e0b" />
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#d1d5db" />
			);
		}

		return <View className="flex-row gap-0.5">{stars}</View>;
	};

	return (
		<View className="flex-1 bg-neutral-50">
			<SafeAreaView className="flex-1">
				<Header
					title="レストラン提案"
					subtitle="AIが選んだおすすめのお店"
					variant="gradient"
					leftIcon="arrow-back"
					onLeftPress={handleBackPress}
				/>

				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<View className="p-6 gap-6">
						{/* 提案の説明 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-3">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center">
										<Ionicons name="sparkles" size={20} color="white" />
									</View>
									<Text className="text-lg font-bold text-white">
										AI分析結果
									</Text>
								</View>
								<Text className="text-white/90 leading-6">
									メンバーの好み、アレルギー情報、予算を分析して、{restaurants.length}つのお店を厳選しました。
									それぞれ異なるアプローチで選ばれています。
								</Text>
							</View>
						</Card>

						{/* レストラン一覧 */}
						<View className="gap-4">
							{restaurants.map((restaurant, index) => (
								<TouchableOpacity
									key={restaurant.id}
									onPress={() => handleRestaurantSelect(restaurant)}
									activeOpacity={0.8}
									className="animate-fade-in"
									style={{ animationDelay: `${index * 150}ms` }}
								>
									<Card
										variant={selectedRestaurant?.id === restaurant.id ? 'gradient' : 'elevated'}
										shadow="large"
										animated={true}
									>
										<View className="gap-4">
											{/* レストラン基本情報 */}
											<View className="flex-row justify-between items-start">
												<View className="flex-1 mr-4">
													<View className="flex-row items-center gap-3 mb-2">
														<Text className={`text-xl font-bold ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-neutral-900'
															}`}>
															{restaurant.name}
														</Text>
														{selectedRestaurant?.id === restaurant.id && (
															<View className="w-6 h-6 rounded-full bg-white/20 justify-center items-center">
																<Ionicons name="checkmark" size={14} color="white" />
															</View>
														)}
													</View>
													<View className="flex-row items-center gap-3 mb-2">
														{renderStars(restaurant.rating)}
														<Text className={`text-sm font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white/90' : 'text-neutral-600'
															}`}>
															{restaurant.rating} • {restaurant.genre}
														</Text>
													</View>
													<Text className={`text-base font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white/90' : 'text-neutral-700'
														}`}>
														予算: {restaurant.budget}
													</Text>
												</View>
												<View className={`px-3 py-1.5 rounded-full ${selectedRestaurant?.id === restaurant.id
														? 'bg-white/20'
														: getRecommendationTypeColor(restaurant.recommendationType)
													}`}>
													<Text className={`text-xs font-bold ${selectedRestaurant?.id === restaurant.id ? 'text-white' : ''
														}`}>
														{getRecommendationTypeLabel(restaurant.recommendationType)}
													</Text>
												</View>
											</View>

											{/* 推薦理由 */}
											<View className={`p-3 rounded-xl ${selectedRestaurant?.id === restaurant.id ? 'bg-white/10' : 'bg-primary-50'
												}`}>
												<Text className={`text-sm font-medium mb-1 ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-primary-700'
													}`}>
													推薦理由
												</Text>
												<Text className={`text-sm leading-5 ${selectedRestaurant?.id === restaurant.id ? 'text-white/90' : 'text-primary-600'
													}`}>
													{restaurant.recommendationReason}
												</Text>
											</View>

											{/* 特徴 */}
											<View className="flex-row flex-wrap gap-2">
												{restaurant.features.map((feature, idx) => (
													<View key={idx} className={`px-2 py-1 rounded-full ${selectedRestaurant?.id === restaurant.id
															? 'bg-white/20'
															: 'bg-neutral-100'
														}`}>
														<Text className={`text-xs font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-neutral-600'
															}`}>
															{feature}
														</Text>
													</View>
												))}
											</View>

											{/* アクションボタン */}
											<View className="flex-row gap-2 pt-2 border-t border-neutral-200/50">
												{restaurant.phone && (
													<TouchableOpacity
														onPress={() => handleCallRestaurant(restaurant.phone!)}
														className={`flex-1 flex-row items-center justify-center py-2 rounded-xl ${selectedRestaurant?.id === restaurant.id
																? 'bg-white/20'
																: 'bg-success-100'
															}`}
														activeOpacity={0.7}
													>
														<Ionicons
															name="call"
															size={16}
															color={selectedRestaurant?.id === restaurant.id ? 'white' : '#10b981'}
														/>
														<Text className={`ml-1 text-sm font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-success-700'
															}`}>
															電話
														</Text>
													</TouchableOpacity>
												)}
												{restaurant.mapUrl && (
													<TouchableOpacity
														onPress={() => handleOpenMap(restaurant.mapUrl!)}
														className={`flex-1 flex-row items-center justify-center py-2 rounded-xl ${selectedRestaurant?.id === restaurant.id
																? 'bg-white/20'
																: 'bg-blue-100'
															}`}
														activeOpacity={0.7}
													>
														<Ionicons
															name="map"
															size={16}
															color={selectedRestaurant?.id === restaurant.id ? 'white' : '#0284c7'}
														/>
														<Text className={`ml-1 text-sm font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-blue-700'
															}`}>
															地図
														</Text>
													</TouchableOpacity>
												)}
												{restaurant.reservationUrl && (
													<TouchableOpacity
														onPress={() => handleOpenReservation(restaurant.reservationUrl!)}
														className={`flex-1 flex-row items-center justify-center py-2 rounded-xl ${selectedRestaurant?.id === restaurant.id
																? 'bg-white/20'
																: 'bg-orange-100'
															}`}
														activeOpacity={0.7}
													>
														<Ionicons
															name="globe"
															size={16}
															color={selectedRestaurant?.id === restaurant.id ? 'white' : '#f59e0b'}
														/>
														<Text className={`ml-1 text-sm font-medium ${selectedRestaurant?.id === restaurant.id ? 'text-white' : 'text-orange-700'
															}`}>
															予約
														</Text>
													</TouchableOpacity>
												)}
											</View>
										</View>
									</Card>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</ScrollView>

				{/* Footer - 選択したレストランで予約へ進む */}
				{selectedRestaurant && (
					<View className="px-6 py-4 bg-white border-t border-neutral-200">
						<Button
							title={`${selectedRestaurant.name}で予約する`}
							onPress={handleMakeReservation}
							variant="gradient"
							size="lg"
							fullWidth
							icon={<Ionicons name="restaurant" size={20} color="white" />}
						/>
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}
