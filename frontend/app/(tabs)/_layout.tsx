import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useWindowDimensions } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray[100],
          paddingTop: 8,
          paddingBottom: 8,
          height: isSmallScreen ? 56 : 68
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          display: isSmallScreen ? 'none' : 'flex'
        },
        tabBarItemStyle: {
          paddingHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'イベント',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="calendar-outline" size={isSmallScreen ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'メンバー',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="people-outline" size={isSmallScreen ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'みんなの記録',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="book-outline" size={isSmallScreen ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={isSmallScreen ? 28 : size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}