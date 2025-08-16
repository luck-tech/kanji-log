import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { 
  Users, 
  UserPlus, 
  Mail,
  Phone,
  Search,
} from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
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
      const filtered = mockMembers.filter(member =>
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.department?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleAddMember = () => {
    console.log('Add member');
  };

  const handleContactMember = (member: Member) => {
    console.log('Contact member:', member.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>メンバーリスト</Text>
        <Text style={styles.headerSubtitle}>
          イベントに参加可能なメンバー一覧
        </Text>
      </View>

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="名前、メール、部署で検索"
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={Colors.gray[400]} />}
          containerStyle={styles.searchInput}
        />
        <Button
          title=""
          onPress={handleAddMember}
          icon={<UserPlus size={20} color={Colors.white} />}
          style={styles.addButton}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <View style={styles.statItem}>
            <Users size={24} color={Colors.primary[600]} />
            <View style={styles.statText}>
              <Text style={styles.statNumber}>{mockMembers.length}</Text>
              <Text style={styles.statLabel}>総メンバー数</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Members List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredMembers.length > 0 ? (
          <View style={styles.memberList}>
            {filteredMembers.map((member) => (
              <Card key={member.id} style={styles.memberCard}>
                <View style={styles.memberHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {member.name.charAt(0)}
                    </Text>
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
                    <Mail size={16} color={Colors.gray[500]} />
                    <Text style={styles.contactText}>{member.email}</Text>
                  </View>
                  {member.phone && (
                    <View style={styles.contactItem}>
                      <Phone size={16} color={Colors.gray[500]} />
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
        ) : (
          <View style={styles.emptyState}>
            <Users size={48} color={Colors.gray[400]} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? '該当するメンバーが見つかりません' : 'メンバーがいません'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? '検索条件を変更してお試しください' 
                : '新しいメンバーを追加してイベントに招待しましょう'
              }
            </Text>
            {!searchQuery && (
              <Button
                title="メンバーを追加"
                onPress={handleAddMember}
                style={styles.emptyActionButton}
                icon={<UserPlus size={20} color={Colors.white} />}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.lg,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    alignItems: 'flex-start',
    gap: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    paddingHorizontal: Layout.padding.sm,
    minWidth: 44,
    marginTop: 24,
  },
  statsContainer: {
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.md,
  },
  statsCard: {
    padding: Layout.padding.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  statText: {
    alignItems: 'flex-start',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.gray[900],
  },
  statLabel: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  memberList: {
    gap: Layout.spacing.md,
  },
  memberCard: {
    marginBottom: Layout.spacing.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.white,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...Typography.h4,
    color: Colors.gray[900],
    marginBottom: 2,
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
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  contactText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  memberActions: {
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.padding.xxl,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.gray[600],
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.body2,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Layout.spacing.lg,
  },
  emptyActionButton: {
    marginTop: Layout.spacing.md,
  },
});