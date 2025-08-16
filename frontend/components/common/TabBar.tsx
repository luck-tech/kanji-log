import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export interface TabItem<T = string> {
  key: T;
  label: string;
  color: string;
}

interface TabBarProps<T> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  style?: any;
  className?: string;
}

export function TabBar<T>({
  tabs,
  activeTab,
  onTabPress,
  style,
  className,
}: TabBarProps<T>) {
  return (
    <View className={`bg-white border-b border-gray-100 ${className || ''}`} style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-3"
      >
        <View className="flex-row">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={String(tab.key)}
              className={`px-4 py-3 mr-4 rounded-full border ${
                activeTab === tab.key 
                  ? 'bg-white border-2' 
                  : 'border border-gray-200'
              }`}
              style={activeTab === tab.key ? { borderColor: tab.color } : undefined}
              onPress={() => onTabPress(tab.key)}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab.key ? 'font-semibold' : 'text-gray-600'
                }`}
                style={activeTab === tab.key ? { color: tab.color } : undefined}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
