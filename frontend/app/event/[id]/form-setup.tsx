import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/common/Input';

// Mock data
const mockMembers = [
	{ id: '1', name: '田中太郎', email: 'tanaka@example.com', isSelected: true },
	{ id: '2', name: '佐藤花子', email: 'sato@example.com', isSelected: true },
	{ id: '3', name: '鈴木次郎', email: 'suzuki@example.com', isSelected: false },
	{ id: '4', name: '山田三郎', email: 'yamada@example.com', isSelected: false },
];

const defaultQuestions = [
	{ id: '1', question: 'お名前', type: 'name', required: true, enabled: true },
	{ id: '2', question: '食べ物のアレルギーはありますか？', type: 'allergy', required: false, enabled: true },
	{ id: '3', question: 'お酒は飲めますか？', type: 'alcohol', required: false, enabled: true },
	{ id: '4', question: '予算の希望はありますか？', type: 'budget', required: false, enabled: true },
	{ id: '5', question: '好きな料理ジャンルはありますか？', type: 'genre', required: false, enabled: false },
	{ id: '6', question: '最寄り駅を教えてください', type: 'station', required: false, enabled: false },
];

export default function FormSetupScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [members, setMembers] = useState(mockMembers);
	const [questions, setQuestions] = useState(defaultQuestions);
	const [customQuestion, setCustomQuestion] = useState('');
	const [formUrl, setFormUrl] = useState('');

	const handleBackPress = () => {
		router.back();
	};

	const toggleMemberSelection = (memberId: string) => {
		setMembers(prev => prev.map(member =>
			member.id === memberId
				? { ...member, isSelected: !member.isSelected }
				: member
		));
	};

	const toggleQuestionEnabled = (questionId: string) => {
		setQuestions(prev => prev.map(question =>
			question.id === questionId
				? { ...question, enabled: !question.enabled }
				: question
		));
	};

	const addCustomQuestion = () => {
		if (!customQuestion.trim()) return;

		const newQuestion = {
			id: Date.now().toString(),
			question: customQuestion,
			type: 'custom',
			required: false,
			enabled: true,
		};

		setQuestions(prev => [...prev, newQuestion]);
		setCustomQuestion('');
	};

	const removeCustomQuestion = (questionId: string) => {
		setQuestions(prev => prev.filter(q => q.id !== questionId));
	};

	const generateForm = () => {
		const selectedMembers = members.filter(m => m.isSelected);
		const enabledQuestions = questions.filter(q => q.enabled);

		if (selectedMembers.length === 0) {
			Alert.alert('エラー', '少なくとも1人のメンバーを選択してください');
			return;
		}

		if (enabledQuestions.length === 0) {
			Alert.alert('エラー', '少なくとも1つの質問を有効にしてください');
			return;
		}

		// Generate form URL (mock)
		const mockUrl = `https://kanji-log.app/form/${id}/${Date.now()}`;
		setFormUrl(mockUrl);
	};

	const shareForm = async () => {
		if (!formUrl) return;

		try {
			await Share.share({
				message: `${formUrl}\n\n飲み会の情報収集フォームです。ご回答をお願いします！`,
				url: formUrl,
			});
		} catch (error) {
			console.error('Share error:', error);
		}
	};

	const copyToClipboard = () => {
		console.log('Copy to clipboard:', formUrl);
		Alert.alert('コピー完了', 'フォームURLをクリップボードにコピーしました');
	};

	const selectedMemberCount = members.filter(m => m.isSelected).length;
	const enabledQuestionCount = questions.filter(q => q.enabled).length;

	return (
		<View className="flex-1 bg-neutral-50">
			<SafeAreaView className="flex-1">
				<Header
					title="Webフォーム作成"
					subtitle="メンバー情報収集フォームを設定"
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
						{/* 参加メンバー選択 */}
						<Card variant="elevated" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
										<Ionicons name="people" size={20} color="#0284c7" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										参加メンバー選択
									</Text>
									<View className="bg-primary-100 rounded-full px-2 py-1">
										<Text className="text-xs font-bold text-primary-700">
											{selectedMemberCount}名選択
										</Text>
									</View>
								</View>

								<Text className="text-sm text-neutral-600 leading-5">
									フォームで回答を収集するメンバーを選択してください
								</Text>

								<View className="gap-3">
									{members.map((member) => (
										<TouchableOpacity
											key={member.id}
											onPress={() => toggleMemberSelection(member.id)}
											className={`flex-row items-center gap-3 p-3 rounded-xl border ${member.isSelected
													? 'border-primary-500 bg-primary-50'
													: 'border-neutral-200 bg-white'
												}`}
											activeOpacity={0.7}
										>
											<View className={`w-6 h-6 rounded-full border-2 ${member.isSelected
													? 'border-primary-500 bg-primary-500'
													: 'border-neutral-300'
												} justify-center items-center`}>
												{member.isSelected && (
													<Ionicons name="checkmark" size={14} color="white" />
												)}
											</View>
											<View className="w-8 h-8 rounded-xl bg-primary-100 justify-center items-center">
												<Text className="text-sm font-bold text-primary-700">
													{member.name.charAt(0)}
												</Text>
											</View>
											<View className="flex-1">
												<Text className="text-base font-medium text-neutral-900">
													{member.name}
												</Text>
												<Text className="text-sm text-neutral-500">
													{member.email}
												</Text>
											</View>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</Card>

						{/* 質問項目設定 */}
						<Card variant="elevated" shadow="large" animated={true}>
							<View className="gap-4">
								<View className="flex-row items-center gap-3">
									<View className="w-10 h-10 rounded-2xl bg-orange-100 justify-center items-center">
										<Ionicons name="help-circle" size={20} color="#f59e0b" />
									</View>
									<Text className="text-lg font-semibold text-neutral-900">
										質問項目設定
									</Text>
									<View className="bg-orange-100 rounded-full px-2 py-1">
										<Text className="text-xs font-bold text-orange-700">
											{enabledQuestionCount}項目有効
										</Text>
									</View>
								</View>

								<Text className="text-sm text-neutral-600 leading-5">
									メンバーに聞きたい質問を選択してください
								</Text>

								<View className="gap-3">
									{questions.map((question) => (
										<View
											key={question.id}
											className={`p-3 rounded-xl border ${question.enabled
													? 'border-orange-500 bg-orange-50'
													: 'border-neutral-200 bg-white'
												}`}
										>
											<View className="flex-row items-center gap-3">
												<TouchableOpacity
													onPress={() => toggleQuestionEnabled(question.id)}
													className={`w-6 h-6 rounded-full border-2 ${question.enabled
															? 'border-orange-500 bg-orange-500'
															: 'border-neutral-300'
														} justify-center items-center`}
													activeOpacity={0.7}
												>
													{question.enabled && (
														<Ionicons name="checkmark" size={14} color="white" />
													)}
												</TouchableOpacity>
												<Text className={`flex-1 text-base font-medium ${question.enabled ? 'text-orange-700' : 'text-neutral-700'
													}`}>
													{question.question}
												</Text>
												{question.required && (
													<View className="bg-red-100 rounded-full px-2 py-1">
														<Text className="text-xs font-bold text-red-700">必須</Text>
													</View>
												)}
												{question.type === 'custom' && (
													<TouchableOpacity
														onPress={() => removeCustomQuestion(question.id)}
														className="p-1"
													>
														<Ionicons name="trash-outline" size={16} color="#ef4444" />
													</TouchableOpacity>
												)}
											</View>
										</View>
									))}
								</View>

								{/* カスタム質問追加 */}
								<View className="gap-3 pt-4 border-t border-neutral-200">
									<Text className="text-base font-semibold text-neutral-900">
										カスタム質問を追加
									</Text>
									<View className="flex-row gap-3">
										<Input
											placeholder="例：お箸とフォーク、どちらが良いですか？"
											value={customQuestion}
											onChangeText={setCustomQuestion}
											className="flex-1"
										/>
										<TouchableOpacity
											onPress={addCustomQuestion}
											className="w-12 h-12 rounded-2xl bg-orange-600 justify-center items-center"
											activeOpacity={0.8}
										>
											<Ionicons name="add" size={20} color="white" />
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</Card>

						{/* フォーム生成 */}
						{!formUrl ? (
							<Button
								title="フォームを生成する"
								onPress={generateForm}
								variant="gradient"
								size="lg"
								fullWidth
								icon={<Ionicons name="create-outline" size={20} color="white" />}
								disabled={selectedMemberCount === 0 || enabledQuestionCount === 0}
							/>
						) : (
							<Card variant="gradient" shadow="large" animated={true}>
								<View className="gap-4">
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 rounded-2xl bg-success-100 justify-center items-center">
											<Ionicons name="checkmark-circle" size={20} color="#10b981" />
										</View>
										<Text className="text-lg font-semibold text-neutral-900">
											フォーム生成完了！
										</Text>
									</View>

									<View className="p-4 bg-neutral-50 rounded-xl">
										<Text className="text-sm text-neutral-600 mb-2">生成されたURL:</Text>
										<Text className="text-base font-mono text-neutral-900 leading-6">
											{formUrl}
										</Text>
									</View>

									<View className="flex-row gap-3">
										<Button
											title="URLをコピー"
											onPress={copyToClipboard}
											variant="outline"
											size="md"
											className="flex-1"
											icon={<Ionicons name="copy-outline" size={18} color="#0284c7" />}
										/>
										<Button
											title="共有する"
											onPress={shareForm}
											variant="primary"
											size="md"
											className="flex-1"
											icon={<Ionicons name="share-outline" size={18} color="white" />}
										/>
									</View>

									<Text className="text-sm text-neutral-600 text-center leading-5">
										このURLをLINEやSlackでメンバーに共有してください
									</Text>
								</View>
							</Card>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}
