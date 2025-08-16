import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo appearance
    scale.value = withSequence(
      withTiming(1.2, { duration: 600 }),
      withTiming(1, { duration: 200 })
    );

    opacity.value = withTiming(1, { duration: 800 });

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [opacity, scale]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 bg-blue-600 justify-center items-center">
      <Animated.View className="items-center" style={animatedLogoStyle}>
        <View className="w-24 h-24 rounded-xl bg-blue-700 justify-center items-center mb-6 shadow-lg elevation-8">
          <Ionicons name="calendar" size={48} color="white" />
        </View>
        <Text className="text-3xl font-bold text-white mb-2">幹事ナビ</Text>
        <Text className="text-base text-blue-100 opacity-80">Event Organizer</Text>
      </Animated.View>
    </View>
  );
}
