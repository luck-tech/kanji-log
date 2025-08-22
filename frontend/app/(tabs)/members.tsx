import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import { Header } from '@/components/common';
import {
  MemberSearchBar,
  MembersList,
  MembersEmptyState,
  MemberAddModal,
  type MemberData,
} from '@/components/features/member';
import { Colors } from '@/constants/Colors';
import { Member } from '@/types/features/member';

// Mock data - Member型に合わせて修正
const mockMembers: Member[] = [
  {
    id: '1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    department: '営業部',
    createdAt: '2024-01-15',
    preferences: {
      allergies: ['魚介類'],
      favoriteGenres: ['和食'],
      budgetRange: { min: 3000, max: 5000 },
      alcoholPreference: 'no',
      dietaryRestrictions: [],
    },
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    department: '開発部',
    createdAt: '2024-01-10',
    preferences: {
      allergies: [],
      favoriteGenres: ['イタリアン', '中華'],
      budgetRange: { min: 2000, max: 4000 },
      alcoholPreference: 'yes',
      dietaryRestrictions: [],
    },
  },
  {
    id: '3',
    name: '鈴木次郎',
    email: 'suzuki@example.com',
    department: '人事部',
    createdAt: '2024-01-05',
    preferences: {
      allergies: ['卵'],
      favoriteGenres: ['和食', 'フレンチ'],
      budgetRange: { min: 4000, max: 8000 },
      alcoholPreference: 'sometimes',
      dietaryRestrictions: ['ベジタリアン対応希望'],
    },
  },
];

export default function MembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // フィルタリング
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.department &&
        member.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMemberPress = (member: Member) => {
    router.push(`/member/${member.id}`);
  };

  const handleAddMember = () => {
    setIsAddModalVisible(true);
  };

  const handleSaveMember = (memberData: MemberData) => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...memberData,
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  // フォーカス時の処理
  useFocusEffect(
    useCallback(() => {
      // TODO: API call to refresh members
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title="メンバー"
        subtitle={`${members.length}人のメンバー`}
        variant="gradient"
      />

      <View style={styles.content}>
        <MemberSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddPress={handleAddMember}
        />

        {filteredMembers.length > 0 ? (
          <MembersList
            members={filteredMembers}
            onMemberPress={handleMemberPress}
          />
        ) : (
          <MembersEmptyState searchQuery={searchQuery} />
        )}
      </View>

      <MemberAddModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddMember={handleSaveMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
});
