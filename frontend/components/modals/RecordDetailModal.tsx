import React, { useState } from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { SharedRecord } from '@/types';

interface RecordDetailModalProps {
	isVisible: boolean;
	onClose: () => void;
	record: SharedRecord | null;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
	isVisible,
	onClose,
	record,
}) => {
	const [activePhotoIndex, setActivePhotoIndex] = useState(0);

	if (!record) return null;

	const handleShare = async () => {
		const shareText = `【参考記録】${record.eventLog.venue?.name || 'レストラン'}

⭐ 評価: ${record.eventLog.rating}/5
💰 予算: 一人${record.eventLog.costPerPerson?.toLocaleString() || '不明'}円
👥 参加者: ${record.eventLog.attendees || '不明'}名

#幹事ログ`;

		try {
			await Share.share({
				message: shareText,
			});
		} catch (error) {
			console.error('Share error:', error);
		}
	};

	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Ionicons key={i} name="star" size={20} color="#f59e0b" />
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Ionicons key="half" name="star-half" size={20} color="#f59e0b" />
			);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#d1d5db" />
			);
		}

		return <View className="flex-row gap-0.5">{stars}</View>;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
	};

	const getRatingLabel = (rating: number) => {
		if (rating >= 4.5) return '非常に良い';
		if (rating >= 3.5) return '良い';
		if (rating >= 2.5) return '普通';
		if (rating >= 1.5) return 'やや残念';
		return '残念';
	};

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
						<Text className="text-lg font-bold text-neutral-900">記録詳細</Text>
						<TouchableOpacity onPress={handleShare} className="p-2 -mr-2">
							<Ionicons name="share-outline" size={24} color="#64748b" />
						</TouchableOpacity>
					</View>
				</View>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="p-6 gap-6">
						{/* 基本情報 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-12 h-12 rounded-2xl bg-white/20 justify-center items-center">
										<Ionicons name="restaurant" size={24} color="white" />
									</View>
									<View className="flex-1">
										<Text className="text-xl font-bold text-white mb-1">
											{record.eventLog.venue?.name || 'レストラン名'}
										</Text>
										<Text className="text-white/90">
											{record.eventLog.venue?.genre || 'ジャンル'} • {record.eventLog.venue?.area || 'エリア'}
										</Text>
									</View>
								</View>

								<View className="flex-row items-center justify-between">
									<View className="flex-row items-center gap-3">
										{renderStars(record.eventLog.rating)}
										<Text className="text-white font-bold text-lg">
											{record.eventLog.rating}
										</Text>
									</View>
									<View className="bg-white/20 rounded-full px-3 py-1">
										<Text className="text-white font-bold text-sm">
											{getRatingLabel(record.eventLog.rating)}
										</Text>
									</View>
								</View>

								<View className="flex-row gap-4">
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">予算/人</Text>
										<Text className="text-white font-bold text-lg">
											¥{record.eventLog.costPerPerson?.toLocaleString() || '不明'}
										</Text>
									</View>
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">参加者</Text>
										<Text className="text-white font-bold text-lg">
											{record.eventLog.attendees || '不明'}名
										</Text>
									</View>
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">開催日</Text>
										<Text className="text-white font-bold text-sm">
											{formatDate(record.eventLog.createdAt)}
										</Text>
									</View>
								</View>
							</View>
						</Card>

						{/* イベント情報 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="calendar" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										イベント情報
									</Text>
								</View>

								<View className="p-4 bg-blue-50 rounded-xl">
									<Text className="text-blue-900 font-bold text-lg mb-2">
										{record.event.title}
									</Text>
									<View className="flex-row items-center gap-2">
										<View className="bg-blue-200 rounded-full px-3 py-1">
											<Text className="text-blue-800 font-medium text-sm">
												{record.event.purpose}
											</Text>
										</View>
										<Text className="text-blue-700 text-sm">
											開催者: {record.organizer.name}
										</Text>
									</View>
								</View>
							</View>
						</Card>

						{/* 店舗詳細 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
										<Ionicons name="location" size={20} color="#ef4444" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										店舗詳細
									</Text>
								</View>

								<View className="p-4 bg-neutral-50 rounded-xl">
									<Text className="text-neutral-600 text-sm mb-1">住所</Text>
									<Text className="text-neutral-900 font-medium text-base">
										{record.eventLog.venue?.address || '住所情報なし'}
									</Text>
								</View>

								<View>
									<Text className="text-base font-medium text-neutral-900 mb-3">
										記録メモ
									</Text>
									<View className="p-3 bg-neutral-100 rounded-xl">
										<Text className="text-neutral-700 leading-5">
											{record.eventLog.notes || '特記事項なし'}
										</Text>
									</View>
								</View>
							</View>
						</Card>



						{/* 参考にする */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
										<Ionicons name="bookmark" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										この記録を活用
									</Text>
								</View>

								<Text className="text-neutral-600 text-sm leading-6">
									この記録は他の幹事の実体験に基づいています。
									同じエリアや目的のイベントを企画する際の参考にしてください。
								</Text>

								<View className="flex-row gap-3">
									<Button
										title="お気に入り"
										onPress={() => console.log('Add to favorites')}
										variant="outline"
										size="md"
										className="flex-1"
										icon={<Ionicons name="heart-outline" size={18} color="#ef4444" />}
									/>
									<Button
										title="共有する"
										onPress={handleShare}
										variant="primary"
										size="md"
										className="flex-1"
										icon={<Ionicons name="share-outline" size={18} color="white" />}
									/>
								</View>
							</View>
						</Card>

						{/* 投稿者情報 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-3">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-neutral-100 justify-center items-center">
										<Ionicons name="person" size={20} color="#64748b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										投稿者情報
									</Text>
								</View>

								<View className="p-3 bg-neutral-50 rounded-xl">
									<Text className="text-neutral-900 font-medium mb-1">
										{record.organizer.name}
									</Text>
									<Text className="text-neutral-600 text-sm">
										投稿日: {formatDate(record.eventLog.createdAt)}
									</Text>
								</View>

								<Text className="text-neutral-500 text-xs leading-5">
									※ プライバシー保護のため、参加メンバー名や主観的なメモは表示されません
								</Text>
							</View>
						</Card>
					</View>
				</ScrollView>
			</SafeAreaView>
		</Modal>
	);
};
