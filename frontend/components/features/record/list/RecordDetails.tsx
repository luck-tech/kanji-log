import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExtendedSharedRecord } from '@/types/features/record';
import { Colors } from '@/constants';

interface RecordDetailsProps {
  record: ExtendedSharedRecord;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({ record }) => {
  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatLocation = (address: string) => {
    // 住所から区や市を抽出して簡潔に表示
    const parts = address.split(/[都道府県市区町村]/);
    if (parts.length >= 2) {
      return parts[1].split(/[丁目番地号]/)[0];
    }
    return address;
  };

  return (
    <View style={styles.container}>
      {/* 価格情報 */}
      <View style={styles.infoRow}>
        <Ionicons name="wallet-outline" size={16} color={Colors.neutral[500]} />
        <Text style={styles.infoText}>
          {formatCurrency(record.eventLog.costPerPerson)}/人
        </Text>
        <Text style={styles.totalCostText}>
          (総額: {formatCurrency(record.eventLog.totalCost)})
        </Text>
      </View>

      {/* 場所情報 */}
      <View style={styles.infoRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={Colors.neutral[500]}
        />
        <Text style={styles.infoText} numberOfLines={1}>
          {formatLocation(record.eventLog.venue.address)}
        </Text>
        <Text style={styles.genreText}>• {record.eventLog.venue.genre}</Text>
      </View>

      {/* 参加者数・日付 */}
      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color={Colors.neutral[500]} />
        <Text style={styles.infoText}>{record.participantCount}名参加</Text>
        <Text style={styles.dateText}>• {record.eventDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 6,
    flex: 1,
  },
  totalCostText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  genreText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
});
