import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/ui';
import { BaseComponentProps } from '@/types/common/ui';
import { Colors } from '@/utils/constants/design/colors';

interface RestaurantContactInfoProps extends BaseComponentProps {
  restaurantName: string;
  restaurantGenre: string;
  address: string;
  phone: string;
  features: string[];
}

/**
 * レストラン連絡先情報 - 選択された店舗の基本情報と連絡先を表示するコンポーネント
 */
export const RestaurantContactInfo: React.FC<RestaurantContactInfoProps> = ({
  restaurantName,
  restaurantGenre,
  address,
  phone,
  features,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.restaurantCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, styles.redIcon]}>
            <Ionicons name="restaurant" size={20} color={Colors.error[500]} />
          </View>
          <Text style={styles.sectionTitle}>選択されたお店</Text>
        </View>

        <View style={styles.restaurantInfo}>
          <View>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.restaurantGenre}>{restaurantGenre}</Text>
          </View>

          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Ionicons name="location" size={18} color={Colors.neutral[500]} />
              <Text style={styles.contactText}>{address}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={18} color={Colors.neutral[500]} />
              <Text style={styles.contactText}>{phone}</Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureChip}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  restaurantCard: {
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
  redIcon: {
    backgroundColor: Colors.error[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  restaurantInfo: {
    gap: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  restaurantGenre: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  contactCard: {
    backgroundColor: Colors.neutral[50],
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: '500',
  },
});
