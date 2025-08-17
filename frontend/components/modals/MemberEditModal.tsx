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

interface MemberEditModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSave: (memberData: MemberEditData) => void;
	initialData?: MemberEditData;
}

export interface MemberEditData {
	name: string;
	email: string;
	department?: string;
	phone?: string;
	notes?: string;
	isActive: boolean;
	preferences: {
		allergies: string[];
		favoriteGenres: string[];
		budgetRange: { min: number; max: number };
		alcoholPreference: 'yes' | 'no' | 'sometimes';
		dietaryRestrictions: string[];
	};
}

const GENRE_OPTIONS = [
	'和食', 'イタリアン', 'フレンチ', '中華', '韓国料理',
	'焼肉', '寿司', 'ラーメン', 'カフェ', 'バー', '居酒屋', 'その他'
];

const ALLERGY_OPTIONS = [
	'魚介類', '甲殻類', '卵', '乳製品', '小麦', '大豆',
	'ナッツ類', 'そば', '肉類', 'その他'
];

const DIETARY_OPTIONS = [
	'ベジタリアン対応希望', 'ヴィーガン対応希望', 'ハラル対応希望',
	'低塩分希望', '低糖質希望', 'グルテンフリー希望'
];

export const MemberEditModal: React.FC<MemberEditModalProps> = ({
	isVisible,
	onClose,
	onSave,
	initialData,
}) => {
	const [formData, setFormData] = useState<MemberEditData>(
		initialData || {
			name: '',
			email: '',
			department: '',
			phone: '',
			notes: '',
			isActive: true,
			preferences: {
				allergies: [],
				favoriteGenres: [],
				budgetRange: { min: 3000, max: 5000 },
				alcoholPreference: 'yes',
				dietaryRestrictions: [],
			},
		}
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [newAllergy, setNewAllergy] = useState('');
	const [newDietary, setNewDietary] = useState('');

	const resetForm = () => {
		if (initialData) {
			setFormData(initialData);
		} else {
			setFormData({
				name: '',
				email: '',
				department: '',
				phone: '',
				notes: '',
				isActive: true,
				preferences: {
					allergies: [],
					favoriteGenres: [],
					budgetRange: { min: 3000, max: 5000 },
					alcoholPreference: 'yes',
					dietaryRestrictions: [],
				},
			});
		}
		setErrors({});
		setNewAllergy('');
		setNewDietary('');
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

		if (formData.preferences.budgetRange.min >= formData.preferences.budgetRange.max) {
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
				favoriteGenres: prev.preferences.favoriteGenres.includes(genre)
					? prev.preferences.favoriteGenres.filter(g => g !== genre)
					: [...prev.preferences.favoriteGenres, genre]
			}
		}));
	};

	const toggleAllergy = (allergy: string) => {
		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				allergies: prev.preferences.allergies.includes(allergy)
					? prev.preferences.allergies.filter(a => a !== allergy)
					: [...prev.preferences.allergies, allergy]
			}
		}));
	};

	const addCustomAllergy = () => {
		if (!newAllergy.trim()) return;

		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				allergies: [...prev.preferences.allergies, newAllergy.trim()]
			}
		}));
		setNewAllergy('');
	};

	const removeAllergy = (allergy: string) => {
		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				allergies: prev.preferences.allergies.filter(a => a !== allergy)
			}
		}));
	};

	const toggleDietaryRestriction = (restriction: string) => {
		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				dietaryRestrictions: prev.preferences.dietaryRestrictions.includes(restriction)
					? prev.preferences.dietaryRestrictions.filter(d => d !== restriction)
					: [...prev.preferences.dietaryRestrictions, restriction]
			}
		}));
	};

	const addCustomDietary = () => {
		if (!newDietary.trim()) return;

		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				dietaryRestrictions: [...prev.preferences.dietaryRestrictions, newDietary.trim()]
			}
		}));
		setNewDietary('');
	};

	const removeDietary = (restriction: string) => {
		setFormData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				dietaryRestrictions: prev.preferences.dietaryRestrictions.filter(d => d !== restriction)
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
							{initialData ? 'メンバー編集' : 'メンバー追加'}
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
									placeholder="例：田中太郎"
									value={formData.name}
									onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
									error={errors.name}
									variant="glass"
								/>

								<Input
									label="メールアドレス *"
									placeholder="例：tanaka@company.com"
									value={formData.email}
									onChangeText={(text) => setFormData(prev => ({ ...prev, email: text.toLowerCase() }))}
									error={errors.email}
									keyboardType="email-address"
									autoCapitalize="none"
									variant="glass"
								/>

								<View className="flex-row gap-3">
									<Input
										label="部署・所属"
										placeholder="例：営業部"
										value={formData.department}
										onChangeText={(text) => setFormData(prev => ({ ...prev, department: text }))}
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

								<View className="flex-row items-center justify-between p-4 bg-white/10 rounded-xl">
									<View>
										<Text className="text-white font-medium text-base mb-1">
											アクティブメンバー
										</Text>
										<Text className="text-white/80 text-sm">
											イベント招待対象に含める
										</Text>
									</View>
									<Switch
										value={formData.isActive}
										onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
										trackColor={{ false: '#ffffff40', true: '#ffffff60' }}
										thumbColor={formData.isActive ? '#ffffff' : '#ffffffc0'}
									/>
								</View>
							</View>
						</Card>

						{/* アルコール */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-amber-100 justify-center items-center">
										<Ionicons name="wine" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										アルコール
									</Text>
								</View>

								<View className="flex-row gap-3">
									{[
										{ key: 'yes', label: '飲める', color: 'success' },
										{ key: 'sometimes', label: 'たまに', color: 'warning' },
										{ key: 'no', label: '飲めない', color: 'error' },
									].map((option) => (
										<TouchableOpacity
											key={option.key}
											onPress={() => setFormData(prev => ({
												...prev,
												preferences: { ...prev.preferences, alcoholPreference: option.key as any }
											}))}
											className={`flex-1 p-3 rounded-xl border-2 ${formData.preferences.alcoholPreference === option.key
													? `border-${option.color}-500 bg-${option.color}-50`
													: 'border-neutral-200 bg-white'
												}`}
											activeOpacity={0.7}
										>
											<Text className={`text-center font-medium ${formData.preferences.alcoholPreference === option.key
													? `text-${option.color}-700`
													: 'text-neutral-600'
												}`}>
												{option.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</Card>

						{/* 予算帯 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-green-100 justify-center items-center">
										<Ionicons name="cash" size={20} color="#10b981" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										希望予算帯
									</Text>
								</View>

								<View className="flex-row gap-3">
									<Input
										label="最低予算"
										placeholder="3000"
										value={formData.preferences.budgetRange.min.toString()}
										onChangeText={(text) => setFormData(prev => ({
											...prev,
											preferences: {
												...prev.preferences,
												budgetRange: { ...prev.preferences.budgetRange, min: parseInt(text) || 0 }
											}
										}))}
										keyboardType="numeric"
										className="flex-1"
									/>
									<Input
										label="最高予算"
										placeholder="5000"
										value={formData.preferences.budgetRange.max.toString()}
										onChangeText={(text) => setFormData(prev => ({
											...prev,
											preferences: {
												...prev.preferences,
												budgetRange: { ...prev.preferences.budgetRange, max: parseInt(text) || 0 }
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
										¥{formData.preferences.budgetRange.min.toLocaleString()} - ¥{formData.preferences.budgetRange.max.toLocaleString()}
									</Text>
								</View>
							</View>
						</Card>

						{/* 好きな料理ジャンル */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="restaurant" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										好きな料理ジャンル
									</Text>
								</View>

								<View className="flex-row flex-wrap gap-2">
									{GENRE_OPTIONS.map((genre) => {
										const isSelected = formData.preferences.favoriteGenres.includes(genre);
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

						{/* アレルギー */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
										<Ionicons name="warning" size={20} color="#ef4444" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										アレルギー
									</Text>
								</View>

								<View className="flex-row flex-wrap gap-2">
									{ALLERGY_OPTIONS.map((allergy) => {
										const isSelected = formData.preferences.allergies.includes(allergy);
										return (
											<TouchableOpacity
												key={allergy}
												onPress={() => toggleAllergy(allergy)}
												className={`px-3 py-2 rounded-2xl border ${isSelected
														? 'bg-red-100 border-red-500'
														: 'bg-neutral-50 border-neutral-200'
													}`}
												activeOpacity={0.7}
											>
												<Text className={`text-sm font-medium ${isSelected ? 'text-red-700' : 'text-neutral-600'
													}`}>
													{allergy}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>

								{/* カスタムアレルギー追加 */}
								<View className="gap-3">
									<Text className="text-base font-medium text-neutral-900">
										その他のアレルギー
									</Text>
									<View className="flex-row gap-3">
										<Input
											placeholder="例：ピーナッツ"
											value={newAllergy}
											onChangeText={setNewAllergy}
											className="flex-1"
										/>
										<TouchableOpacity
											onPress={addCustomAllergy}
											className="w-12 h-12 rounded-2xl bg-red-600 justify-center items-center"
											activeOpacity={0.8}
										>
											<Ionicons name="add" size={20} color="white" />
										</TouchableOpacity>
									</View>
								</View>

								{/* 選択されたアレルギー */}
								{formData.preferences.allergies.length > 0 && (
									<View className="gap-2">
										<Text className="text-sm font-medium text-neutral-700">
											選択中のアレルギー:
										</Text>
										<View className="flex-row flex-wrap gap-2">
											{formData.preferences.allergies.map((allergy, index) => (
												<View key={index} className="flex-row items-center bg-red-100 rounded-full pl-3 pr-1 py-1">
													<Text className="text-red-700 font-medium text-sm mr-2">
														{allergy}
													</Text>
													<TouchableOpacity
														onPress={() => removeAllergy(allergy)}
														className="w-5 h-5 rounded-full bg-red-200 justify-center items-center"
													>
														<Ionicons name="close" size={12} color="#ef4444" />
													</TouchableOpacity>
												</View>
											))}
										</View>
									</View>
								)}
							</View>
						</Card>

						{/* 食事制限 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-purple-100 justify-center items-center">
										<Ionicons name="leaf" size={20} color="#7c3aed" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										食事制限・特別対応
									</Text>
								</View>

								<View className="flex-row flex-wrap gap-2">
									{DIETARY_OPTIONS.map((restriction) => {
										const isSelected = formData.preferences.dietaryRestrictions.includes(restriction);
										return (
											<TouchableOpacity
												key={restriction}
												onPress={() => toggleDietaryRestriction(restriction)}
												className={`px-3 py-2 rounded-2xl border ${isSelected
														? 'bg-purple-100 border-purple-500'
														: 'bg-neutral-50 border-neutral-200'
													}`}
												activeOpacity={0.7}
											>
												<Text className={`text-sm font-medium ${isSelected ? 'text-purple-700' : 'text-neutral-600'
													}`}>
													{restriction}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>

								{/* カスタム食事制限追加 */}
								<View className="gap-3">
									<Text className="text-base font-medium text-neutral-900">
										その他の特別対応
									</Text>
									<View className="flex-row gap-3">
										<Input
											placeholder="例：低カロリー希望"
											value={newDietary}
											onChangeText={setNewDietary}
											className="flex-1"
										/>
										<TouchableOpacity
											onPress={addCustomDietary}
											className="w-12 h-12 rounded-2xl bg-purple-600 justify-center items-center"
											activeOpacity={0.8}
										>
											<Ionicons name="add" size={20} color="white" />
										</TouchableOpacity>
									</View>
								</View>

								{/* 選択された食事制限 */}
								{formData.preferences.dietaryRestrictions.length > 0 && (
									<View className="gap-2">
										<Text className="text-sm font-medium text-neutral-700">
											選択中の特別対応:
										</Text>
										<View className="flex-row flex-wrap gap-2">
											{formData.preferences.dietaryRestrictions.map((restriction, index) => (
												<View key={index} className="flex-row items-center bg-purple-100 rounded-full pl-3 pr-1 py-1">
													<Text className="text-purple-700 font-medium text-sm mr-2">
														{restriction}
													</Text>
													<TouchableOpacity
														onPress={() => removeDietary(restriction)}
														className="w-5 h-5 rounded-full bg-purple-200 justify-center items-center"
													>
														<Ionicons name="close" size={12} color="#7c3aed" />
													</TouchableOpacity>
												</View>
											))}
										</View>
									</View>
								)}
							</View>
						</Card>

						{/* メモ */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-yellow-100 justify-center items-center">
										<Ionicons name="document-text" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										メモ・備考
									</Text>
								</View>

								<Input
									placeholder="例：お酒が飲めない。魚介類アレルギーあり。"
									value={formData.notes}
									onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
									multiline
									numberOfLines={3}
								/>

								<View className="p-3 bg-yellow-50 rounded-xl">
									<Text className="text-yellow-800 text-sm leading-5">
										💡 ここに記録した情報は、レストラン提案やWebフォーム作成時の参考情報として活用されます。
									</Text>
								</View>
							</View>
						</Card>
					</View>
				</ScrollView>

				{/* Footer */}
				<View className="px-6 py-4 bg-white border-t border-neutral-200">
					<Button
						title={initialData ? "変更を保存" : "メンバーを追加"}
						onPress={handleSave}
						variant="gradient"
						size="lg"
						fullWidth
						disabled={!formData.name.trim() || !formData.email.trim()}
						icon={<Ionicons name={initialData ? "save" : "person-add"} size={20} color="white" />}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
};
