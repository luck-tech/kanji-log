import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/common/Header';
import { AccountDeleteModal } from '../../components/modals/AccountDeleteModal';
import {
  ProfileEditModal,
  ProfileEditData,
} from '../../components/modals/ProfileEditModal';
import {
  ProfileCard,
  StatsCard,
  SettingsGroup,
  AppInfoCard,
} from '../../src/components/features/settings';
import {
  UserData,
  SettingsItem,
  StatData,
  AppInfo,
} from '../../src/types/features/setting';
import { Layout } from '../../constants/Layout';

export default function SettingsScreen() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isProfileEditVisible, setIsProfileEditVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data - 新しい型に合わせて調整
  const userData: UserData = {
    name: '幹事太郎',
    gender: '男性',
    prefecture: '東京都',
    followCount: 24,
    followerCount: 18,
    joinDate: '2024年1月15日',
  };

  // プロフィールが自分のものかどうかの判定（実際にはpropsやparamsから取得）
  const isOwnProfile = true;

  // Stats data
  const statsData: StatData[] = [
    {
      value: 12,
      label: '主催イベント',
      variant: 'primary',
    },
    {
      value: 8,
      label: '共有記録',
      variant: 'success',
    },
    {
      value: 45,
      label: 'メンバー記録数',
      variant: 'accent',
    },
  ];

  // App info data
  const appInfo: AppInfo = {
    name: '幹事ログ',
    version: '1.0.0',
    description: '飲み会の企画・管理をスマートにサポートするアプリ',
  };

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

      <View style={styles.spacing} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Section */}
        <ProfileCard
          userData={userData}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEditProfile={handleEditProfile}
          onFollowToggle={handleFollowToggle}
        />

        {/* Stats Section */}
        <StatsCard stats={statsData} />

        {/* Settings List */}
        <SettingsGroup items={settingsItems} />

        {/* App Info */}
        <AppInfoCard appInfo={appInfo} />
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
  spacing: {
    height: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Layout.padding.lg,
  },
  scrollViewContent: {
    paddingBottom: 120,
    gap: Layout.spacing.md,
  },
});
