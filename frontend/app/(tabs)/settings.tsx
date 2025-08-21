import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { AccountDeleteModal } from '@/components/modals/AccountDeleteModal';
import {
  ProfileEditModal,
  ProfileEditData,
} from '@/components/modals/ProfileEditModal';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface SettingsItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onPress: () => void;
  showArrow?: boolean;
  textColor?: string;
}

export default function SettingsScreen() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isProfileEditVisible, setIsProfileEditVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data
  const userData = {
    name: '幹事太郎',
    gender: '男性',
    prefecture: '東京都',
    followCount: 24,
    followerCount: 18,
    joinDate: '2024年1月15日',
  };

  // プロフィールが自分のものかどうかの判定（実際にはpropsやparamsから取得）
  const isOwnProfile = true;

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow user
  };

  const handleEditProfile = () => {
    setIsProfileEditVisible(true);
  };

  const handleSaveProfile = (profileData: ProfileEditData) => {
    console.log('Profile saved:', profileData);
    // TODO: API call to update profile
  };

  const getCurrentProfileData = (): ProfileEditData => {
    return {
      name: userData.name,
      gender: userData.gender,
      prefecture: userData.prefecture,
      nearestStation: '新宿駅',
      company: '株式会社サンプル',
      department: '営業部',
      jobTitle: '課長',
      phone: '090-1234-5678',
      notifications: {
        eventUpdates: true,
        reminders: true,
        suggestions: false,
        follows: true,
      },
      preferences: {
        preferredBudgetRange: { min: 3000, max: 5000 },
        preferredGenres: ['和食', 'イタリアン'],
        language: 'ja',
        theme: 'auto',
      },
      privacy: {
        shareRecords: true,
        useCompanyInfo: true,
      },
    };
  };

  const handleNotifications = () => {
    console.log('Notification settings');
  };

  const handlePrivacy = () => {
    console.log('Privacy settings');
  };

  const handleSupport = () => {
    console.log('Support');
  };

  const handleLogout = () => {
    Alert.alert('ログアウト', 'アカウントからログアウトしますか？', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: 'ログアウト',
        style: 'destructive',
        onPress: () => {
          console.log('Logout');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalVisible(true);
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'notifications',
      title: '通知設定',
      description: 'イベントの更新やリマインダーの設定',
      icon: <Ionicons name="notifications-outline" size={24} color="#0284c7" />,
      onPress: handleNotifications,
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'プライバシー・セキュリティ',
      description: 'アカウントの安全性とイベント情報の共有設定',
      icon: <Ionicons name="shield-outline" size={24} color="#0284c7" />,
      onPress: handlePrivacy,
      showArrow: true,
    },
    {
      id: 'support',
      title: 'ヘルプ・サポート',
      description: '使い方や問題の解決方法',
      icon: <Ionicons name="help-circle-outline" size={24} color="#0284c7" />,
      onPress: handleSupport,
      showArrow: true,
    },
    {
      id: 'logout',
      title: 'ログアウト',
      icon: <Ionicons name="log-out-outline" size={24} color="#ef4444" />,
      onPress: handleLogout,
      textColor: '#ef4444',
    },
    {
      id: 'delete',
      title: 'アカウントを削除',
      description: '個人データが削除されます（共有記録は保持されます）',
      icon: <Ionicons name="trash-outline" size={24} color="#dc2626" />,
      onPress: handleDeleteAccount,
      textColor: '#dc2626',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <Header
        title="設定"
        subtitle="アカウントとアプリ設定の管理"
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Section */}
        <Card variant="elevated" shadow="medium">
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={36} color="white" />
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.name}</Text>
            </View>
            {isOwnProfile ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={20} color="#0284c7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing
                    ? styles.followingButton
                    : styles.notFollowingButton,
                ]}
                onPress={handleFollowToggle}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing
                      ? styles.followingText
                      : styles.notFollowingText,
                  ]}
                >
                  {isFollowing ? 'フォロー中' : 'フォロー'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileDetailItem}>
              <View style={styles.profileDetailIcon}>
                <Ionicons name="person-outline" size={16} color="#64748b" />
              </View>
              <Text style={styles.profileDetailText}>{userData.gender}</Text>
            </View>
            <View style={styles.profileDetailItem}>
              <View style={styles.profileDetailIcon}>
                <Ionicons name="location-outline" size={16} color="#64748b" />
              </View>
              <Text style={styles.profileDetailText}>
                {userData.prefecture}
              </Text>
            </View>
            <View style={styles.profileDetailItem}>
              <View style={styles.profileDetailIcon}>
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
              </View>
              <Text style={styles.profileDetailText}>
                {userData.joinDate}から利用開始
              </Text>
            </View>
          </View>

          {/* フォロー/フォロワー情報 */}
          <View style={styles.followStats}>
            <View style={styles.followStatItem}>
              <Text style={styles.followStatNumber}>
                {userData.followCount}
              </Text>
              <Text style={styles.followStatLabel}>フォロー</Text>
            </View>
            <View style={styles.followStatSeparator} />
            <View style={styles.followStatItem}>
              <Text style={styles.followStatNumber}>
                {userData.followerCount}
              </Text>
              <Text style={styles.followStatLabel}>フォロワー</Text>
            </View>
          </View>
        </Card>

        {/* Stats Section */}
        <Card variant="gradient" shadow="medium">
          <Text style={styles.sectionTitle}>幹事統計</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.primaryStat]}>
                <Text style={styles.statNumber}>12</Text>
              </View>
              <Text style={styles.statLabel}>主催イベント</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.successStat]}>
                <Text style={styles.statNumberSuccess}>8</Text>
              </View>
              <Text style={styles.statLabel}>共有記録</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.accentStat]}>
                <Text style={styles.statNumberAccent}>45</Text>
              </View>
              <Text style={styles.statLabel}>メンバー記録数</Text>
            </View>
          </View>
        </Card>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <Card variant="elevated" shadow="soft">
                <View style={styles.settingsItem}>
                  <View style={styles.settingsItemContent}>
                    <View style={styles.settingsItemIcon}>{item.icon}</View>
                    <View style={styles.settingsItemText}>
                      <Text
                        style={[
                          styles.settingsItemTitle,
                          item.textColor && { color: item.textColor },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text style={styles.settingsItemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {item.showArrow && (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#94a3b8"
                    />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.appIcon}
          >
            <Ionicons name="wine" size={28} color="white" />
          </LinearGradient>
          <Text style={styles.appTitle}>幹事ログ</Text>
          <Text style={styles.appVersion}>バージョン 1.0.0</Text>
          <Text style={styles.appDescription}>
            飲み会の企画・管理をスマートにサポートするアプリ
          </Text>
          <Text style={styles.copyright}>
            © 2025 幹事ログ. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      <ProfileEditModal
        isVisible={isProfileEditVisible}
        onClose={() => setIsProfileEditVisible(false)}
        onSave={handleSaveProfile}
        initialData={getCurrentProfileData()}
      />

      <AccountDeleteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirmDelete={() => {
          console.log('アカウントを削除しました');
          Alert.alert('完了', 'アカウントが削除されました');
        }}
      />
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
  scrollView: {
    flex: 1,
    paddingHorizontal: Layout.padding.lg,
  },
  scrollViewContent: {
    paddingBottom: 120,
    gap: Layout.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.xs,
  },
  editButton: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.neutral[100],
  },
  followButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
  },
  followingButton: {
    backgroundColor: Colors.neutral[100],
  },
  notFollowingButton: {
    backgroundColor: Colors.primary[600],
  },
  followButtonText: {
    fontWeight: '500',
  },
  followingText: {
    color: Colors.neutral[700],
  },
  notFollowingText: {
    color: Colors.white,
  },
  profileDetails: {
    gap: Layout.spacing.sm,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  profileDetailIcon: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.neutral[100],
  },
  profileDetailText: {
    fontSize: 16,
    color: Colors.neutral[700],
  },
  followStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Layout.spacing.md,
    marginTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  followStatItem: {
    alignItems: 'center',
  },
  followStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  followStatLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  followStatSeparator: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral[200],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  primaryStat: {
    backgroundColor: Colors.primary[100],
  },
  successStat: {
    backgroundColor: Colors.success[100],
  },
  accentStat: {
    backgroundColor: Colors.accent[100],
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[700],
  },
  statNumberSuccess: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success[700],
  },
  statNumberAccent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent[700],
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  statSeparator: {
    width: 1,
    height: 64,
    backgroundColor: Colors.neutral[200],
  },
  settingsList: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.neutral[100],
    marginRight: Layout.spacing.md,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: Layout.spacing.xs,
  },
  settingsItemDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[600],
    marginBottom: Layout.spacing.sm,
  },
  appVersion: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.sm,
  },
  appDescription: {
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    maxWidth: 300,
  },
  copyright: {
    fontSize: 12,
    color: Colors.neutral[400],
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
});
