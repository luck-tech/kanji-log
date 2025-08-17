import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { MemberEditModal, MemberEditData } from '@/components/modals/MemberEditModal';

interface MemberDetail {
	id: string;
	name: string;
	email: string;
	department?: string;
	phone?: string;
	notes?: string;
	joinedAt: string;
	eventsParticipated: number;
	isActive: boolean;
	preferences?: {
		allergies?: string[];
		favoriteGenres?: string[];
		budgetRange?: { min: number; max: number };
		alcoholPreference?: 'yes' | 'no' | 'sometimes';
		dietaryRestrictions?: string[];
	};
	eventHistory: {
		eventId: string;
		eventTitle: string;
		date: string;
		status: 'attended' | 'declined' | 'pending';
		role: 'member' | 'organizer';
	}[];
	lastActive?: string;
}

// Mock data
const mockMemberDetail: MemberDetail = {
	id: '1',
	name: '田中太郎',
	email: 'tanaka@company.com',
	department: '営業部',
	phone: '090-1234-5678',
	notes: 'お酒が飲めない。魚介類アレルギーあり。',
	joinedAt: '2024-01-15',
	eventsParticipated: 5,
	isActive: true,
	preferences: {
		allergies: ['魚介類', '甲殻類'],
		favoriteGenres: ['和食', 'イタリアン'],
		budgetRange: { min: 3000, max: 5000 },
		alcoholPreference: 'no',
		dietaryRestrictions: ['ベジタリアン対応希望'],
	},
	eventHistory: [
		{
			eventId: '1',
			eventTitle: '新人歓迎会',
			date: '2024-01-20',
			status: 'attended',
			role: 'member',
		},
		{
			eventId: '2',
			eventTitle: 'チームビルディング',
			date: '2024-02-15',
			status: 'attended',
			role: 'member',
		},
		{
			eventId: '3',
			eventTitle: '忘年会',
			date: '2023-12-20',
			status: 'attended',
			role: 'organizer',
		},
		{
			eventId: '4',
			eventTitle: 'プロジェクト打ち上げ',
			date: '2024-03-10',
			status: 'declined',
			role: 'member',
		},
	],
	lastActive: '2024-01-22',
};

