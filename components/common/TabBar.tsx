import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

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
}

export function TabBar<T>({
  tabs,
  activeTab,
  onTabPress,
  style,
}: TabBarProps<T>) {
  return (
    <View style={[styles.tabContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={String(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key && [
                styles.activeTab,
                { borderColor: tab.color },
              ],
            ]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && [
                  styles.activeTabText,
                  { color: tab.color },
                ],
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  tabScrollContent: {
    paddingHorizontal: Layout.padding.lg,
    paddingVertical: Layout.padding.sm,
  },
  tab: {
    paddingHorizontal: Layout.padding.md,
    paddingVertical: Layout.padding.sm,
    marginRight: Layout.spacing.md,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  activeTab: {
    backgroundColor: Colors.white,
    borderWidth: 2,
  },
  tabText: {
    ...Typography.body2,
    color: Colors.gray[600],
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});
