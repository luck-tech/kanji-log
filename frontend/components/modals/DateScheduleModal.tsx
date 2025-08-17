import React, { useState } from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface DateScheduleModalProps {
	isVisible: boolean;
	onClose: () => void;
	onScheduleSetup: (scheduleData: ScheduleData) => void;
}

export interface ScheduleData {
	title: string;
	description?: string;
	dateOptions: DateOption[];
	deadline?: string;
}

interface DateOption {
	id: string;
	date: string;
	time: string;
	label?: string;
}

const TIME_SLOTS = [
	'18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export const DateScheduleModal: React.FC<DateScheduleModalProps> = ({
	isVisible,
	onClose,
	onScheduleSetup,
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dateOptions, setDateOptions] = useState<DateOption[]>([
		{ id: '1', date: '', time: '19:00' },
		{ id: '2', date: '', time: '19:30' },
	]);
	const [deadline, setDeadline] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setDateOptions([
			{ id: '1', date: '', time: '19:00' },
			{ id: '2', date: '', time: '19:30' },
		]);
		setDeadline('');
		setErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = 'タイトルは必須です';
		}

		const validOptions = dateOptions.filter(option => option.date.trim());
		if (validOptions.length < 2) {
			newErrors.dateOptions = '少なくとも2つの候補日を設定してください';
		}

		// 日付の重複チェック
		const dates = validOptions.map(option => `${option.date}-${option.time}`);
		const uniqueDates = new Set(dates);
		if (dates.length !== uniqueDates.size) {
			newErrors.dateOptions = '同じ日時の候補が重複しています';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSetup = () => {
		if (!validateForm()) return;

		const validOptions = dateOptions.filter(option => option.date.trim());
		const scheduleData: ScheduleData = {
			title,
			description,
			dateOptions: validOptions,
			deadline,
		};

		onScheduleSetup(scheduleData);
		resetForm();
		onClose();
	};

	const addDateOption = () => {
		const newOption: DateOption = {
			id: Date.now().toString(),
			date: '',
			time: '19:00',
		};
		setDateOptions(prev => [...prev, newOption]);
	};

	const removeDateOption = (id: string) => {
		if (dateOptions.length <= 2) {
			Alert.alert('エラー', '最低2つの候補日が必要です');
			return;
		}
		setDateOptions(prev => prev.filter(option => option.id !== id));
	};

	const updateDateOption = (id: string, field: 'date' | 'time', value: string) => {
		setDateOptions(prev => prev.map(option =>
			option.id === id ? { ...option, [field]: value } : option
		));
	};

	const generateSuggestedDates = () => {
		const today = new Date();
		const suggestions = [];

		// 今週の金曜日
		const friday = new Date(today);
		friday.setDate(today.getDate() + (5 - today.getDay()));
		if (friday > today) {
			suggestions.push(friday.toISOString().split('T')[0]);
		}

		// 来週の金曜日
		const nextFriday = new Date(friday);
		nextFriday.setDate(friday.getDate() + 7);
		suggestions.push(nextFriday.toISOString().split('T')[0]);

		// 再来週の金曜日
		const nextNextFriday = new Date(nextFriday);
		nextNextFriday.setDate(nextFriday.getDate() + 7);
		suggestions.push(nextNextFriday.toISOString().split('T')[0]);

		return suggestions;
	};

	const applySuggestedDates = () => {
		const suggestions = generateSuggestedDates();
		const newOptions = suggestions.slice(0, Math.min(3, suggestions.length)).map((date, index) => ({
			id: `suggested-${index}`,
			date,
			time: index === 0 ? '19:00' : index === 1 ? '19:30' : '18:30',
		}));

		setDateOptions(newOptions);
	};

	const validOptionsCount = dateOptions.filter(option => option.date.trim()).length;

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
						<Text className="text-lg font-bold text-neutral-900">日程調整設定</Text>
						<View className="w-10" />
					</View>
				</View>

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="p-6 gap-6">
						{/* 説明 */}
						<Card variant="gradient" shadow="large" animated={true}>
							<View className="gap-3">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center">
										<Ionicons name="calendar" size={20} color="white" />
									</View>
									<Text className="text-lg font-bold text-white">
										日程調整の設定
									</Text>
								</View>
								<Text className="text-white/90 leading-6">
									メンバーに都合を聞くための候補日を設定します。
									複数の候補日を用意して、最も多くの人が参加できる日程を見つけましょう。
								</Text>
							</View>
						</Card>

						{/* 基本情報 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="information-circle" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">基本情報</Text>
								</View>

								<Input
									label="調整タイトル *"
									placeholder="例：新人歓迎会の日程調整"
									value={title}
									onChangeText={setTitle}
									error={errors.title}
								/>

								<Input
									label="補足説明"
									placeholder="例：2時間程度を予定しています"
									value={description}
									onChangeText={setDescription}
									multiline
									numberOfLines={2}
								/>
							</View>
						</Card>

						{/* 候補日設定 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center justify-between">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
											<Ionicons name="time" size={20} color="#f59e0b" />
										</View>
										<Text className="text-lg font-semibold text-neutral-900">候補日設定</Text>
									</View>
									<View className="bg-orange-100 rounded-full px-3 py-1">
										<Text className="text-xs font-bold text-orange-700">
											{validOptionsCount}候補
										</Text>
									</View>
								</View>

								{errors.dateOptions && (
									<Text className="text-sm text-error-600">{errors.dateOptions}</Text>
								)}

								{/* 候補日の自動提案 */}
								<View className="p-3 bg-orange-50 rounded-xl">
									<View className="flex-row items-center justify-between mb-2">
										<Text className="text-sm font-medium text-orange-900">
											📅 おすすめ候補日
										</Text>
										<TouchableOpacity
											onPress={applySuggestedDates}
											className="px-3 py-1 bg-orange-200 rounded-full"
											activeOpacity={0.7}
										>
											<Text className="text-xs font-bold text-orange-800">適用</Text>
										</TouchableOpacity>
									</View>
									<Text className="text-sm text-orange-700 leading-5">
										金曜日の夜を中心に、3つの候補日を自動設定します
									</Text>
								</View>

								{/* 候補日リスト */}
								<View className="gap-3">
									{dateOptions.map((option, index) => (
										<View key={option.id} className="p-4 bg-neutral-50 rounded-xl">
											<View className="flex-row items-center justify-between mb-3">
												<Text className="text-base font-medium text-neutral-900">
													候補 {index + 1}
												</Text>
												{dateOptions.length > 2 && (
													<TouchableOpacity
														onPress={() => removeDateOption(option.id)}
														className="p-1"
													>
														<Ionicons name="trash-outline" size={16} color="#ef4444" />
													</TouchableOpacity>
												)}
											</View>

											<View className="flex-row gap-3">
												<Input
													label="日付"
													placeholder="2024-03-15"
													value={option.date}
													onChangeText={(value) => updateDateOption(option.id, 'date', value)}
													className="flex-1"
												/>
												<View className="flex-1">
													<Text className="text-sm font-medium text-neutral-700 mb-2">時間</Text>
													<ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
														{TIME_SLOTS.map((timeSlot) => (
															<TouchableOpacity
																key={timeSlot}
																onPress={() => updateDateOption(option.id, 'time', timeSlot)}
																className={`px-3 py-2 rounded-xl border ${option.time === timeSlot
																		? 'border-orange-500 bg-orange-100'
																		: 'border-neutral-200 bg-white'
																	}`}
																activeOpacity={0.7}
															>
																<Text className={`text-sm font-medium ${option.time === timeSlot ? 'text-orange-700' : 'text-neutral-600'
																	}`}>
																	{timeSlot}
																</Text>
															</TouchableOpacity>
														))}
													</ScrollView>
												</View>
											</View>
										</View>
									))}
								</View>

								{/* 候補日追加ボタン */}
								<TouchableOpacity
									onPress={addDateOption}
									className="flex-row items-center justify-center py-3 border border-dashed border-orange-300 rounded-xl"
									activeOpacity={0.7}
								>
									<Ionicons name="add" size={20} color="#f59e0b" />
									<Text className="ml-2 text-base font-medium text-orange-600">
										候補日を追加
									</Text>
								</TouchableOpacity>
							</View>
						</Card>

						{/* 回答期限 */}
						<Card variant="elevated" shadow="soft">
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-red-100 justify-center items-center">
										<Ionicons name="alarm" size={20} color="#ef4444" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">回答期限</Text>
									<Text className="text-sm text-neutral-500">（任意）</Text>
								</View>

								<Input
									label="期限日"
									placeholder="2024-03-10"
									value={deadline}
									onChangeText={setDeadline}
								/>

								<View className="p-3 bg-red-50 rounded-xl">
									<Text className="text-sm text-red-800 leading-5">
										💡 期限を設定すると、メンバーにより早めの回答を促すことができます
									</Text>
								</View>
							</View>
						</Card>
					</View>
				</ScrollView>

				{/* Footer */}
				<View className="px-6 py-4 bg-white border-t border-neutral-200">
					<Button
						title="日程調整を開始"
						onPress={handleSetup}
						variant="gradient"
						size="lg"
						fullWidth
						disabled={!title.trim() || validOptionsCount < 2}
						icon={<Ionicons name="send" size={20} color="white" />}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
};
