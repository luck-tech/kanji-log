import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Linking,
	Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/common/Input';

interface ReservationInfo {
	restaurant: {
		id: string;
		name: string;
		genre: string;
		address: string;
		phone: string;
		mapUrl?: string;
		reservationUrl?: string;
		features: string[];
	};
	event: {
		title: string;
		date: string;
		time: string;
		memberCount: number;
	};
	reservationDetails?: {
		reservationId?: string;
		contactPerson?: string;
		specialRequests?: string;
		isConfirmed: boolean;
		confirmedAt?: string;
	};
}

// Mock data
const mockReservationInfo: ReservationInfo = {
	restaurant: {
		id: '1',
		name: '炭火焼鳥 鳥心',
		genre: '焼鳥・居酒屋',
		address: '東京都新宿区歌舞伎町1-2-3 ビル名 3F',
		phone: '03-1234-5678',
		mapUrl: 'https://maps.google.com/?q=炭火焼鳥+鳥心+新宿',
		reservationUrl: 'https://tabelog.com/tokyo/restaurant/12345/',
		features: ['個室あり', 'アレルギー対応', '飲み放題', '駅近5分'],
	},
	event: {
		title: '新人歓迎会',
		date: '2024-02-15',
		time: '19:00',
		memberCount: 8,
	},
	reservationDetails: {
		isConfirmed: false,
	},
};

