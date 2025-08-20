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
        <View style={styles.iconWrapper}>
          <Ionicons name="calendar" size={48} color="white" />
        </View>
        <Text style={styles.appTitle}>幹事ナビ</Text>
        <Text style={styles.appSubtitle}>Event Organizer</Text>
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
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.primary[100],
    opacity: 0.8,
  },
});
