import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

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
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={48} color={Colors.white} />
        </View>
        <Text style={styles.title}>幹事ナビ</Text>
        <Text style={styles.subtitle}>Event Organizer</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: Layout.borderRadius.xl,
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  title: {
    ...Typography.h1,
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.primary[100],
    opacity: 0.8,
  },
});