export default function ReservationSupportScreen() {
	const { id, restaurantId } = useLocalSearchParams<{ id: string; restaurantId?: string }>();
	const router = useRouter();
	const [reservationInfo] = useState<ReservationInfo>(mockReservationInfo);
	const [reservationForm, setReservationForm] = useState({
		contactPerson: '',
		specialRequests: '',
		reservationId: '',
	});
	const [isReservationConfirmed, setIsReservationConfirmed] = useState(false);

	const handleBackPress = () => {
		router.back();
	};

	const handleCallRestaurant = () => {
		Linking.openURL(`tel:${reservationInfo.restaurant.phone}`);
	};

	const handleOpenMap = () => {
		if (reservationInfo.restaurant.mapUrl) {
			Linking.openURL(reservationInfo.restaurant.mapUrl);
		}
	};

	const handleOpenReservationSite = () => {
		if (reservationInfo.restaurant.reservationUrl) {
			Linking.openURL(reservationInfo.restaurant.reservationUrl);
		}
	};

	const handleShareReservationInfo = async () => {
		const shareText = `【予約情報】
${reservationInfo.event.title}

📍 店舗: ${reservationInfo.restaurant.name}
📅 日時: ${formatDate(reservationInfo.event.date)} ${reservationInfo.event.time}
👥 人数: ${reservationInfo.event.memberCount}名
📞 電話: ${reservationInfo.restaurant.phone}
🏠 住所: ${reservationInfo.restaurant.address}

この情報でお店に予約をお願いします。`;

		try {
			await Share.share({
				message: shareText,
			});
		} catch (error) {
			console.error('Share error:', error);
		}
	};

	const handleReservationComplete = () => {
		if (!reservationForm.contactPerson.trim()) {
			Alert.alert('エラー', '予約者名を入力してください');
			return;
		}

		Alert.alert(
			'予約完了',
			'予約が完了しました。\nメンバーに確定情報を共有しますか？',
			[
				{ text: 'あとで', style: 'cancel' },
				{
					text: '共有する',
					onPress: () => {
						setIsReservationConfirmed(true);
						handleShareConfirmedInfo();
					}
				}
			]
		);
	};

	const handleReservationFailed = () => {
		Alert.alert(
			'予約失敗',
			'このお店の予約が取れませんでした。\n次の候補店舗を表示しますか？',
			[
				{ text: 'キャンセル', style: 'cancel' },
				{
					text: '次の候補',
					onPress: () => {
						router.push(`/event/${id}/restaurant-suggestions`);
					}
				}
			]
		);
	};

	const handleShareConfirmedInfo = async () => {
		const shareText = `【${reservationInfo.event.title} 確定のお知らせ】

🎉 予約が確定しました！

📍 お店: ${reservationInfo.restaurant.name}
📅 日時: ${formatDate(reservationInfo.event.date)} ${reservationInfo.event.time}〜
👥 人数: ${reservationInfo.event.memberCount}名
🏠 住所: ${reservationInfo.restaurant.address}
📞 電話: ${reservationInfo.restaurant.phone}

皆さんのご参加をお待ちしています！`;

		try {
			await Share.share({
				message: shareText,
			});
		} catch (error) {
			console.error('Share error:', error);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
		return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
	};

	return (
		<View className="flex-1 bg-neutral-50">
			<SafeAreaView className="flex-1">
				<Header
					title="予約サポート"
					subtitle="予約に必要な情報をまとめて表示"
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
						{/* イベント概要 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-3">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center">
										<Ionicons name="calendar" size={20} color="white" />
									</View>
									<Text className="text-lg font-bold text-white">
										{reservationInfo.event.title}
									</Text>
								</View>

								<View className="flex-row gap-4">
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">開催日時</Text>
										<Text className="text-white font-bold">
											{formatDate(reservationInfo.event.date)}
										</Text>
										<Text className="text-white font-bold">
											{reservationInfo.event.time}〜
										</Text>
									</View>
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">参加人数</Text>
										<Text className="text-white font-bold text-2xl text-center">
											{reservationInfo.event.memberCount}名
										</Text>
									</View>
								</View>
							</View>
						</Card>

						{/* 選択された店舗情報 */}
						<Card variant="elevated" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
										<Ionicons name="restaurant" size={20} color="#ef4444" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										選択されたお店
									</Text>
								</View>

								<View className="gap-3">
									<View>
										<Text className="text-2xl font-bold text-neutral-900 mb-1">
											{reservationInfo.restaurant.name}
										</Text>
										<Text className="text-base text-neutral-600">
											{reservationInfo.restaurant.genre}
										</Text>
									</View>

									<View className="p-4 bg-neutral-50 rounded-xl">
										<View className="flex-row items-start gap-3 mb-3">
											<Ionicons name="location" size={18} color="#64748b" />
											<Text className="text-base text-neutral-900 font-medium flex-1">
												{reservationInfo.restaurant.address}
											</Text>
										</View>
										<View className="flex-row items-center gap-3">
											<Ionicons name="call" size={18} color="#64748b" />
											<Text className="text-base text-neutral-900 font-medium">
												{reservationInfo.restaurant.phone}
											</Text>
										</View>
									</View>

									<View className="flex-row flex-wrap gap-2">
										{reservationInfo.restaurant.features.map((feature, index) => (
											<View key={index} className="px-3 py-1 bg-blue-100 rounded-full">
												<Text className="text-sm font-medium text-blue-700">
													{feature}
												</Text>
											</View>
										))}
									</View>
								</View>
							</View>
						</Card>

						{/* 予約アクション */}
						<Card variant="elevated" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
										<Ionicons name="call" size={20} color="#10b981" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										予約手続き
									</Text>
								</View>

								<View className="gap-3">
									<TouchableOpacity
										onPress={handleCallRestaurant}
										className="flex-row items-center justify-center p-4 bg-success-600 rounded-2xl"
										activeOpacity={0.8}
									>
										<Ionicons name="call" size={20} color="white" />
										<Text className="ml-2 text-base font-bold text-white">
											電話で予約する
										</Text>
									</TouchableOpacity>

									<View className="flex-row gap-3">
										<TouchableOpacity
											onPress={handleOpenMap}
											className="flex-1 flex-row items-center justify-center py-3 border border-blue-500 rounded-2xl"
											activeOpacity={0.8}
										>
											<Ionicons name="map" size={18} color="#0284c7" />
											<Text className="ml-1 text-sm font-medium text-blue-700">
												地図を開く
											</Text>
										</TouchableOpacity>

										{reservationInfo.restaurant.reservationUrl && (
											<TouchableOpacity
												onPress={handleOpenReservationSite}
												className="flex-1 flex-row items-center justify-center py-3 border border-orange-500 rounded-2xl"
												activeOpacity={0.8}
											>
												<Ionicons name="globe" size={18} color="#f59e0b" />
												<Text className="ml-1 text-sm font-medium text-orange-700">
													予約サイト
												</Text>
											</TouchableOpacity>
										)}
									</View>

									<TouchableOpacity
										onPress={handleShareReservationInfo}
										className="flex-row items-center justify-center py-3 border border-purple-500 rounded-2xl"
										activeOpacity={0.8}
									>
										<Ionicons name="share" size={18} color="#7c3aed" />
										<Text className="ml-2 text-base font-medium text-purple-700">
											予約情報を共有
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</Card>

						{/* 予約完了報告 */}
						<Card variant="elevated" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
										<Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										予約完了報告
									</Text>
								</View>

								<Text className="text-sm text-neutral-600 leading-5">
									予約が完了したら、以下の情報を入力して完了報告をしてください。
									メンバーに確定情報が自動で共有されます。
								</Text>

								<View className="gap-3">
									<Input
										label="予約者名"
										placeholder="例：田中太郎"
										value={reservationForm.contactPerson}
										onChangeText={(text) => setReservationForm(prev => ({ ...prev, contactPerson: text }))}
									/>

									<Input
										label="予約ID・確認番号"
										placeholder="例：RSV12345（任意）"
										value={reservationForm.reservationId}
										onChangeText={(text) => setReservationForm(prev => ({ ...prev, reservationId: text }))}
									/>

									<Input
										label="特別なリクエスト・メモ"
										placeholder="例：アレルギー対応をお願いしました"
										value={reservationForm.specialRequests}
										onChangeText={(text) => setReservationForm(prev => ({ ...prev, specialRequests: text }))}
										multiline
										numberOfLines={2}
									/>
								</View>

								<View className="flex-row gap-3">
									<Button
										title="予約完了"
										onPress={handleReservationComplete}
										variant="gradient"
										size="md"
										className="flex-1"
										icon={<Ionicons name="checkmark" size={18} color="white" />}
									/>
									<Button
										title="予約失敗"
										onPress={handleReservationFailed}
										variant="outline"
										size="md"
										className="flex-1"
										icon={<Ionicons name="close" size={18} color="#ef4444" />}
									/>
								</View>
							</View>
						</Card>

						{/* 予約のコツ */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-3">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
										<Ionicons name="bulb" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										予約のコツ
									</Text>
								</View>

								<View className="gap-2">
									<Text className="text-sm text-neutral-700 leading-5">
										📞 電話予約時に伝える内容：
									</Text>
									<View className="pl-4 gap-1">
										<Text className="text-sm text-neutral-600">• 日時: {formatDate(reservationInfo.event.date)} {reservationInfo.event.time}〜</Text>
										<Text className="text-sm text-neutral-600">• 人数: {reservationInfo.event.memberCount}名</Text>
										<Text className="text-sm text-neutral-600">• 用途: {reservationInfo.event.title}</Text>
										<Text className="text-sm text-neutral-600">• 個室希望（可能であれば）</Text>
										<Text className="text-sm text-neutral-600">• アレルギー対応の確認</Text>
									</View>
								</View>
							</View>
						</Card>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}
