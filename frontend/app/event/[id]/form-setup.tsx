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
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/common/Input';

interface NewMember {
  id: string;
  name: string;
}

interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  enabled: boolean;
  canDisable: boolean;
}

// Mock data
const defaultQuestions = [
  {
    id: '1',
    question: 'お名前',
    type: 'name',
    required: true,
    enabled: true,
    canDisable: false,
  },
  {
    id: '2',
    question: '食べ物のアレルギーはありますか？',
    type: 'allergy',
    required: false,
    enabled: true,
    canDisable: true,
  },
  {
    id: '3',
    question: 'お酒は飲めますか？',
    type: 'alcohol',
    required: false,
    enabled: true,
    canDisable: true,
  },
  {
    id: '4',
    question: '予算の希望はありますか？',
    type: 'budget',
    required: false,
    enabled: true,
    canDisable: true,
  },
  {
    id: '5',
    question: '好きな料理ジャンルはありますか？',
    type: 'genre',
    required: false,
    enabled: true,
    canDisable: true,
  },
  {
    id: '6',
    question: '最寄り駅を教えてください',
    type: 'station',
    required: false,
    enabled: true,
    canDisable: true,
  },
];

export default function FormSetupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [newMembers, setNewMembers] = useState<NewMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [customQuestion, setCustomQuestion] = useState('');
  const [formUrl, setFormUrl] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const addNewMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }

    const newMember: NewMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
    };

    setNewMembers((prev) => [...prev, newMember]);
    setNewMemberName('');
  };

  const removeNewMember = (memberId: string) => {
    setNewMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const toggleQuestionEnabled = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId && question.canDisable
          ? { ...question, enabled: !question.enabled }
          : question
      )
    );
  };

  const toggleQuestionRequired = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId && question.type !== 'name'
          ? { ...question, required: !question.required }
          : question
      )
    );
  };

  const addCustomQuestion = () => {
    if (!customQuestion.trim()) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: customQuestion,
      type: 'custom',
      required: false,
      enabled: true,
      canDisable: true,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setCustomQuestion('');
  };

  const removeCustomQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const generateForm = () => {
    const enabledQuestions = questions.filter((q) => q.enabled);

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

  const enabledQuestionCount = questions.filter((q) => q.enabled).length;

  return (
    <View className="flex-1 bg-neutral-50">
      <SafeAreaView className="flex-1">
        <Header
          title="Webフォーム作成"
          subtitle="新規参加者向け情報収集フォーム"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 gap-6">
            {/* 新規参加者追加 */}
            <Card variant="elevated" shadow="large" animated={true}>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-blue-100 justify-center items-center">
                    <Ionicons name="person-add" size={20} color="#0284c7" />
                  </View>
                  <Text className="text-lg font-semibold text-neutral-900">
                    新規参加者を追加
                  </Text>
                  <View className="bg-primary-100 rounded-full px-2 py-1">
                    <Text className="text-xs font-bold text-primary-700">
                      {newMembers.length}名追加済み
                    </Text>
                  </View>
                </View>

                <Text className="text-sm text-neutral-600 leading-5">
                  フォームで回答を収集する新規参加者の名前を事前に登録できます（任意）
                </Text>

                {/* 名前入力 */}
                <View className="flex-row gap-3">
                  <Input
                    placeholder="新規参加者の名前"
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    className="flex-1"
                  />
                  <TouchableOpacity
                    onPress={addNewMember}
                    className="w-12 h-12 rounded-2xl bg-blue-600 justify-center items-center"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* 追加済みメンバー一覧 */}
                {newMembers.length > 0 && (
                  <View className="gap-2">
                    <Text className="text-sm font-medium text-neutral-700">
                      追加済みメンバー:
                    </Text>
                    {newMembers.map((member) => (
                      <View
                        key={member.id}
                        className="flex-row items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200"
                      >
                        <View className="w-8 h-8 rounded-xl bg-blue-100 justify-center items-center">
                          <Text className="text-sm font-bold text-blue-700">
                            {member.name.charAt(0)}
                          </Text>
                        </View>
                        <Text className="flex-1 text-base font-medium text-blue-900">
                          {member.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeNewMember(member.id)}
                          className="p-1"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="#ef4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
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
                  新規参加者に聞きたい質問を選択してください
                </Text>

                <View className="gap-3">
                  {questions.map((question) => (
                    <View
                      key={question.id}
                      className={`p-4 rounded-xl border ${
                        question.enabled
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <View className="flex-row items-center gap-3 mb-3">
                        <TouchableOpacity
                          onPress={() => toggleQuestionEnabled(question.id)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            question.enabled
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-neutral-300'
                          } justify-center items-center ${
                            !question.canDisable ? 'opacity-50' : ''
                          }`}
                          activeOpacity={question.canDisable ? 0.7 : 1}
                          disabled={!question.canDisable}
                        >
                          {question.enabled && (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color="white"
                            />
                          )}
                        </TouchableOpacity>
                        <Text
                          className={`flex-1 text-base font-medium ${
                            question.enabled
                              ? 'text-orange-700'
                              : 'text-neutral-700'
                          }`}
                        >
                          {question.question}
                        </Text>
                        {question.type === 'name' && (
                          <View className="bg-red-100 rounded-full px-2 py-1">
                            <Text className="text-xs font-bold text-red-700">
                              必須
                            </Text>
                          </View>
                        )}
                        {question.type === 'custom' && (
                          <TouchableOpacity
                            onPress={() => removeCustomQuestion(question.id)}
                            className="p-1"
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="#ef4444"
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* 必須・任意設定 */}
                      {question.enabled && question.type !== 'name' && (
                        <View className="flex-row items-center gap-4 pl-9">
                          <TouchableOpacity
                            onPress={() => toggleQuestionRequired(question.id)}
                            className="flex-row items-center gap-2"
                            activeOpacity={0.7}
                          >
                            <View
                              className={`w-4 h-4 rounded border ${
                                question.required
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-neutral-400'
                              } justify-center items-center`}
                            >
                              {question.required && (
                                <Ionicons
                                  name="checkmark"
                                  size={10}
                                  color="white"
                                />
                              )}
                            </View>
                            <Text
                              className={`text-sm ${
                                question.required
                                  ? 'text-orange-700 font-medium'
                                  : 'text-neutral-600'
                              }`}
                            >
                              必須回答
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
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
                icon={
                  <Ionicons name="create-outline" size={20} color="white" />
                }
                disabled={enabledQuestionCount === 0}
              />
            ) : (
              <Card variant="elevated" shadow="large" animated={true}>
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-success-100 justify-center items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10b981"
                      />
                    </View>
                    <Text className="text-lg font-semibold text-neutral-900">
                      フォーム生成完了！
                    </Text>
                  </View>

                  <View className="p-4 bg-neutral-50 rounded-xl">
                    <Text className="text-sm text-neutral-600 mb-2">
                      生成されたURL:
                    </Text>
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
                      style={{ flex: 1 }}
                      icon={
                        <Ionicons
                          name="copy-outline"
                          size={18}
                          color="#0284c7"
                        />
                      }
                    />
                    <Button
                      title="共有する"
                      onPress={shareForm}
                      variant="primary"
                      size="md"
                      style={{ flex: 1 }}
                      icon={
                        <Ionicons
                          name="share-outline"
                          size={18}
                          color="white"
                        />
                      }
                    />
                  </View>

                  <Text className="text-sm text-neutral-600 text-center leading-5">
                    このURLをLINEやSlackで新規参加者に共有してください
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
