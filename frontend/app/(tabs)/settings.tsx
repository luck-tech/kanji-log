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
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';

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
      textColor: "#ef4444",
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
          leftIcon="settings"
          onLeftPress={() => console.log('Settings')}
        />

        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Section */}
          <Card variant="elevated" shadow="large" animated={true} className="mb-6 mt-4">
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
                <Text className="text-xl font-bold text-neutral-900 mb-1">幹事太郎</Text>
                <Text className="text-base text-neutral-600">イベント企画・管理者</Text>
              </View>
              <TouchableOpacity
                className="p-3 rounded-2xl bg-neutral-100"
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={20} color="#0284c7" />
              </TouchableOpacity>
            </View>

            <View className="gap-3 pt-4 border-t border-neutral-200">
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-neutral-100">
                  <Ionicons name="mail-outline" size={16} color="#64748b" />
                </View>
                <Text className="text-base text-neutral-700">user@example.com</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-neutral-100">
                  <Ionicons name="calendar-outline" size={16} color="#64748b" />
                </View>
                <Text className="text-base text-neutral-700">2024年1月15日から利用開始</Text>
              </View>
            </View>
          </Card>

          {/* Stats Section */}
          <Card variant="gradient" shadow="large" animated={true} className="mb-6">
            <Text className="text-xl font-bold text-neutral-900 mb-4">幹事統計</Text>
            <View className="flex-row justify-around items-center">
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-primary-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-primary-700">12</Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">主催イベント</Text>
              </View>
              <View className="w-px h-16 bg-neutral-200" />
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-success-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-success-700">8</Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">共有記録</Text>
              </View>
              <View className="w-px h-16 bg-neutral-200" />
              <View className="items-center">
                <View className="w-16 h-16 rounded-2xl bg-accent-100 justify-center items-center mb-2">
                  <Text className="text-2xl font-bold text-accent-700">45</Text>
                </View>
                <Text className="text-sm text-neutral-600 font-medium">招待メンバー</Text>
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
                      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
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
            <Text className="text-2xl font-bold text-primary-600 mb-2">幹事ナビ</Text>
            <Text className="text-base text-neutral-600 mb-3">バージョン 1.0.0</Text>
            <Text className="text-sm text-neutral-500 text-center max-w-xs">
              飲み会の企画・管理をスマートにサポートするアプリ
            </Text>
            <Text className="text-xs text-neutral-400 text-center mt-4">
              © 2024 Kanji Navi. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
