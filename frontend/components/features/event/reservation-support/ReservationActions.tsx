import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/utils/constants/design/colors';

interface ReservationActionsProps extends BaseComponentProps {
  onCallRestaurant: () => void;
  onOpenMap: () => void;
  onOpenReservationSite: () => void;
  onShareReservationInfo: () => void;
  hasReservationUrl: boolean;
  hasMapUrl: boolean;
}

/**
 * 予約アクションボタン群 - 電話、地図、予約サイト、共有などの操作ボタンを表示するコンポーネント
 */
export const ReservationActions: React.FC<ReservationActionsProps> = ({
  onCallRestaurant,
  onOpenMap,
  onOpenReservationSite,
  onShareReservationInfo,
  hasReservationUrl,
  hasMapUrl,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.actionsCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, styles.greenIcon]}>
            <Ionicons name="call" size={20} color={Colors.success[600]} />
          </View>
          <Text style={styles.sectionTitle}>予約手続き</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={onCallRestaurant}
            style={styles.primaryButton}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.primaryButtonText}>店舗に電話する</Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            {hasMapUrl && (
              <TouchableOpacity
                onPress={onOpenMap}
                style={styles.secondaryButton}
              >
                <Ionicons
                  name="location"
                  size={18}
                  color={Colors.primary[600]}
                />
                <Text style={styles.secondaryButtonText}>地図を開く</Text>
              </TouchableOpacity>
            )}

            {hasReservationUrl && (
              <TouchableOpacity
                onPress={onOpenReservationSite}
                style={styles.secondaryButton}
              >
                <Ionicons name="globe" size={18} color={Colors.primary[600]} />
                <Text style={styles.secondaryButtonText}>予約サイト</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onShareReservationInfo}
              style={styles.secondaryButton}
            >
              <Ionicons name="share" size={18} color={Colors.primary[600]} />
              <Text style={styles.secondaryButtonText}>情報共有</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  actionsCard: {
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
  greenIcon: {
    backgroundColor: Colors.success[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  actionButtons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.success[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Colors.primary[50],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  secondaryButtonText: {
    color: Colors.primary[700],
    fontSize: 14,
    fontWeight: '500',
  },
});
