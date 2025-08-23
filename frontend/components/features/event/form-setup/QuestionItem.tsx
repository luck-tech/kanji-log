import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseComponentProps } from '@/types/common/ui';
import { Question } from '@/types/features/event';
import { Colors } from '@/utils/constants/design/colors';

interface QuestionItemProps extends BaseComponentProps {
  question: Question;
  onToggleEnabled: (questionId: string) => void;
  onToggleRequired: (questionId: string) => void;
  onRemoveCustomQuestion?: (questionId: string) => void;
}

/**
 * 個別質問項目 - 有効/無効切り替え、必須設定、カスタム質問削除機能を持つ複合コンポーネント
 */
export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  onToggleEnabled,
  onToggleRequired,
  onRemoveCustomQuestion,
  style,
  testID,
}) => {
  return (
    <View
      style={[
        styles.questionItem,
        question.enabled
          ? styles.questionItemEnabled
          : styles.questionItemDisabled,
        style,
      ]}
      testID={testID}
    >
      <View style={styles.questionHeader}>
        <TouchableOpacity
          onPress={() => onToggleEnabled(question.id)}
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
            <Ionicons name="checkmark" size={14} color="white" />
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
        {question.type === 'custom' && onRemoveCustomQuestion && (
          <TouchableOpacity
            onPress={() => onRemoveCustomQuestion(question.id)}
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
            onPress={() => onToggleRequired(question.id)}
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
                <Ionicons name="checkmark" size={10} color="white" />
              )}
            </View>
            <Text
              style={[
                styles.requiredToggleText,
                question.required && styles.requiredToggleTextChecked,
              ]}
            >
              必須回答
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
  },
  requiredToggleText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  requiredToggleTextChecked: {
    color: Colors.warning[700],
    fontWeight: '500',
  },
});
