import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Input, Button } from '../../../common/ui';
import { BaseComponentProps } from '../../../../types/common/ui';
import { ReservationForm } from '../../../../types/features/event';
import { Colors } from '../../../../utils/constants/design/colors';

interface ReservationReportFormProps extends BaseComponentProps {
  form: ReservationForm;
  onFormChange: (field: keyof ReservationForm, value: string) => void;
  onReservationComplete: () => void;
  onReservationFailed: () => void;
}

/**
 * 予約完了報告フォーム - 予約結果の報告と詳細入力フォームを表示するコンポーネント
 */
export const ReservationReportForm: React.FC<ReservationReportFormProps> = ({
  form,
  onFormChange,
  onReservationComplete,
  onReservationFailed,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.reportCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, styles.blueIcon]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.primary[600]}
            />
          </View>
          <Text style={styles.sectionTitle}>予約結果の報告</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="予約者名"
            placeholder="予約した方のお名前を入力"
            value={form.contactPerson}
            onChangeText={(text) => onFormChange('contactPerson', text)}
          />

          <Input
            label="予約ID（任意）"
            placeholder="予約番号があれば入力"
            value={form.reservationId}
            onChangeText={(text) => onFormChange('reservationId', text)}
          />

          <Input
            label="特別なリクエスト（任意）"
            placeholder="アレルギー対応、個室希望など"
            value={form.specialRequests}
            onChangeText={(text) => onFormChange('specialRequests', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="予約完了"
            onPress={onReservationComplete}
            variant="gradient"
            size="lg"
            fullWidth
            icon={<Ionicons name="checkmark" size={20} color="white" />}
          />

          <Button
            title="予約できませんでした"
            onPress={onReservationFailed}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Ionicons name="close" size={20} color={Colors.error[600]} />}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  reportCard: {
    gap: 20,
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
  blueIcon: {
    backgroundColor: Colors.primary[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  formContainer: {
    gap: 16,
  },
  actionButtons: {
    gap: 12,
  },
});
