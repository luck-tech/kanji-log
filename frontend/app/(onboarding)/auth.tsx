import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

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
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-grow px-6 pt-12 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
            {isLogin ? 'おかえりなさい' : 'アカウント作成'}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            {isLogin
              ? 'アカウントにログインして、イベント管理を始めましょう'
              : '新しいアカウントを作成して、幹事ライフを始めましょう'}
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          {!isLogin && (
            <Input
              label="お名前"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="山田太郎"
              leftIcon={<Ionicons name="person-outline" size={20} color="#9ca3af" />}
            />
          )}

          <Input
            label="メールアドレス"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#9ca3af" />}
          />

          <Input
            label="パスワード"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            placeholder="8文字以上"
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />}
            rightIcon={
              <Button
                onPress={() => setShowPassword(!showPassword)}
                variant="ghost"
                className="p-0 min-h-0"
                icon={
                  showPassword ? (
                    <Ionicons name="eye-off-outline" size={20} color="#9ca3af" />
                  ) : (
                    <Ionicons name="eye-outline" size={20} color="#9ca3af" />
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
            className="mt-4"
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-sm text-gray-500 mx-4">または</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Social Login */}
        <View className="mb-8">
          <Button
            title="Googleでログイン"
            onPress={() => handleSocialLogin('google')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>

        {/* Toggle Auth Mode */}
        <View className="flex-row justify-center items-center mt-auto">
          <Text className="text-sm text-gray-600">
            {isLogin
              ? 'アカウントをお持ちでない方は'
              : 'すでにアカウントをお持ちの方は'}
          </Text>
          <Button
            title={isLogin ? 'アカウント作成' : 'ログイン'}
            onPress={() => setIsLogin(!isLogin)}
            variant="ghost"
            className="p-0 min-h-0 ml-2"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
