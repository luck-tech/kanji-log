import React, { useState } from 'react';
import { View, ScrollView, Alert, Share, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/layout';
import { Button } from '@/components/common/ui';
import {
  MemberAddSection,
  QuestionsList,
  FormUrlShare,
} from '@/components/features/event/form-setup';
import { NewMember, Question } from '@/types/features/event';
import { Colors } from '@/constants';

// Mock data
const defaultQuestions: Question[] = [
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
  const insets = useSafeAreaInsets();
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
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Header
          title="Webフォーム作成"
          subtitle="新規参加者向け情報収集フォーム"
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingBottom: insets.bottom }]}>
            {/* 新規参加者追加 */}
            <MemberAddSection
              newMembers={newMembers}
              newMemberName={newMemberName}
              onNewMemberNameChange={setNewMemberName}
              onAddMember={addNewMember}
              onRemoveMember={removeNewMember}
            />

            {/* 質問項目設定 */}
            <QuestionsList
              questions={questions}
              customQuestion={customQuestion}
              enabledQuestionCount={enabledQuestionCount}
              onToggleQuestionEnabled={toggleQuestionEnabled}
              onToggleQuestionRequired={toggleQuestionRequired}
              onCustomQuestionChange={setCustomQuestion}
              onAddCustomQuestion={addCustomQuestion}
              onRemoveCustomQuestion={removeCustomQuestion}
            />

            {/* フォーム生成 */}
            {!formUrl ? (
              <Button
                title="フォームを生成する"
                onPress={generateForm}
                variant="gradient"
                size="lg"
                fullWidth
                disabled={enabledQuestionCount === 0}
              />
            ) : (
              <FormUrlShare
                formUrl={formUrl}
                onCopyToClipboard={copyToClipboard}
                onShareForm={shareForm}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
});
