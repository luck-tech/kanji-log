import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface TabItem<T = string> {
  key: T;
  label: string;
  color: string;
  icon?: string;
}

interface TabBarProps<T> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  style?: any;
  className?: string;
  variant?: 'default' | 'pills' | 'segmented';
  animated?: boolean;
}

export function TabBar<T>({
  tabs,
  activeTab,
  onTabPress,
  style,
  className,
  variant = 'pills',
  animated = true,
}: TabBarProps<T>) {
  const handleTabPress = (tabKey: T) => {
    // Add haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onTabPress(tabKey);
  };

  const renderPillTabs = () => (
    <View className="flex-row">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            className={`px-6 py-3 mr-3 rounded-2xl ${
              isActive 
                ? 'bg-primary-600 shadow-medium' 
                : 'bg-neutral-100'
            } ${animated ? 'animate-scale-in' : ''}`}
            style={{ 
              animationDelay: animated ? `${index * 100}ms` : undefined 
            }}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              className={`text-base font-semibold tracking-wide ${
                isActive ? 'text-white' : 'text-neutral-600'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderSegmentedTabs = () => (
    <View className="bg-neutral-100 rounded-2xl p-1 flex-row">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            className="flex-1"
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            {isActive ? (
              <LinearGradient
                colors={['#0ea5e9', '#0284c7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-3 px-4 rounded-xl"
              >
                <Text className="text-base font-semibold text-white text-center tracking-wide">
                  {tab.label}
                </Text>
              </LinearGradient>
            ) : (
              <View className="py-3 px-4">
                <Text className="text-base font-medium text-neutral-600 text-center">
                  {tab.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDefaultTabs = () => (
    <View className="flex-row">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            className={`px-6 py-4 mr-4 border-b-2 ${
              isActive 
                ? 'border-primary-600' 
                : 'border-transparent'
            }`}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              className={`text-base font-medium ${
                isActive ? 'text-primary-600 font-semibold' : 'text-neutral-600'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderTabs = () => {
    switch (variant) {
      case 'segmented':
        return renderSegmentedTabs();
      case 'default':
        return renderDefaultTabs();
      case 'pills':
      default:
        return renderPillTabs();
    }
  };

  return (
    <View className={`bg-white ${className || ''}`} style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4"
        contentContainerStyle={variant === 'segmented' ? { paddingHorizontal: 0 } : undefined}
      >
        {renderTabs()}
      </ScrollView>
    </View>
  );
}
