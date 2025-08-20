import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { MemberAddModal, MemberData } from '@/components/modals/MemberAddModal';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  department?: string;
  joinedAt: string;
  eventsParticipated: number;
  isActive: boolean;
}

// Mock data
const mockMembers: Member[] = [
  {
    id: '1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    department: '営業部',
    joinedAt: '2024-01-15',
    eventsParticipated: 8,
    isActive: true,
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    department: '開発部',
    joinedAt: '2024-01-10',
    eventsParticipated: 5,
    isActive: true,
  },
  {
    id: '3',
    name: '鈴木次郎',
    email: 'suzuki@example.com',
    phone: '090-9876-5432',
    department: '人事部',
    joinedAt: '2024-01-05',
    eventsParticipated: 12,
    isActive: true,
  },
  {
    id: '4',
    name: '山田三郎',
    email: 'yamada@example.com',
    department: '総務部',
    joinedAt: '2024-01-20',
    eventsParticipated: 3,
    isActive: false,
  },
  {
    id: '5',
    name: '高橋四郎',
    email: 'takahashi@example.com',
    phone: '090-5555-6666',
    department: '開発部',
    joinedAt: '2024-01-12',
    eventsParticipated: 6,
    isActive: true,
  },
];

export default function MembersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState(mockMembers);
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.department?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleMemberPress = (member: Member) => {
    router.push(`/member/${member.id}`);
  };

  const handleAddMember = () => {
    setIsAddModalVisible(true);
  };

  const handleMemberAdd = (memberData: MemberData) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: memberData.name,
      email: '', // デフォルト値として空文字を設定
      department: memberData.department,
      joinedAt: new Date().toISOString().split('T')[0],
      eventsParticipated: 0,
      isActive: true,
    };

    setMembers((prev) => [newMember, ...prev]);
    setFilteredMembers((prev) => [newMember, ...prev]);
  };

  const renderMembers = () => {
    if (filteredMembers.length === 0) {
      const title = searchQuery
        ? '該当するメンバーが見つかりません'
        : 'メンバーがいません';
      const description = searchQuery
        ? '検索条件を変更してお試しください'
        : '新しいメンバーを追加してメモしましょう';

      return (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="people-outline"
            title={title}
            description={description}
          />
        </View>
      );
    }

    return (
      <View style={styles.membersList}>
        {filteredMembers.map((member, index) => (
          <TouchableOpacity
            key={member.id}
            onPress={() => handleMemberPress(member)}
            activeOpacity={0.8}
          >
            <Card variant="elevated" shadow="none">
              <View style={styles.memberCard}>
                {/* Member Avatar */}
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.charAt(0)}
                  </Text>
                </View>

                {/* Member Info */}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.name}
                  </Text>
                  {member.department && (
                    <Text style={styles.memberDepartment}>
                      {member.department}
                    </Text>
                  )}
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={[Colors.neutral[50], Colors.neutral[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <Header
          title="メンバー"
          subtitle="飲み会に参加可能なメンバー一覧"
          variant="gradient"
        />

        {/* Search Bar with Add Button */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="名前、部署で検索"
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon={
              <Ionicons name="search-outline" size={20} color={Colors.neutral[500]} />
            }
            style={styles.searchInput}
          />
          <TouchableOpacity
            onPress={handleAddMember}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Members List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderMembers()}
        </ScrollView>

        <MemberAddModal
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddMember={handleMemberAdd}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  memberDepartment: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
});
