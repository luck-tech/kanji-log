import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions, Platform } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingHorizontal: 16,
          height: isSmallScreen ? 72 : 84,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 16,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          display: isSmallScreen ? 'none' : 'flex'
        },
        tabBarItemStyle: {
          paddingHorizontal: 8,
          borderRadius: 16,
          marginHorizontal: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'イベント',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={isSmallScreen ? 26 : size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'メンバーリスト',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={isSmallScreen ? 26 : size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'みんなの記録',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons 
              name={focused ? "book" : "book-outline"} 
              size={isSmallScreen ? 26 : size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons 
              name={focused ? "settings" : "settings-outline"} 
              size={isSmallScreen ? 26 : size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}