export default function MemberDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [member] = useState<MemberDetail>(mockMemberDetail);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);

	const handleBackPress = () => {
		router.back();
	};

	const handleEditMember = () => {
		setIsEditModalVisible(true);
	};

	const handleSaveMember = (memberData: MemberEditData) => {
		console.log('Member saved:', memberData);
		// TODO: API call to update member
	};

	const convertToEditData = (member: MemberDetail): MemberEditData => {
		return {
			name: member.name,
			email: member.email,
			department: member.department || '',
			phone: member.phone || '',
			notes: member.notes || '',
			isActive: member.isActive,
			preferences: {
				allergies: member.preferences?.allergies || [],
				favoriteGenres: member.preferences?.favoriteGenres || [],
				budgetRange: member.preferences?.budgetRange || { min: 3000, max: 5000 },
				alcoholPreference: member.preferences?.alcoholPreference || 'yes',
				dietaryRestrictions: member.preferences?.dietaryRestrictions || [],
			},
		};
	};

	const handleDeleteMember = () => {
		Alert.alert(
			'メンバー削除',
			`${member.name}さんをメンバーリストから削除しますか？`,
			[
				{ text: 'キャンセル', style: 'cancel' },
				{
					text: '削除',
					style: 'destructive',
					onPress: () => {
						console.log('Member deleted');
						router.back();
					}
				}
			]
		);
	};

	const handleEventPress = (eventId: string) => {
		router.push(`/event/${eventId}`);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'attended':
				return 'bg-success-100 text-success-700';
			case 'declined':
				return 'bg-error-100 text-error-700';
			case 'pending':
				return 'bg-warning-100 text-warning-700';
			default:
				return 'bg-neutral-100 text-neutral-700';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'attended':
				return '参加';
			case 'declined':
				return '不参加';
			case 'pending':
				return '保留';
			default:
				return status;
		}
	};

	const getRoleIcon = (role: string) => {
		return role === 'organizer' ? '👑' : '👤';
	};

	const attendanceRate = Math.round(
		(member.eventHistory.filter(e => e.status === 'attended').length / member.eventHistory.length) * 100
	);

	return (
		<View className="flex-1 bg-neutral-50">
			<SafeAreaView className="flex-1">
				<Header
					title={member.name}
					subtitle={member.department || 'メンバー詳細'}
					variant="gradient"
					leftIcon="arrow-back"
					onLeftPress={handleBackPress}
					rightIcon="create-outline"
					onRightPress={handleEditMember}
				/>

				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<View className="p-6 gap-6">
						{/* プロフィール概要 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-4">
									<LinearGradient
										colors={['#0ea5e9', '#0284c7']}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
										className="w-20 h-20 rounded-3xl justify-center items-center"
									>
										<Text className="text-3xl font-bold text-white">
											{member.name.charAt(0)}
										</Text>
									</LinearGradient>
									<View className="flex-1">
										<Text className="text-2xl font-bold text-white mb-1">
											{member.name}
										</Text>
										<Text className="text-white/90 text-base">
											{member.email}
										</Text>
										<View className="flex-row items-center gap-2 mt-2">
											<View className={`w-3 h-3 rounded-full ${member.isActive ? 'bg-success-400' : 'bg-neutral-400'
												}`} />
											<Text className="text-white/90 text-sm">
												{member.isActive ? 'アクティブ' : '非アクティブ'}
											</Text>
										</View>
									</View>
								</View>

								<View className="flex-row gap-4">
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">参加イベント</Text>
										<Text className="text-white font-bold text-xl">
											{member.eventsParticipated}
										</Text>
									</View>
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">参加率</Text>
										<Text className="text-white font-bold text-xl">
											{attendanceRate}%
										</Text>
									</View>
									<View className="flex-1 p-3 bg-white/10 rounded-xl">
										<Text className="text-white/90 text-sm">登録日</Text>
										<Text className="text-white font-bold text-sm">
											{formatDate(member.joinedAt)}
										</Text>
									</View>
								</View>
							</View>
						</Card>

						{/* 基本情報 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="person" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										基本情報
									</Text>
								</View>

								<View className="gap-3">
									<View className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl">
										<Ionicons name="business" size={18} color="#64748b" />
										<Text className="text-base text-neutral-900 font-medium">
											{member.department || '部署未設定'}
										</Text>
									</View>

									{member.phone && (
										<View className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl">
											<Ionicons name="call" size={18} color="#64748b" />
											<Text className="text-base text-neutral-900 font-medium">
												{member.phone}
											</Text>
										</View>
									)}

									{member.lastActive && (
										<View className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl">
											<Ionicons name="time" size={18} color="#64748b" />
											<Text className="text-base text-neutral-900 font-medium">
												最終活動: {formatDate(member.lastActive)}
											</Text>
										</View>
									)}
								</View>
							</View>
						</Card>

						{/* 好み・制限事項 */}
						{member.preferences && (
							<Card variant="elevated" shadow="soft">
								<View className="gap-4">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
											<Ionicons name="restaurant" size={20} color="#f59e0b" />
										</View>
										<Text className="text-lg font-semibold text-neutral-900">
											食事の好み・制限
										</Text>
									</View>

									<View className="gap-4">
										{/* アルコール */}
										<View>
											<Text className="text-sm font-medium text-neutral-700 mb-2">
												アルコール
											</Text>
											<View className={`px-3 py-2 rounded-xl ${member.preferences.alcoholPreference === 'yes' ? 'bg-success-100' :
													member.preferences.alcoholPreference === 'no' ? 'bg-error-100' :
														'bg-warning-100'
												}`}>
												<Text className={`font-medium ${member.preferences.alcoholPreference === 'yes' ? 'text-success-700' :
														member.preferences.alcoholPreference === 'no' ? 'text-error-700' :
															'text-warning-700'
													}`}>
													{member.preferences.alcoholPreference === 'yes' ? '飲める' :
														member.preferences.alcoholPreference === 'no' ? '飲めない' :
															'たまに飲む'}
												</Text>
											</View>
										</View>

										{/* アレルギー */}
										{member.preferences.allergies && member.preferences.allergies.length > 0 && (
											<View>
												<Text className="text-sm font-medium text-neutral-700 mb-2">
													アレルギー
												</Text>
												<View className="flex-row flex-wrap gap-2">
													{member.preferences.allergies.map((allergy, index) => (
														<View key={index} className="px-3 py-1 bg-error-100 rounded-full">
															<Text className="text-error-700 font-medium text-sm">
																{allergy}
															</Text>
														</View>
													))}
												</View>
											</View>
										)}

										{/* 好きなジャンル */}
										{member.preferences.favoriteGenres && member.preferences.favoriteGenres.length > 0 && (
											<View>
												<Text className="text-sm font-medium text-neutral-700 mb-2">
													好きな料理ジャンル
												</Text>
												<View className="flex-row flex-wrap gap-2">
													{member.preferences.favoriteGenres.map((genre, index) => (
														<View key={index} className="px-3 py-1 bg-blue-100 rounded-full">
															<Text className="text-blue-700 font-medium text-sm">
																{genre}
															</Text>
														</View>
													))}
												</View>
											</View>
										)}

										{/* 予算帯 */}
										{member.preferences.budgetRange && (
											<View>
												<Text className="text-sm font-medium text-neutral-700 mb-2">
													希望予算帯
												</Text>
												<View className="px-3 py-2 bg-green-100 rounded-xl">
													<Text className="text-green-700 font-medium">
														¥{member.preferences.budgetRange.min.toLocaleString()} - ¥{member.preferences.budgetRange.max.toLocaleString()}
													</Text>
												</View>
											</View>
										)}
									</View>
								</View>
							</Card>
						)}

						{/* メモ */}
						{member.notes && (
							<Card variant="elevated" shadow="soft">
								<View className="gap-4">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
											<Ionicons name="document-text" size={20} color="#7c3aed" />
										</View>
										<Text className="text-lg font-semibold text-neutral-900">
											メモ
										</Text>
									</View>

									<View className="p-4 bg-purple-50 rounded-xl">
										<Text className="text-purple-800 leading-6">
											{member.notes}
										</Text>
									</View>
								</View>
							</Card>
						)}

						{/* イベント履歴 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center justify-between">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
											<Ionicons name="calendar" size={20} color="#10b981" />
										</View>
										<Text className="text-lg font-semibold text-neutral-900">
											イベント履歴
										</Text>
									</View>
									<Text className="text-sm text-neutral-500">
										{member.eventHistory.length}件
									</Text>
								</View>

								<View className="gap-3">
									{member.eventHistory.slice(0, 5).map((event) => (
										<TouchableOpacity
											key={event.eventId}
											onPress={() => handleEventPress(event.eventId)}
											className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl"
											activeOpacity={0.7}
										>
											<Text className="text-lg">
												{getRoleIcon(event.role)}
											</Text>
											<View className="flex-1">
												<Text className="text-base font-medium text-neutral-900 mb-1">
													{event.eventTitle}
												</Text>
												<Text className="text-sm text-neutral-600">
													{formatDate(event.date)}
												</Text>
											</View>
											<View className={`px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
												<Text className="text-xs font-medium">
													{getStatusLabel(event.status)}
												</Text>
											</View>
											<Ionicons name="chevron-forward" size={16} color="#94a3b8" />
										</TouchableOpacity>
									))}
								</View>

								{member.eventHistory.length > 5 && (
									<TouchableOpacity className="py-3 items-center">
										<Text className="text-primary-600 font-medium">
											すべて表示 ({member.eventHistory.length - 5}件)
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</Card>

						{/* アクション */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
										<Ionicons name="settings" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										アクション
									</Text>
								</View>

								<View className="gap-3">
									<Button
										title="プロフィールを編集"
										onPress={handleEditMember}
										variant="primary"
										size="md"
										fullWidth
										icon={<Ionicons name="create-outline" size={18} color="white" />}
									/>

									<Button
										title="メンバーを削除"
										onPress={handleDeleteMember}
										variant="outline"
										size="md"
										fullWidth
										className="border-error-500"
										icon={<Ionicons name="trash-outline" size={18} color="#ef4444" />}
									/>
								</View>
							</View>
						</Card>
					</View>
				</ScrollView>

				<MemberEditModal
					isVisible={isEditModalVisible}
					onClose={() => setIsEditModalVisible(false)}
					onSave={handleSaveMember}
					initialData={convertToEditData(member)}
				/>
			</SafeAreaView>
		</View>
	);
}
