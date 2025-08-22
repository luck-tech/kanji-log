import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { Colors } from '../../../../utils/constants/design/colors';

interface ReservationTipsProps extends BaseComponentProps {
  memberCount: number;
}

/**
 * 予約のコツ表示 - 予約時の注意点やコツを表示するコンポーネント
 */
export const ReservationTips: React.FC<ReservationTipsProps> = ({
  memberCount,
  style,
  testID,
}) => {
  const tips = [
    '事前に参加者の人数を正確に伝える',
    'アレルギーや食事制限を確認して伝える',
    '開始時間の15分前には到着できるよう調整',
    '予約変更・キャンセルのルールを確認',
    '支払い方法（割り勘、カード等）を事前確認',
  ];

  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.tipsCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, styles.orangeIcon]}>
            <Ionicons name="bulb" size={20} color={Colors.warning[600]} />
          </View>
          <Text style={styles.sectionTitle}>予約のコツ</Text>
        </View>

        <View style={styles.tipsContainer}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.memberCountTip}>
          <Ionicons name="people" size={16} color={Colors.primary[600]} />
          <Text style={styles.memberCountTipText}>
            今回は{memberCount}名での予約になります
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  tipsCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeIcon: {
    backgroundColor: Colors.warning[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary[700],
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  memberCountTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary[50],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  memberCountTipText: {
    fontSize: 14,
    color: Colors.primary[700],
    fontWeight: '500',
  },
});
