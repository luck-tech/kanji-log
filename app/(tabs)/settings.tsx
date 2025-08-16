import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
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
      icon: <Ionicons name="notifications-outline" size={24} color={Colors.gray[600]} />,
      onPress: handleNotifications,
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'プライバシー・セキュリティ',
      description: 'アカウントの安全性と情報の共有設定',
      icon: <Ionicons name="shield-outline" size={24} color={Colors.gray[600]} />,
      onPress: handlePrivacy,
      showArrow: true,
    },
    {
      id: 'support',
      title: 'ヘルプ・サポート',
      description: '使い方や問題の解決方法',
      icon: <Ionicons name="help-circle-outline" size={24} color={Colors.gray[600]} />,
      onPress: handleSupport,
      showArrow: true,
    },
    {
      id: 'logout',
      title: 'ログアウト',
      icon: <Ionicons name="log-out-outline" size={24} color={Colors.error[500]} />,
      onPress: handleLogout,
      textColor: Colors.error[500],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定</Text>
        <Text style={styles.headerSubtitle}>アカウントとアプリの設定管理</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={Colors.white} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>山田太郎</Text>
              <Text style={styles.profileTitle}>イベント管理者</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={20} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileDetailItem}>
              <Ionicons name="mail-outline" size={16} color={Colors.gray[500]} />
              <Text style={styles.profileDetailText}>yamada@example.com</Text>
            </View>
            <View style={styles.profileDetailItem}>
              <Ionicons name="call-outline" size={16} color={Colors.gray[500]} />
              <Text style={styles.profileDetailText}>090-1234-5678</Text>
            </View>
          </View>
        </Card>

        {/* Stats Section */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>利用統計</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>主催イベント</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>共有記録</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>招待メンバー</Text>
            </View>
          </View>
        </Card>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Card style={styles.settingsCard} shadow={false}>
                <View style={styles.settingsItemContent}>
                  <View style={styles.settingsItemLeft}>
                    {item.icon}
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
                    <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>幹事ナビ</Text>
          <Text style={styles.appInfoVersion}>バージョン 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>
            © 2024 Event Organizer. All rights reserved.
          </Text>
        </View>
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
  content: {
    flex: 1,
    padding: Layout.padding.lg,
  },
  profileCard: {
    marginBottom: Layout.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h4,
    color: Colors.gray[900],
    marginBottom: 2,
  },
  profileTitle: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  editButton: {
    padding: Layout.padding.sm,
  },
  profileDetails: {
    gap: Layout.spacing.xs,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  profileDetailText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  statsCard: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.gray[900],
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
  statNumber: {
    ...Typography.h2,
    color: Colors.primary[600],
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.gray[600],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray[200],
  },
  settingsList: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  settingsItem: {
    // No additional styles needed
  },
  settingsCard: {
    borderColor: Colors.gray[100],
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  settingsItemTitle: {
    ...Typography.body1,
    color: Colors.gray[900],
    marginBottom: 2,
  },
  settingsItemDescription: {
    ...Typography.body2,
    color: Colors.gray[600],
    lineHeight: 18,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Layout.padding.lg,
  },
  appInfoTitle: {
    ...Typography.h4,
    color: Colors.primary[600],
    marginBottom: Layout.spacing.xs,
  },
  appInfoVersion: {
    ...Typography.body2,
    color: Colors.gray[600],
    marginBottom: Layout.spacing.sm,
  },
  appInfoCopyright: {
    ...Typography.caption,
    color: Colors.gray[500],
    textAlign: 'center',
  },
});
