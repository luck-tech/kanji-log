import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import {
  MemberEditModal,
  MemberEditData,
} from '@/components/modals/MemberEditModal';
import { Colors } from '@/constants/Colors';

interface MemberDetail {
  id: string;
  name: string;
  department?: string;
  notes?: string;
  preferences?: {
    allergies?: string[];
    favoriteGenres?: string[];
    budgetRange?: { min: number; max: number };
    alcoholPreference?: 'yes' | 'no' | 'sometimes';
    dietaryRestrictions?: string[];
  };
}

// Mock data
const mockMemberDetail: MemberDetail = {
  id: '1',
  name: '田中太郎',
  department: '営業部',
  notes: '辛い物が苦手、静かな店舗を希望',
  preferences: {
    allergies: ['魚介類', '甲殻類'],
    favoriteGenres: ['和食', 'イタリアン'],
    budgetRange: { min: 3000, max: 5000 },
    alcoholPreference: 'no',
    dietaryRestrictions: ['ベジタリアン対応希望'],
  },
};

export default function MemberDetailScreen() {
  const router = useRouter();
  const [member] = useState<MemberDetail>(mockMemberDetail);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEditMember = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveMember = (memberData: MemberEditData) => {
    console.log('Member saved:', memberData);
    // TODO: API call to update member
  };

  const convertToEditData = (member: MemberDetail): MemberEditData => {
    return {
      name: member.name,
      department: member.department || '',
      notes: member.notes || '',
      preferences: {
        allergies: member.preferences?.allergies || [],
        favoriteGenres: member.preferences?.favoriteGenres || [],
        budgetRange: member.preferences?.budgetRange || {
          min: 3000,
          max: 5000,
        },
        alcoholPreference: member.preferences?.alcoholPreference || 'yes',
        dietaryRestrictions: member.preferences?.dietaryRestrictions || [],
      },
    };
  };

  const handleDeleteMember = () => {
    Alert.alert(
      'メンバー削除',
      `${member.name}さんをメンバーリストから削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            console.log('Member deleted');
            router.back();
          },
        },
      ]
    );
  };

  const getAlcoholPreferenceStyle = (preference: string) => {
    switch (preference) {
      case 'yes':
        return {
          container: styles.successContainer,
          text: styles.successText,
          label: '飲める',
        };
      case 'no':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
          label: '飲めない',
        };
      default:
        return {
          container: styles.warningContainer,
          text: styles.warningText,
          label: 'たまに飲む',
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <Header
          title={member.name}
          subtitle={member.department || 'メンバー詳細'}
          variant="gradient"
          leftIcon="arrow-back"
          onLeftPress={handleBackPress}
          rightIcon="create-outline"
          onRightPress={handleEditMember}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* プロフィール概要 */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberDepartment}>
                      {member.department || '部署未設定'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* 好み・制限事項 */}
            {member.preferences && (
              <Card variant="elevated" shadow="none">
                <View style={styles.cardContent}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionIcon, styles.orangeIcon]}>
                      <Ionicons
                        name="restaurant"
                        size={20}
                        color={Colors.warning[500]}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>食事の好み・制限</Text>
                  </View>

                  <View style={styles.preferencesContent}>
                    {/* アルコール */}
                    <View style={styles.preferenceSection}>
                      <Text style={styles.preferenceLabel}>アルコール</Text>
                      {(() => {
                        const alcoholStyle = getAlcoholPreferenceStyle(
                          member.preferences!.alcoholPreference || 'yes'
                        );
                        return (
                          <View style={alcoholStyle.container}>
                            <Text style={alcoholStyle.text}>
                              {alcoholStyle.label}
                            </Text>
                          </View>
                        );
                      })()}
                    </View>

                    {/* アレルギー */}
                    {member.preferences.allergies &&
                      member.preferences.allergies.length > 0 && (
                        <View style={styles.preferenceSection}>
                          <Text style={styles.preferenceLabel}>アレルギー</Text>
                          <View style={styles.tagsContainer}>
                            {member.preferences.allergies.map(
                              (allergy, index) => (
                                <View key={index} style={styles.allergyTag}>
                                  <Text style={styles.allergyTagText}>
                                    {allergy}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}

                    {/* 好きなジャンル */}
                    {member.preferences.favoriteGenres &&
                      member.preferences.favoriteGenres.length > 0 && (
                        <View style={styles.preferenceSection}>
                          <Text style={styles.preferenceLabel}>
                            好きな料理ジャンル
                          </Text>
                          <View style={styles.tagsContainer}>
                            {member.preferences.favoriteGenres.map(
                              (genre, index) => (
                                <View key={index} style={styles.genreTag}>
                                  <Text style={styles.genreTagText}>
                                    {genre}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}

                    {/* 予算帯 */}
                    {member.preferences.budgetRange && (
                      <View style={styles.preferenceSection}>
                        <Text style={styles.preferenceLabel}>希望予算帯</Text>
                        <View style={styles.budgetContainer}>
                          <Text style={styles.budgetText}>
                            ¥
                            {member.preferences.budgetRange.min.toLocaleString()}
                            - ¥
                            {member.preferences.budgetRange.max.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            )}

            {/* メモ */}
            {member.notes && (
              <Card variant="elevated" shadow="none">
                <View style={styles.cardContent}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionIcon, styles.accentIcon]}>
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={Colors.accent[600]}
                      />
                    </View>
                    <Text style={styles.sectionTitle}>メモ</Text>
                  </View>

                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{member.notes}</Text>
                  </View>
                </View>
              </Card>
            )}

            {/* アクション */}
            <Card variant="elevated" shadow="none">
              <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, styles.warningIcon]}>
                    <Ionicons
                      name="settings"
                      size={20}
                      color={Colors.warning[500]}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>アクション</Text>
                </View>

                <View style={styles.actionsContainer}>
                  <Button
                    title="プロフィールを編集"
                    onPress={handleEditMember}
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={
                      <Ionicons name="create-outline" size={18} color="white" />
                    }
                  />

                  <Button
                    title="メンバーを削除"
                    onPress={handleDeleteMember}
                    variant="outline"
                    size="md"
                    fullWidth
                    icon={
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={Colors.error[500]}
                      />
                    }
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>

        <MemberEditModal
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveMember}
          initialData={convertToEditData(member)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  cardContent: {
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  memberDepartment: {
    color: Colors.neutral[600],
    fontSize: 16,
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
  accentIcon: {
    backgroundColor: Colors.accent[100],
  },
  warningIcon: {
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
  successContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.success[100],
    borderRadius: 12,
  },
  successText: {
    fontWeight: '500',
    color: Colors.success[700],
  },
  errorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.error[100],
    borderRadius: 12,
  },
  errorText: {
    fontWeight: '500',
    color: Colors.error[700],
  },
  warningContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.warning[100],
    borderRadius: 12,
  },
  warningText: {
    fontWeight: '500',
    color: Colors.warning[700],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.error[100],
    borderRadius: 20,
  },
  allergyTagText: {
    color: Colors.error[700],
    fontWeight: '500',
    fontSize: 14,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.primary[100],
    borderRadius: 20,
  },
  genreTagText: {
    color: Colors.primary[700],
    fontWeight: '500',
    fontSize: 14,
  },
  budgetContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.success[100],
    borderRadius: 12,
  },
  budgetText: {
    color: Colors.success[700],
    fontWeight: '500',
  },
  notesContainer: {
    padding: 16,
    backgroundColor: Colors.accent[50],
    borderRadius: 12,
  },
  notesText: {
    color: Colors.accent[800],
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 12,
  },
});
