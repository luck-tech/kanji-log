import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filterType);
  };

  const handleFilterChange = (type: 'all' | 'active' | 'inactive') => {
    setFilterType(type);
    applyFilters(searchQuery, type);
  };

  const applyFilters = (query: string, type: 'all' | 'active' | 'inactive') => {
    let filtered = mockMembers;

    // Apply text filter
    if (query.trim() !== '') {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()) ||
          member.department?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply status filter
    if (type === 'active') {
      filtered = filtered.filter(member => member.isActive);
    } else if (type === 'inactive') {
      filtered = filtered.filter(member => !member.isActive);
    }

    setFilteredMembers(filtered);
  };

  const handleMemberPress = (member: Member) => {
    console.log('Member selected:', member.name);
    // TODO: Navigate to member detail page
  };

  const handleAddMember = () => {
    console.log('Add member');
    // TODO: Navigate to add member page
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
        : '新しいメンバーを追加して飲み会に招待しましょう';

      return (
        <View className="flex-1 justify-center items-center py-16">
          <EmptyState icon="people-outline" title={title} description={description} />
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
                <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 justify-center items-center mr-4">
                  <Text className="text-xl font-bold text-primary-700">
                    {member.name.charAt(0)}
                  </Text>
                </View>

                {/* Member Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-lg font-bold text-neutral-900">
                      {member.name}
                    </Text>
                    <View className={`px-2 py-1 rounded-full ${
                      member.isActive ? 'bg-success-100' : 'bg-neutral-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        member.isActive ? 'text-success-700' : 'text-neutral-600'
                      }`}>
                        {member.isActive ? 'アクティブ' : '非アクティブ'}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View className="mb-3">
                    <View className="flex-row items-center mb-1">
                      <View className="p-1 rounded bg-neutral-100 mr-2">
                        <Ionicons name="mail-outline" size={12} color="#64748b" />
                      </View>
                      <Text className="text-sm text-neutral-700">
                        {member.email}
                      </Text>
                    </View>
                    {member.phone && (
                      <View className="flex-row items-center mb-1">
                        <View className="p-1 rounded bg-neutral-100 mr-2">
                          <Ionicons name="call-outline" size={12} color="#64748b" />
                        </View>
                        <Text className="text-sm text-neutral-700">
                          {member.phone}
                        </Text>
                      </View>
                    )}
                    {member.department && (
                      <View className="flex-row items-center">
                        <View className="p-1 rounded bg-neutral-100 mr-2">
                          <Ionicons name="business-outline" size={12} color="#64748b" />
                        </View>
                        <Text className="text-sm text-neutral-700">
                          {member.department}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Stats */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text className="text-xs text-neutral-500 ml-1">
                        {member.eventsParticipated}回参加
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleContactMember(member)}
                      className="px-3 py-1 rounded-full bg-primary-100"
                    >
                      <Text className="text-xs font-semibold text-primary-700">
                        連絡する
                      </Text>
                    </TouchableOpacity>
                  </View>
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

  const filterTabs = [
    { key: 'all' as const, label: 'すべて', color: '#0284c7' },
    { key: 'active' as const, label: 'アクティブ', color: '#10b981' },
    { key: 'inactive' as const, label: '非アクティブ', color: '#f59e0b' },
  ];

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
          title="メンバーリスト"
          subtitle="飲み会に参加可能なメンバー一覧"
          variant="gradient"
          rightIcon="person-add-outline"
          onRightPress={handleAddMember}
        />

        {/* Search Bar */}
        <View className="px-6 py-4 bg-transparent">
          <Input
            placeholder="名前、メール、部署で検索"
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon={<Ionicons name="search-outline" size={20} color="#64748b" />}
            className="bg-white/90 backdrop-blur-sm border-0 shadow-soft"
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-6">
          <View className="flex-row bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-soft">
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 py-3 px-4 rounded-xl ${
                  filterType === tab.key ? '' : ''
                }`}
                onPress={() => handleFilterChange(tab.key)}
                activeOpacity={0.8}
              >
                {filterType === tab.key ? (
                  <LinearGradient
                    colors={['#0ea5e9', '#0284c7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0 rounded-xl"
                  />
                ) : null}
                <Text
                  className={`text-center font-semibold ${
                    filterType === tab.key ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Members List */}
        <ScrollView 
          className="flex-1 px-6 mt-4" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {renderMembers()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
