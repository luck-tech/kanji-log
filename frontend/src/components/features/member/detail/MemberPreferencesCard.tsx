import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../common/ui';
import { AlcoholPreferenceBadge } from './AlcoholPreferenceBadge';
import { AllergiesTagsList } from './AllergiesTagsList';
import { FavoriteGenresTagsList } from './FavoriteGenresTagsList';
import { BudgetRangeDisplay } from './BudgetRangeDisplay';
import { BaseComponentProps } from '../../../../types/common/ui';
import { MemberPreferences } from '../../../../types/features/member';
import { Colors } from '@/constants';
interface MemberPreferencesCardProps extends BaseComponentProps {
  preferences: MemberPreferences;
}

/**
 * メンバー嗜好カード - 食事の好み・制限表示
 */
export const MemberPreferencesCard: React.FC<MemberPreferencesCardProps> = ({
  preferences,
  style,
  testID,
}) => {
  return (
    <Card variant="elevated" shadow="none" style={style} testID={testID}>
      <View style={styles.cardContent}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, styles.orangeIcon]}>
            <Ionicons name="restaurant" size={20} color={Colors.warning[500]} />
          </View>
          <Text style={styles.sectionTitle}>食事の好み・制限</Text>
        </View>

        <View style={styles.preferencesContent}>
          {/* アルコール */}
          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceLabel}>アルコール</Text>
            <AlcoholPreferenceBadge
              preference={preferences.alcoholPreference}
            />
          </View>

          {/* アレルギー */}
          {preferences.allergies && preferences.allergies.length > 0 && (
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceLabel}>アレルギー</Text>
              <AllergiesTagsList allergies={preferences.allergies} />
            </View>
          )}

          {/* 好きなジャンル */}
          {preferences.favoriteGenres &&
            preferences.favoriteGenres.length > 0 && (
              <View style={styles.preferenceSection}>
                <Text style={styles.preferenceLabel}>好きな料理ジャンル</Text>
                <FavoriteGenresTagsList genres={preferences.favoriteGenres} />
              </View>
            )}

          {/* 予算帯 */}
          {preferences.budgetRange && (
            <View style={styles.preferenceSection}>
              <Text style={styles.preferenceLabel}>希望予算帯</Text>
              <BudgetRangeDisplay budgetRange={preferences.budgetRange} />
            </View>
          )}
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
  sectionIcon: {
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
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  preferencesContent: {
    gap: 16,
  },
  preferenceSection: {
    gap: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
});
