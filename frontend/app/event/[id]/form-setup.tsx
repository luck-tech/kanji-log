import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants';

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
          <View style={styles.content}>
            {/* 新規参加者追加 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person-add"
                      size={20}
                      color={Colors.primary[600]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>新規参加者を追加</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{newMembers.length}人</Text>
                  </View>
                </View>

                <Text style={styles.description}>
                  フォームで回答を収集する新規参加者の名前を事前に登録できます（任意）
                </Text>

                {/* 名前入力 */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Input
                      placeholder="新規参加者の名前"
                      value={newMemberName}
                      onChangeText={setNewMemberName}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={addNewMember}
                    style={styles.addButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* 追加済みメンバー一覧 */}
                {newMembers.length > 0 && (
                  <View style={styles.memberList}>
                    <Text style={styles.memberListTitle}>
                      追加予定のメンバー ({newMembers.length}人)
                    </Text>
                    {newMembers.map((member) => (
                      <View key={member.id} style={styles.memberItem}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberAvatarText}>
                            {member.name.charAt(0)}
                          </Text>
                        </View>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <TouchableOpacity
                          onPress={() => removeNewMember(member.id)}
                          style={styles.deleteButton}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={Colors.error[500]}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Card>

            {/* 質問項目設定 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={styles.questionIconContainer}>
                    <Ionicons
                      name="help-circle"
                      size={20}
                      color={Colors.warning[500]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>質問項目設定</Text>
                  <View style={styles.questionBadge}>
                    <Text style={styles.questionBadgeText}>
                      {enabledQuestionCount}項目有効
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>
                  新規参加者に聞きたい質問を選択してください
                </Text>

                <View style={styles.questionList}>
                  {questions.map((question) => (
                    <View
                      key={question.id}
                      style={[
                        styles.questionItem,
                        question.enabled
                          ? styles.questionItemEnabled
                          : styles.questionItemDisabled,
                      ]}
                    >
                      <View style={styles.questionHeader}>
                        <TouchableOpacity
                          onPress={() => toggleQuestionEnabled(question.id)}
                          style={[
                            styles.questionToggle,
                            question.enabled
                              ? styles.questionToggleEnabled
                              : styles.questionToggleDisabled,
                            !question.canDisable && styles.questionToggleFixed,
                          ]}
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
                          style={[
                            styles.questionText,
                            question.enabled
                              ? styles.questionTextEnabled
                              : styles.questionTextDisabled,
                          ]}
                        >
                          {question.question}
                        </Text>
                        {question.type === 'name' && (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.requiredBadgeText}>必須</Text>
                          </View>
                        )}
                        {question.type === 'custom' && (
                          <TouchableOpacity
                            onPress={() => removeCustomQuestion(question.id)}
                            style={styles.deleteIconButton}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color={Colors.error[500]}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* 必須・任意設定 */}
                      {question.enabled && question.type !== 'name' && (
                        <View style={styles.questionSettings}>
                          <TouchableOpacity
                            onPress={() => toggleQuestionRequired(question.id)}
                            style={styles.requiredToggle}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.requiredCheckbox,
                                question.required
                                  ? styles.requiredCheckboxChecked
                                  : styles.requiredCheckboxUnchecked,
                              ]}
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
                              style={[
                                styles.requiredToggleText,
                                question.required &&
                                  styles.requiredToggleTextChecked,
                              ]}
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
                <View style={styles.customQuestionSection}>
                  <Text style={styles.customQuestionTitle}>
                    カスタム質問を追加
                  </Text>
                  <View style={styles.inputRow}>
                    <Input
                      placeholder="例：お箸とフォーク、どちらが良いですか？"
                      value={customQuestion}
                      onChangeText={setCustomQuestion}
                      style={styles.customQuestionInput}
                    />
                    <TouchableOpacity
                      onPress={addCustomQuestion}
                      style={styles.customQuestionAddButton}
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
              <Card variant="elevated" shadow="none">
                <View style={styles.cardContent}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.successIconContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.success[500]}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>フォーム生成完了！</Text>
                  </View>

                  <View style={styles.urlContainer}>
                    <Text style={styles.urlLabel}>生成されたURL:</Text>
                    <Text style={styles.urlText}>{formUrl}</Text>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      title="URLをコピー"
                      onPress={copyToClipboard}
                      variant="outline"
                      size="md"
                      style={styles.halfButton}
                      icon={
                        <Ionicons
                          name="copy-outline"
                          size={18}
                          color={Colors.primary[600]}
                        />
                      }
                    />
                    <Button
                      title="共有する"
                      onPress={shareForm}
                      variant="primary"
                      size="md"
                      style={styles.halfButton}
                      icon={
                        <Ionicons
                          name="share-outline"
                          size={18}
                          color="white"
                        />
                      }
                    />
                  </View>

                  <Text style={styles.urlDescription}>
                    このURLをLINEやSlackで新規参加者に共有してください
                  </Text>
                </View>
              </Card>
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
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.warning[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.success[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  badge: {
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  questionBadge: {
    backgroundColor: Colors.warning[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  questionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warning[700],
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberList: {
    gap: 8,
  },
  memberListTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary[900],
  },
  deleteButton: {
    padding: 4,
  },
  questionList: {
    gap: 12,
  },
  questionItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  questionItemEnabled: {
    borderColor: Colors.warning[500],
    backgroundColor: Colors.warning[50],
  },
  questionItemDisabled: {
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.white,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  questionToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionToggleEnabled: {
    borderColor: Colors.warning[500],
    backgroundColor: Colors.warning[500],
  },
  questionToggleDisabled: {
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.transparent,
  },
  questionToggleFixed: {
    opacity: 0.5,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  questionTextEnabled: {
    color: Colors.warning[700],
  },
  questionTextDisabled: {
    color: Colors.neutral[700],
  },
  requiredBadge: {
    backgroundColor: Colors.error[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.error[700],
  },
  deleteIconButton: {
    padding: 4,
  },
  questionSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 36,
  },
  requiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requiredCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requiredCheckboxChecked: {
    borderColor: Colors.warning[500],
    backgroundColor: Colors.warning[500],
  },
  requiredCheckboxUnchecked: {
    borderColor: Colors.neutral[400],
    backgroundColor: Colors.transparent,
  },
  requiredToggleText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  requiredToggleTextChecked: {
    color: Colors.warning[700],
    fontWeight: '500',
  },
  customQuestionSection: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  customQuestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  customQuestionInput: {
    flex: 1,
  },
  customQuestionAddButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.warning[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlContainer: {
    padding: 16,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  urlLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  urlText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: Colors.neutral[900],
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  urlDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
});
