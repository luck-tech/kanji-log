import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Simulate social login
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? 'おかえりなさい' : 'アカウント作成'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'アカウントにログインして、イベント管理を始めましょう'
              : '新しいアカウントを作成して、幹事ライフを始めましょう'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <Input
              label="お名前"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="山田太郎"
              leftIcon={<Ionicons name="person-outline" size={20} color={Colors.gray[400]} />}
            />
          )}

          <Input
            label="メールアドレス"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.gray[400]} />}
          />

          <Input
            label="パスワード"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            placeholder="8文字以上"
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.gray[400]} />}
            rightIcon={
              <Button
                title=""
                onPress={() => setShowPassword(!showPassword)}
                variant="ghost"
                style={styles.eyeButton}
                icon={
                  showPassword ? (
                    <Ionicons name="eye-off-outline" size={20} color={Colors.gray[400]} />
                  ) : (
                    <Ionicons name="eye-outline" size={20} color={Colors.gray[400]} />
                  )
                }
              />
            }
          />

          <Button
            title={isLogin ? 'ログイン' : 'アカウント作成'}
            onPress={handleAuth}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.authButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialButtons}>
          <Button
            title="Googleでログイン"
            onPress={() => handleSocialLogin('google')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>

        {/* Toggle Auth Mode */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin
              ? 'アカウントをお持ちでない方は'
              : 'すでにアカウントをお持ちの方は'}
          </Text>
          <Button
            title={isLogin ? 'アカウント作成' : 'ログイン'}
            onPress={() => setIsLogin(!isLogin)}
            variant="ghost"
            style={styles.toggleButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.xl + 20,
    paddingBottom: Layout.padding.lg,
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: Layout.spacing.lg,
  },
  eyeButton: {
    padding: 0,
    minHeight: 'auto',
  },
  authButton: {
    marginTop: Layout.spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[200],
  },
  dividerText: {
    ...Typography.body2,
    color: Colors.gray[500],
    marginHorizontal: Layout.spacing.md,
  },
  socialButtons: {
    marginBottom: Layout.spacing.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  toggleText: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
  toggleButton: {
    padding: 0,
    minHeight: 'auto',
    marginLeft: Layout.spacing.xs,
  },
});
