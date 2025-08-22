import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Input } from '../../../common/ui';
import { QuestionItem } from './QuestionItem';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Question } from '../../../../types/features/event';
import { Colors } from '../../../../utils/constants/design/colors';

interface QuestionsListProps extends BaseComponentProps {
  questions: Question[];
  customQuestion: string;
  enabledQuestionCount: number;
  onToggleQuestionEnabled: (questionId: string) => void;
  onToggleQuestionRequired: (questionId: string) => void;
  onCustomQuestionChange: (question: string) => void;
  onAddCustomQuestion: () => void;
  onRemoveCustomQuestion: (questionId: string) => void;
}

/**
 * 質問項目設定リスト - 質問項目の管理とカスタム質問追加を組み合わせた複合コンポーネント
 */
export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  customQuestion,
  enabledQuestionCount,
  onToggleQuestionEnabled,
  onToggleQuestionRequired,
  onCustomQuestionChange,
  onAddCustomQuestion,
  onRemoveCustomQuestion,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
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
            <QuestionItem
              key={question.id}
              question={question}
              onToggleEnabled={onToggleQuestionEnabled}
              onToggleRequired={onToggleQuestionRequired}
              onRemoveCustomQuestion={
                question.type === 'custom' ? onRemoveCustomQuestion : undefined
              }
            />
          ))}
        </View>

        {/* カスタム質問追加 */}
        <View style={styles.customQuestionSection}>
          <Text style={styles.customQuestionTitle}>カスタム質問を追加</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Input
                placeholder="例：お箸とフォーク、どちらが良いですか？"
                value={customQuestion}
                onChangeText={onCustomQuestionChange}
              />
            </View>
            <TouchableOpacity
              onPress={onAddCustomQuestion}
              style={styles.customQuestionAddButton}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: Colors.warning[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
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
  questionList: {
    gap: 12,
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
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
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
});
