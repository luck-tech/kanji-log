import React, { useState } from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface ProfileEditModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSave: (profileData: ProfileEditData) => void;
	initialData?: ProfileEditData;
}

export interface ProfileEditData {
	name: string;
	email: string;
	company?: string;
	department?: string;
	jobTitle?: string;
	phone?: string;
	avatar?: string;
	notifications: {
		eventUpdates: boolean;
		newMembers: boolean;
		reminders: boolean;
		suggestions: boolean;
	};
	preferences: {
		defaultBudgetRange: { min: number; max: number };
		preferredGenres: string[];
		language: 'ja' | 'en';
		theme: 'light' | 'dark' | 'auto';
	};
	privacy: {
		showProfile: boolean;
		shareRecords: boolean;
		allowContact: boolean;
	};
}

const GENRE_OPTIONS = [
	'和食', 'イタリアン', 'フレンチ', '中華', '韓国料理',
	'焼肉', '寿司', 'ラーメン', 'カフェ', 'バー', '居酒屋'
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
	isVisible,
	onClose,
	onSave,
	initialData,
}) => {
	const [formData, setFormData] = useState<ProfileEditData>(
		initialData || {
			name: '',
			email: '',
			company: '',
			department: '',
			jobTitle: '',
			phone: '',
			notifications: {
				eventUpdates: true,
				newMembers: true,
				reminders: true,
				suggestions: false,
			},
			preferences: {
				defaultBudgetRange: { min: 3000, max: 5000 },
				preferredGenres: [],
				language: 'ja',
				theme: 'auto',
			},
			privacy: {
				showProfile: true,
				shareRecords: true,
				allowContact: true,
			},
		}
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const resetForm = () => {
		if (initialData) {
			setFormData(initialData);
		}
		setErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = '名前は必須です';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'メールアドレスは必須です';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = '正しいメールアドレスを入力してください';
		}

		if (formData.phone && !/^[0-9-+().\s]+$/.test(formData.phone)) {
			newErrors.phone = '正しい電話番号を入力してください';
		}

		if (formData.preferences.defaultBudgetRange.min >= formData.preferences.defaultBudgetRange.max) {
			newErrors.budgetRange = '最低予算は最高予算より小さい値を入力してください';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validateForm()) return;

		onSave(formData);
		resetForm();
		onClose();
	};

	const toggleGenre = (genre: string) => {
		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				preferredGenres: prev.preferences.preferredGenres.includes(genre)
					? prev.preferences.preferredGenres.filter(g => g !== genre)
					: [...prev.preferences.preferredGenres, genre]
			}
		}));
	};

	const updateNotification = (key: keyof ProfileEditData['notifications'], value: boolean) => {
		setFormData(prev => ({
			...prev,
			notifications: {
				...prev.notifications,
				[key]: value,
			}
		}));
	};

	const updatePrivacy = (key: keyof ProfileEditData['privacy'], value: boolean) => {
		setFormData(prev => ({
			...prev,
			privacy: {
				...prev.privacy,
				[key]: value,
			}
		}));
	};

	return (
		<Modal
			visible={isVisible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={handleClose}
		>
			<SafeAreaView className="flex-1 bg-neutral-50">
				{/* Header */}
				<View className="px-6 py-4 bg-white border-b border-neutral-200">
					<View className="flex-row justify-between items-center">
						<TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
							<Ionicons name="close" size={24} color="#64748b" />
						</TouchableOpacity>
						<Text className="text-lg font-bold text-neutral-900">
							プロフィール編集
						</Text>
						<View className="w-10" />
					</View>
				</View>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="p-6 gap-6">
						{/* 基本情報 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center">
										<Ionicons name="person" size={20} color="white" />
									</View>
									<Text className="text-lg font-bold text-white">
										基本情報
									</Text>
								</View>

								<Input
									label="お名前 *"
									placeholder="例：幹事太郎"
									value={formData.name}
									onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
									error={errors.name}
									variant="glass"
								/>

								<Input
									label="メールアドレス *"
									placeholder="例：user@example.com"
									value={formData.email}
									onChangeText={(text) => setFormData(prev => ({ ...prev, email: text.toLowerCase() }))}
									error={errors.email}
									keyboardType="email-address"
									autoCapitalize="none"
									variant="glass"
								/>

								<View className="flex-row gap-3">
									<Input
										label="会社名"
										placeholder="例：株式会社○○"
										value={formData.company}
										onChangeText={(text) => setFormData(prev => ({ ...prev, company: text }))}
										className="flex-1"
										variant="glass"
									/>
									<Input
										label="部署"
										placeholder="例：営業部"
										value={formData.department}
										onChangeText={(text) => setFormData(prev => ({ ...prev, department: text }))}
										className="flex-1"
										variant="glass"
									/>
								</View>

								<View className="flex-row gap-3">
									<Input
										label="役職"
										placeholder="例：課長"
										value={formData.jobTitle}
										onChangeText={(text) => setFormData(prev => ({ ...prev, jobTitle: text }))}
										className="flex-1"
										variant="glass"
									/>
									<Input
										label="電話番号"
										placeholder="090-1234-5678"
										value={formData.phone}
										onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
										error={errors.phone}
										keyboardType="phone-pad"
										className="flex-1"
										variant="glass"
									/>
								</View>
							</View>
						</Card>

						{/* デフォルト予算設定 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
										<Ionicons name="cash" size={20} color="#10b981" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										デフォルト予算設定
									</Text>
								</View>

								<Text className="text-sm text-neutral-600 leading-5">
									新しいイベントを作成する際のデフォルト予算帯を設定します
								</Text>

								<View className="flex-row gap-3">
									<Input
										label="最低予算"
										placeholder="3000"
										value={formData.preferences.defaultBudgetRange.min.toString()}
										onChangeText={(text) => setFormData(prev => ({
											...prev,
											preferences: {
												...prev.preferences,
												defaultBudgetRange: { ...prev.preferences.defaultBudgetRange, min: parseInt(text) || 0 }
											}
										}))}
										keyboardType="numeric"
										className="flex-1"
									/>
									<Input
										label="最高予算"
										placeholder="5000"
										value={formData.preferences.defaultBudgetRange.max.toString()}
										onChangeText={(text) => setFormData(prev => ({
											...prev,
											preferences: {
												...prev.preferences,
												defaultBudgetRange: { ...prev.preferences.defaultBudgetRange, max: parseInt(text) || 0 }
											}
										}))}
										keyboardType="numeric"
										className="flex-1"
									/>
								</View>

								{errors.budgetRange && (
									<Text className="text-sm text-error-600">{errors.budgetRange}</Text>
								)}

								<View className="p-3 bg-green-50 rounded-xl">
									<Text className="text-green-800 text-center font-medium">
										¥{formData.preferences.defaultBudgetRange.min.toLocaleString()} - ¥{formData.preferences.defaultBudgetRange.max.toLocaleString()}
									</Text>
								</View>
							</View>
						</Card>

						{/* 好みのジャンル */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="restaurant" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										好みの料理ジャンル
									</Text>
								</View>

								<Text className="text-sm text-neutral-600 leading-5">
									よく選ぶ料理ジャンルを設定すると、レストラン提案の精度が向上します
								</Text>

								<View className="flex-row flex-wrap gap-2">
									{GENRE_OPTIONS.map((genre) => {
										const isSelected = formData.preferences.preferredGenres.includes(genre);
										return (
											<TouchableOpacity
												key={genre}
												onPress={() => toggleGenre(genre)}
												className={`px-3 py-2 rounded-2xl border ${isSelected
														? 'bg-blue-100 border-blue-500'
														: 'bg-neutral-50 border-neutral-200'
													}`}
												activeOpacity={0.7}
											>
												<Text className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-neutral-600'
													}`}>
													{genre}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						</Card>

						{/* 通知設定 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-yellow-100 justify-center items-center">
										<Ionicons name="notifications" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										通知設定
									</Text>
								</View>

								<View className="gap-3">
									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												イベント更新通知
											</Text>
											<Text className="text-sm text-neutral-600">
												イベントの日程確定や変更をお知らせ
											</Text>
										</View>
										<Switch
											value={formData.notifications.eventUpdates}
											onValueChange={(value) => updateNotification('eventUpdates', value)}
											trackColor={{ false: '#e5e7eb', true: '#0ea5e9' }}
											thumbColor={formData.notifications.eventUpdates ? '#ffffff' : '#f9fafb'}
										/>
									</View>

									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												新メンバー通知
											</Text>
											<Text className="text-sm text-neutral-600">
												メンバーが新しく追加された時の通知
											</Text>
										</View>
										<Switch
											value={formData.notifications.newMembers}
											onValueChange={(value) => updateNotification('newMembers', value)}
											trackColor={{ false: '#e5e7eb', true: '#0ea5e9' }}
											thumbColor={formData.notifications.newMembers ? '#ffffff' : '#f9fafb'}
										/>
									</View>

									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												リマインダー通知
											</Text>
											<Text className="text-sm text-neutral-600">
												イベント開催日のリマインダー
											</Text>
										</View>
										<Switch
											value={formData.notifications.reminders}
											onValueChange={(value) => updateNotification('reminders', value)}
											trackColor={{ false: '#e5e7eb', true: '#0ea5e9' }}
											thumbColor={formData.notifications.reminders ? '#ffffff' : '#f9fafb'}
										/>
									</View>

									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												おすすめ通知
											</Text>
											<Text className="text-sm text-neutral-600">
												新しい機能やおすすめ情報
											</Text>
										</View>
										<Switch
											value={formData.notifications.suggestions}
											onValueChange={(value) => updateNotification('suggestions', value)}
											trackColor={{ false: '#e5e7eb', true: '#0ea5e9' }}
											thumbColor={formData.notifications.suggestions ? '#ffffff' : '#f9fafb'}
										/>
									</View>
								</View>
							</View>
						</Card>

						{/* アプリ設定 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
										<Ionicons name="settings" size={20} color="#7c3aed" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										アプリ設定
									</Text>
								</View>

								<View className="gap-4">
									{/* 言語設定 */}
									<View>
										<Text className="text-base font-medium text-neutral-900 mb-3">
											言語
										</Text>
										<View className="flex-row gap-3">
											{[
												{ key: 'ja', label: '日本語' },
												{ key: 'en', label: 'English' },
											].map((lang) => (
												<TouchableOpacity
													key={lang.key}
													onPress={() => setFormData(prev => ({
														...prev,
														preferences: { ...prev.preferences, language: lang.key as any }
													}))}
													className={`flex-1 p-3 rounded-xl border-2 ${formData.preferences.language === lang.key
															? 'border-purple-500 bg-purple-50'
															: 'border-neutral-200 bg-white'
														}`}
													activeOpacity={0.7}
												>
													<Text className={`text-center font-medium ${formData.preferences.language === lang.key
															? 'text-purple-700'
															: 'text-neutral-600'
														}`}>
														{lang.label}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									</View>

									{/* テーマ設定 */}
									<View>
										<Text className="text-base font-medium text-neutral-900 mb-3">
											テーマ
										</Text>
										<View className="gap-2">
											{[
												{ key: 'light', label: 'ライト', icon: 'sunny' },
												{ key: 'dark', label: 'ダーク', icon: 'moon' },
												{ key: 'auto', label: 'システム設定に従う', icon: 'phone-portrait' },
											].map((theme) => (
												<TouchableOpacity
													key={theme.key}
													onPress={() => setFormData(prev => ({
														...prev,
														preferences: { ...prev.preferences, theme: theme.key as any }
													}))}
													className={`flex-row items-center gap-3 p-3 rounded-xl border ${formData.preferences.theme === theme.key
															? 'border-purple-500 bg-purple-50'
															: 'border-neutral-200 bg-white'
														}`}
													activeOpacity={0.7}
												>
													<Ionicons
														name={theme.icon as any}
														size={20}
														color={formData.preferences.theme === theme.key ? '#7c3aed' : '#64748b'}
													/>
													<Text className={`font-medium ${formData.preferences.theme === theme.key
															? 'text-purple-700'
															: 'text-neutral-600'
														}`}>
														{theme.label}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									</View>
								</View>
							</View>
						</Card>

						{/* プライバシー設定 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
										<Ionicons name="shield-checkmark" size={20} color="#ef4444" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										プライバシー設定
									</Text>
								</View>

								<View className="gap-3">
									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												プロフィール公開
											</Text>
											<Text className="text-sm text-neutral-600">
												他の幹事にプロフィール情報を表示
											</Text>
										</View>
										<Switch
											value={formData.privacy.showProfile}
											onValueChange={(value) => updatePrivacy('showProfile', value)}
											trackColor={{ false: '#e5e7eb', true: '#ef4444' }}
											thumbColor={formData.privacy.showProfile ? '#ffffff' : '#f9fafb'}
										/>
									</View>

									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												記録の自動共有
											</Text>
											<Text className="text-sm text-neutral-600">
												イベント記録をデフォルトで共有する
											</Text>
										</View>
										<Switch
											value={formData.privacy.shareRecords}
											onValueChange={(value) => updatePrivacy('shareRecords', value)}
											trackColor={{ false: '#e5e7eb', true: '#ef4444' }}
											thumbColor={formData.privacy.shareRecords ? '#ffffff' : '#f9fafb'}
										/>
									</View>

									<View className="flex-row items-center justify-between p-4 bg-neutral-50 rounded-xl">
										<View className="flex-1 mr-4">
											<Text className="text-base font-medium text-neutral-900 mb-1">
												連絡先の共有
											</Text>
											<Text className="text-sm text-neutral-600">
												他の幹事に連絡先を表示
											</Text>
										</View>
										<Switch
											value={formData.privacy.allowContact}
											onValueChange={(value) => updatePrivacy('allowContact', value)}
											trackColor={{ false: '#e5e7eb', true: '#ef4444' }}
											thumbColor={formData.privacy.allowContact ? '#ffffff' : '#f9fafb'}
										/>
									</View>
								</View>
							</View>
						</Card>
					</View>
				</ScrollView>

				{/* Footer */}
				<View className="px-6 py-4 bg-white border-t border-neutral-200">
					<Button
						title="変更を保存"
						onPress={handleSave}
						variant="gradient"
						size="lg"
						fullWidth
						disabled={!formData.name.trim() || !formData.email.trim()}
						icon={<Ionicons name="save" size={20} color="white" />}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
};
