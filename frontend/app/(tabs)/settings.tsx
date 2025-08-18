import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
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
          title="設定"
          subtitle="アカウントとアプリ設定の管理"
          variant="gradient"
        />

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Section */}
          <Card
            variant="elevated"
            shadow="large"
            animated={true}
            className="mb-6 mt-4"
          >
            <View className="flex-row items-center mb-4">
              <LinearGradient
                colors={['#0ea5e9', '#0284c7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-20 h-20 rounded-3xl justify-center items-center mr-4"
              >
                <Ionicons name="person" size={36} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className="text-xl font-bold text-neutral-900 mb-1">
                  {userData.name}
                </Text>
              </View>
              {isOwnProfile ? (
                <TouchableOpacity
                  className="p-3 rounded-2xl bg-neutral-100"
                  onPress={handleEditProfile}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={20} color="#0284c7" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className={`px-4 py-2 rounded-2xl ${
                    isFollowing ? 'bg-neutral-100' : 'bg-primary-600'
                  }`}
                  onPress={handleFollowToggle}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-medium ${
                      isFollowing ? 'text-neutral-700' : 'text-white'
                    }`}
                  >
                    {isFollowing ? 'フォロー中' : 'フォロー'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="gap-3 pt-4 border-t border-neutral-200">
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-neutral-100">
                  <Ionicons name="person-outline" size={16} color="#64748b" />
                </View>
                <Text className="text-base text-neutral-700">
                  {userData.gender}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-neutral-100">
                  <Ionicons name="location-outline" size={16} color="#64748b" />
                </View>
                <Text className="text-base text-neutral-700">
                  {userData.prefecture}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-neutral-100">
                  <Ionicons name="calendar-outline" size={16} color="#64748b" />
                </View>
                <Text className="text-base text-neutral-700">
                  {userData.joinDate}から利用開始
                </Text>
              </View>
            </View>

            {/* フォロー/フォロワー情報 */}
            <View className="flex-row justify-around pt-4 mt-4 border-t border-neutral-200">
              <View className="items-center">
                <Text className="text-lg font-bold text-neutral-900">
                  {userData.followCount}
                </Text>
                <Text className="text-sm text-neutral-600">フォロー</Text>
              </View>
              <View className="w-px h-10 bg-neutral-200" />
              <View className="items-center">
                <Text className="text-lg font-bold text-neutral-900">
                  {userData.followerCount}
                </Text>
                <Text className="text-sm text-neutral-600">フォロワー</Text>
              </View>
            </View>
          </Card>

          {/* Stats Section */}
          <Card
            variant="gradient"
            shadow="large"
            animated={true}
            className="mb-6"
          >
            <Text className="text-xl font-bold text-neutral-900 mb-4">
              幹事統計
            </Text>
            <View className="flex-row justify-around items-center">
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-primary-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-primary-700">
                    12
                  </Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">
                  主催イベント
                </Text>
              </View>
              <View className="w-px h-16 bg-neutral-200" />
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-success-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-success-700">8</Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">
                  共有記録
                </Text>
              </View>
              <View className="w-px h-16 bg-neutral-200" />
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-accent-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-accent-700">45</Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">
                  メンバー記録数
                </Text>
              </View>
            </View>
          </Card>

          {/* Settings List */}
          <View className="gap-3 mb-8">
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                activeOpacity={0.8}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card variant="elevated" shadow="medium" animated={true}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="p-3 rounded-2xl bg-neutral-100 mr-4">
                        {item.icon}
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-lg font-semibold text-neutral-900 mb-1"
                          style={item.textColor && { color: item.textColor }}
                        >
                          {item.title}
                        </Text>
                        {item.description && (
                          <Text className="text-sm text-neutral-600 leading-5">
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
          <View className="items-center py-8">
            <LinearGradient
              colors={['#0ea5e9', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-16 h-16 rounded-3xl justify-center items-center mb-4"
            >
              <Ionicons name="wine" size={28} color="white" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-primary-600 mb-2">
              幹事ログ
            </Text>
            <Text className="text-base text-neutral-600 mb-3">
              バージョン 1.0.0
            </Text>
            <Text className="text-sm text-neutral-500 text-center max-w-xs">
              飲み会の企画・管理をスマートにサポートするアプリ
            </Text>
            <Text className="text-xs text-neutral-400 text-center mt-4">
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
      </SafeAreaView>
    </View>
  );
}
