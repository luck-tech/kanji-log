import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import '../global.css';

export default function RootLayout() {
  useFrameworkReady();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Simulate checking if user is authenticated and first launch
  useEffect(() => {
    // In a real app, check AsyncStorage or authentication state
    const checkFirstLaunch = async () => {
      // For demo purposes, always show onboarding
      setIsFirstLaunch(true);
    };

    checkFirstLaunch();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
