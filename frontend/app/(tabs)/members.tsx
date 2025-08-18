import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { MemberAddModal, MemberData } from '@/components/modals/MemberAddModal';
import { useRouter } from 'expo-router';

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
        <View className="flex-1 justify-center items-center py-16">
          <EmptyState
            icon="people-outline"
            title={title}
            description={description}
          />
        </View>
      );
    }

    return (
      <View className="gap-3">
        {filteredMembers.map((member, index) => (
          <TouchableOpacity
            key={member.id}
            onPress={() => handleMemberPress(member)}
            activeOpacity={0.8}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card variant="elevated" shadow="medium" animated={true}>
              <View className="flex-row items-center">
                {/* Member Avatar */}
                <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 justify-center items-center mr-4">
                  <Text className="text-lg font-bold text-primary-700">
                    {member.name.charAt(0)}
                  </Text>
                </View>

                {/* Member Info */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-neutral-900 mb-1">
                    {member.name}
                  </Text>
                  {member.department && (
                    <Text className="text-sm text-neutral-600">
                      {member.department}
                    </Text>
                  )}
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <Header
          title="メンバー"
          subtitle="飲み会に参加可能なメンバー一覧"
          variant="gradient"
        />

        {/* Search Bar with Add Button */}
        <View className="flex-row px-6 py-4 gap-3 bg-transparent">
          <Input
            placeholder="名前、部署で検索"
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon={
              <Ionicons name="search-outline" size={20} color="#64748b" />
            }
            className="flex-1 backdrop-blur-sm border-0 shadow-soft"
          />
          <TouchableOpacity
            onPress={handleAddMember}
            className="w-12 h-12 rounded-2xl bg-primary-600 justify-center items-center shadow-medium"
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Members List */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
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
