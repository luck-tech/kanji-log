import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';

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
  const handleEditProfile = () => {
    console.log('Edit profile');
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

  const settingsItems: SettingsItem[] = [
    {
      id: 'notifications',
      title: '通知設定',
      description: 'イベントの更新やリマインダーの設定',
      icon: <Ionicons name="notifications-outline" size={24} color="#4b5563" />,
      onPress: handleNotifications,
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'プライバシー・セキュリティ',
      description: 'アカウントの安全性と情報の共有設定',
      icon: <Ionicons name="shield-outline" size={24} color="#4b5563" />,
      onPress: handlePrivacy,
      showArrow: true,
    },
    {
      id: 'support',
      title: 'ヘルプ・サポート',
      description: '使い方や問題の解決方法',
      icon: <Ionicons name="help-circle-outline" size={24} color="#4b5563" />,
      onPress: handleSupport,
      showArrow: true,
    },
    {
      id: 'logout',
      title: 'ログアウト',
      icon: <Ionicons name="log-out-outline" size={24} color="#ef4444" />,
      onPress: handleLogout,
      textColor: "#ef4444",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-6 bg-white">
        <Text className="text-2xl font-bold text-gray-900 mb-2">設定</Text>
        <Text className="text-sm text-gray-600">アカウントとアプリの設定管理</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Card className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-blue-600 justify-center items-center mr-4">
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">山田太郎</Text>
              <Text className="text-sm text-gray-600">イベント管理者</Text>
            </View>
            <TouchableOpacity
              className="p-3"
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600">yamada@example.com</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Ionicons name="call-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600">090-1234-5678</Text>
            </View>
          </View>
        </Card>

        {/* Stats Section */}
        <Card className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">利用統計</Text>
          <View className="flex-row justify-around items-center">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">12</Text>
              <Text className="text-xs text-gray-600 mt-1">主催イベント</Text>
            </View>
            <View className="w-px h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">8</Text>
              <Text className="text-xs text-gray-600 mt-1">共有記録</Text>
            </View>
            <View className="w-px h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">45</Text>
              <Text className="text-xs text-gray-600 mt-1">招待メンバー</Text>
            </View>
          </View>
        </Card>

        {/* Settings List */}
        <View className="gap-3 mb-8">
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Card shadow={false} className="border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    {item.icon}
                    <View className="ml-4 flex-1">
                      <Text
                        className="text-base text-gray-900 mb-1"
                        style={item.textColor && { color: item.textColor }}
                      >
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text className="text-sm text-gray-600 leading-5">
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {item.showArrow && (
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-lg font-semibold text-blue-600 mb-2">幹事ナビ</Text>
          <Text className="text-sm text-gray-600 mb-3">バージョン 1.0.0</Text>
          <Text className="text-xs text-gray-500 text-center">
            © 2024 Event Organizer. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
