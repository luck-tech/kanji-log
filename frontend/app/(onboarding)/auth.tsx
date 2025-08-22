import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '@/components/common';
import { Colors } from '@/constants/Colors';

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
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
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
        <View style={styles.formSection}>
          {!isLogin && (
            <Input
              label="お名前"
              value={form.name}
              onChangeText={(text: string) => setForm({ ...form, name: text })}
              placeholder="山田太郎"
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.neutral[400]}
                />
              }
            />
          )}

          <Input
            label="メールアドレス"
            value={form.email}
            onChangeText={(text: string) => setForm({ ...form, email: text })}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.neutral[400]}
              />
            }
          />

          <Input
            label="パスワード"
            value={form.password}
            onChangeText={(text: string) =>
              setForm({ ...form, password: text })
            }
            placeholder="8文字以上"
            secureTextEntry={!showPassword}
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.neutral[400]}
              />
            }
            rightIcon={
              <Button
                onPress={() => setShowPassword(!showPassword)}
                variant="ghost"
                icon={
                  showPassword ? (
                    <Ionicons
                      name="eye-off-outline"
                      size={20}
                      color={Colors.neutral[400]}
                    />
                  ) : (
                    <Ionicons
                      name="eye-outline"
                      size={20}
                      color={Colors.neutral[400]}
                    />
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
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerSection}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialSection}>
          <Button
            title="Googleでログイン"
            onPress={() => handleSocialLogin('google')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>

        {/* Toggle Auth Mode */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleText}>
            {isLogin
              ? 'アカウントをお持ちでない方は'
              : 'すでにアカウントをお持ちの方は'}
          </Text>
          <Button
            title={isLogin ? 'アカウント作成' : 'ログイン'}
            onPress={() => setIsLogin(!isLogin)}
            variant="ghost"
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
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[200],
  },
  dividerText: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginHorizontal: 16,
  },
  socialSection: {
    marginBottom: 32,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  toggleText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
});
