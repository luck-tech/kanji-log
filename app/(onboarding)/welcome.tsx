import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/common/Button';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/(onboarding)/features');
  };

  return (
    <View className="flex-1">
      {/* Background Image with Overlay */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(79, 70, 229, 0.8)', 'rgba(99, 102, 241, 0.9)']}
          className="flex-1"
        >
          <View className="flex-1 px-6 pt-12 pb-6">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 rounded-xl bg-white bg-opacity-20 justify-center items-center mb-4">
                <Ionicons name="people" size={32} color="white" />
              </View>
              <Text className="text-xl font-semibold text-white">幹事ナビ</Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-4xl font-bold text-white text-center mb-6 leading-11">
                幹事の負担を
                {'\n'}劇的に軽減
              </Text>
              <Text className="text-base text-blue-100 text-center opacity-90 leading-6">
                イベントの企画から開催まで、
                {'\n'}すべてをスマートに管理できる
                {'\n'}幹事専用アプリです
              </Text>
            </View>

            {/* Call to Action */}
            <View className="mt-auto">
              <Button
                title="はじめる"
                onPress={handleGetStarted}
                variant="secondary"
                size="lg"
                fullWidth
                icon={<Ionicons name="arrow-forward" size={20} color="#3b82f6" />}
                className="bg-white border-white shadow-lg elevation-6"
                textStyle={{ color: '#3b82f6', fontWeight: '600' }}
              />
              <Text className="text-xs text-blue-100 text-center mt-4 opacity-70 leading-4">
                続行することで、利用規約とプライバシーポリシーに同意したものとみなされます
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
