import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { DateOptionWithStats } from '../../../../types/features/event';
import { Colors } from '../../../../utils/constants/design/colors';

interface DateConfirmFooterProps extends BaseComponentProps {
  selectedDateId: string | null;
  bestOption: DateOptionWithStats;
  selectedOption?: DateOptionWithStats;
  formatDate: (dateString: string) => string;
  onDateConfirm: () => void;
  onClearSelection: () => void;
  onQuickConfirm: () => void;
}

/**
 * 日程確定フッター - 選択状態に応じて確定ボタンと情報を表示する複合コンポーネント
 */
export const DateConfirmFooter: React.FC<DateConfirmFooterProps> = ({
  selectedDateId,
  bestOption,
  selectedOption,
  formatDate,
  onDateConfirm,
  onClearSelection,
  onQuickConfirm,
  style,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footer, { paddingBottom: insets.bottom }, style]}
      testID={testID}
    >
      {selectedDateId && selectedOption ? (
        <View style={styles.footerContent}>
          {/* 選択された日程の情報 */}
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateLabel}>確定予定の日程</Text>
            <Text style={styles.selectedDateInfoTitle}>
              {formatDate(selectedOption.date)} {selectedOption.time}
            </Text>
            <Text style={styles.selectedDateStats}>
              参加可能 {selectedOption.stats.available}名 + おそらく参加{' '}
              {selectedOption.stats.maybe}名
            </Text>
          </View>

          {/* ボタン */}
          <Button
            title="この日程で確定"
            onPress={onDateConfirm}
            variant="gradient"
            size="lg"
            icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
            fullWidth
          />
          <Button
            title="選択を解除"
            onPress={onClearSelection}
            variant="outline"
            size="lg"
          />
        </View>
      ) : (
        <View style={styles.footerButtons}>
          {/* 推奨日程での自動確定ボタン */}
          <Button
            title={`最適日程で確定: ${formatDate(bestOption.date)} ${
              bestOption.time
            }`}
            onPress={onQuickConfirm}
            variant="gradient"
            size="lg"
            fullWidth
            icon={<Ionicons name="trophy" size={20} color="white" />}
          />

          {/* 手動選択の案内 */}
          <Text style={styles.footerNote}>
            または上記の候補日をタップして手動で選択してください
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerContent: {
    gap: 12,
  },
  selectedDateInfo: {
    padding: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  selectedDateLabel: {
    color: Colors.primary[800],
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedDateInfoTitle: {
    color: Colors.primary[900],
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedDateStats: {
    color: Colors.primary[700],
    fontSize: 12,
    textAlign: 'center',
  },
  footerButtons: {
    gap: 12,
  },
  footerNote: {
    color: Colors.neutral[600],
    fontSize: 12,
    textAlign: 'center',
  },
});
