import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  department?: string;
  joinedAt: string;
  eventsParticipated: number;
}

// Mock data
const mockMembers: Member[] = [
  {
    id: '1',
    name: '山田太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    department: '営業部',
    joinedAt: '2024-01-15',
    eventsParticipated: 5,
  },
  {
    id: '2',
    name: '田中花子',
    email: 'tanaka@example.com',
    department: '開発部',
    joinedAt: '2024-01-10',
    eventsParticipated: 3,
  },
  {
    id: '3',
    name: '佐藤次郎',
    email: 'sato@example.com',
    phone: '090-9876-5432',
    department: '人事部',
    joinedAt: '2024-01-05',
    eventsParticipated: 7,
  },
];

export default function MembersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMembers(mockMembers);
    } else {
      const filtered = mockMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()) ||
          member.department?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleAddMember = () => {
    console.log('Add member');
    // TODO: Navigate to member creation page
  };

  const handleContactMember = (member: Member) => {
    console.log('Contact member:', member.name);
    // TODO: Open contact options
  };

  const renderMembers = () => {
    if (filteredMembers.length === 0) {
      const title = searchQuery
        ? '該当するメンバーが見つかりません'
        : 'メンバーがいません';
      const description = searchQuery
        ? '検索条件を変更してお試しください'
        : '新しいメンバーを追加してイベントに招待しましょう';

      return (
        <EmptyState icon="people-outline" title={title} description={description} />
      );
    }

    return (
      <View className="gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-4">
                <Text className="text-lg font-semibold text-blue-600">
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {member.department || '部署未設定'}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-blue-600">
                  {member.eventsParticipated}
                </Text>
                <Text className="text-xs text-gray-500">参加</Text>
              </View>
            </View>

            <View className="gap-2 mb-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="mail-outline" size={16} color="#6b7280" />
                <Text className="text-sm text-gray-600">{member.email}</Text>
              </View>
              {member.phone && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="call-outline" size={16} color="#6b7280" />
                  <Text className="text-sm text-gray-600">{member.phone}</Text>
                </View>
              )}
            </View>

            <View className="items-end">
              <Button
                title="連絡する"
                onPress={() => handleContactMember(member)}
                variant="outline"
                size="sm"
                className="min-w-20"
              />
            </View>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="メンバーリスト"
        subtitle="イベントに参加可能なメンバー一覧"
      />

      {/* Search and Add */}
      <View className="flex-row px-6 py-4 bg-white border-b border-gray-100 gap-3">
        <Input
          placeholder="名前、メール、部署で検索"
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Ionicons name="search-outline" size={20} color="#9ca3af" />}
          className="flex-1"
        />
        <Button
          onPress={handleAddMember}
          icon={<Ionicons name="person-add-outline" size={20} color="white" />}
          className="w-11 h-11 rounded-md"
        />
      </View>

      {/* Members List */}
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {renderMembers()}
      </ScrollView>
    </SafeAreaView>
  );
}
