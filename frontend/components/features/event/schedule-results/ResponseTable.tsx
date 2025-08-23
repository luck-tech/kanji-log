import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import {
  ScheduleResponse,
  DateOptionWithStats,
} from '../../../../types/features/event';
import { Colors } from '../../../../utils/constants/design/colors';

interface ResponseTableProps extends BaseComponentProps {
  responses: ScheduleResponse[];
  dateOptions: DateOptionWithStats[];
  formatDate: (dateString: string) => string;
}

/**
 * 個別回答テーブル - メンバーごとの回答状況を横スクロール対応テーブルで表示する複合コンポーネント
 */
export const ResponseTable: React.FC<ResponseTableProps> = ({
  responses,
  dateOptions,
  formatDate,
  style,
  testID,
}) => {
  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'available':
        return '✅';
      case 'maybe':
        return '🤔';
      case 'unavailable':
        return '❌';
      default:
        return '❓';
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'available':
        return styles.successText;
      case 'maybe':
        return styles.warningText;
      case 'unavailable':
        return styles.errorText;
      default:
        return styles.neutralText;
    }
  };

  const getResponseLabel = (response: string) => {
    switch (response) {
      case 'available':
        return '参加可能';
      case 'maybe':
        return 'おそらく参加';
      case 'unavailable':
        return '参加不可';
      default:
        return '未回答';
    }
  };

  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.responseSection}>
        <View style={styles.responseHeader}>
          <View style={[styles.iconContainer, styles.purpleIcon]}>
            <Ionicons name="people" size={20} color="#7c3aed" />
          </View>
          <Text style={styles.responseTitle}>個別回答状況</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.responseTable}>
            {/* ヘッダー */}
            <View style={styles.tableHeader}>
              <View style={styles.memberColumn}>
                <Text style={styles.memberHeaderText}>メンバー</Text>
              </View>
              {dateOptions.map((option) => (
                <View key={option.id} style={styles.dateColumn}>
                  <Text style={styles.dateHeaderText}>
                    {formatDate(option.date)}
                  </Text>
                  <Text style={styles.dateTimeText}>{option.time}</Text>
                </View>
              ))}
            </View>

            {/* 回答データ */}
            {responses.map((response) => (
              <View key={response.userId} style={styles.responseRow}>
                <View style={styles.memberColumn}>
                  <Text style={styles.memberName}>{response.userName}</Text>
                </View>
                {dateOptions.map((option) => {
                  const userResponse = response.responses.find(
                    (r) => r.dateOptionId === option.id
                  );
                  const responseType = userResponse?.response || 'unavailable';

                  return (
                    <View key={option.id} style={styles.responseCell}>
                      <Text style={styles.responseIcon}>
                        {getResponseIcon(responseType)}
                      </Text>
                      <Text
                        style={[
                          styles.responseText,
                          getResponseColor(responseType),
                        ]}
                      >
                        {getResponseLabel(responseType)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  responseSection: {
    gap: 16,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purpleIcon: {
    backgroundColor: Colors.secondary[100],
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  responseTable: {
    gap: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  memberColumn: {
    width: 96,
  },
  dateColumn: {
    width: 80,
  },
  memberHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  dateHeaderText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  dateTimeText: {
    fontSize: 10,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  responseRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  memberName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  responseCell: {
    alignItems: 'center',
    width: 80,
  },
  responseIcon: {
    fontSize: 18,
  },
  responseText: {
    fontSize: 10,
  },
  successText: {
    color: Colors.success[600],
  },
  warningText: {
    color: Colors.warning[600],
  },
  errorText: {
    color: Colors.error[600],
  },
  neutralText: {
    color: Colors.neutral[600],
  },
});
