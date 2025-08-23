import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/common';
import {
  MemberProfileHeader,
  MemberPreferencesCard,
  MemberNotesCard,
  MemberActionsCard,
  MemberEditModal,
  type MemberEditData,
} from '@/components/features/member';
import { Colors } from '@/constants';
import { Member } from '@/types/features/member';

// Mock data
const mockMemberDetail: Member = {
  id: '1',
  name: '田中太郎',
  department: '営業部',
  notes: '辛い物が苦手、静かな店舗を希望',
  createdAt: '2024-01-15',
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
  const [member] = useState<Member>(mockMemberDetail);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

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

  const convertToEditData = (member: Member): MemberEditData => {
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
          <View style={[styles.content, { paddingBottom: insets.bottom }]}>
            {/* プロフィール概要 */}
            <MemberProfileHeader member={member} />

            {/* 食事の好み・制限 */}
            {member.preferences && (
              <MemberPreferencesCard preferences={member.preferences} />
            )}

            {/* メモ */}
            {member.notes && <MemberNotesCard notes={member.notes} />}

            {/* アクション */}
            <MemberActionsCard
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
            />
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
});
