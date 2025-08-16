import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

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
      <View style={styles.memberList}>
        {filteredMembers.map((member) => (
          <Card key={member.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberDepartment}>
                  {member.department || '部署未設定'}
                </Text>
              </View>
              <View style={styles.memberStats}>
                <Text style={styles.participationCount}>
                  {member.eventsParticipated}
                </Text>
                <Text style={styles.participationLabel}>参加</Text>
              </View>
            </View>

            <View style={styles.memberDetails}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={16} color={Colors.gray[500]} />
                <Text style={styles.contactText}>{member.email}</Text>
              </View>
              {member.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.contactText}>{member.phone}</Text>
                </View>
              )}
            </View>

            <View style={styles.memberActions}>
              <Button
                title="連絡する"
                onPress={() => handleContactMember(member)}
                variant="outline"
                size="sm"
                style={styles.contactButton}
              />
            </View>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="メンバーリスト"
        subtitle="イベントに参加可能なメンバー一覧"
      />

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="名前、メール、部署で検索"
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Ionicons name="search-outline" size={20} color={Colors.gray[400]} />}
          containerStyle={styles.searchInput}
        />
        <Button
          onPress={handleAddMember}
          icon={<Ionicons name="person-add-outline" size={20} color={Colors.white} />}
          style={styles.addButton}
        />
      </View>

      {/* Members List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderMembers()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    gap: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.borderRadius.md,
  },
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  memberList: {
    gap: Layout.spacing.md,
  },
  memberCard: {
    padding: Layout.padding.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...Typography.h4,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  memberDepartment: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  memberStats: {
    alignItems: 'center',
  },
  participationCount: {
    ...Typography.h4,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  participationLabel: {
    ...Typography.caption,
    color: Colors.gray[500],
  },
  memberDetails: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  contactText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  memberActions: {
    alignItems: 'flex-end',
  },
  contactButton: {
    minWidth: 80,
  },
});
