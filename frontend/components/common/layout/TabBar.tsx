import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/utils/constants/design/colors';
import { Layout } from '@/utils/constants/design/layout';
import { TabItem, TabBarProps } from '@/types/common/ui';

export function TabBar<T>({
  tabs,
  activeTab,
  onTabPress,
  style,
  variant = 'default',
  scrollable = false,
  testID,
}: TabBarProps<T>) {
  // アイコン名のバリデーション関数
  const isValidIconName = (
    name: string
  ): name is keyof typeof Ionicons.glyphMap => {
    return name in Ionicons.glyphMap;
  };

  const renderTab = (tab: TabItem<T>, index: number) => {
    const isActive = tab.key === activeTab;
    const tabColor = tab.color || Colors.primary[500];

    if (variant === 'pills') {
      return (
        <TouchableOpacity
          key={String(tab.key)}
          style={[styles.pillTab, isActive && { backgroundColor: tabColor }]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={styles.tabContent}>
            {tab.icon && isValidIconName(tab.icon) && (
              <Ionicons
                name={tab.icon}
                size={16}
                color={isActive ? Colors.white : Colors.neutral[600]}
                style={styles.tabIcon}
              />
            )}
            <Text
              style={[
                styles.pillTabText,
                isActive
                  ? { color: Colors.white }
                  : { color: Colors.neutral[600] },
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge && tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    if (variant === 'segmented') {
      return (
        <TouchableOpacity
          key={String(tab.key)}
          style={[
            styles.segmentedTab,
            index === 0 && styles.segmentedTabFirst,
            index === tabs.length - 1 && styles.segmentedTabLast,
            isActive && styles.segmentedTabActive,
          ]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={styles.tabContent}>
            {tab.icon && isValidIconName(tab.icon) && (
              <Ionicons
                name={tab.icon}
                size={16}
                color={isActive ? Colors.primary[500] : Colors.neutral[600]}
                style={styles.tabIcon}
              />
            )}
            <Text
              style={[
                styles.segmentedTabText,
                isActive
                  ? { color: Colors.primary[500] }
                  : { color: Colors.neutral[600] },
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge && tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    // Default variant
    return (
      <TouchableOpacity
        key={String(tab.key)}
        style={styles.defaultTab}
        onPress={() => onTabPress(tab.key)}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {tab.icon && isValidIconName(tab.icon) && (
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? tabColor : Colors.neutral[500]}
              style={styles.tabIcon}
            />
          )}
          <Text
            style={[
              styles.defaultTabText,
              isActive
                ? { color: tabColor, fontWeight: '600' }
                : { color: Colors.neutral[500] },
            ]}
          >
            {tab.label}
          </Text>
          {tab.badge && tab.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </Text>
            </View>
          )}
        </View>
        {isActive && (
          <View
            style={[styles.activeIndicator, { backgroundColor: tabColor }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.container, style]}
        contentContainerStyle={styles.scrollContent}
        testID={testID}
      >
        {tabs.map(renderTab)}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View
        style={[
          styles.content,
          variant === 'segmented' && styles.segmentedContainer,
        ]}
      >
        {tabs.map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  content: {
    flexDirection: 'row',
  },
  segmentedContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: Layout.padding.sm,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: Layout.spacing.xs,
  },
  badge: {
    backgroundColor: Colors.error[500],
    borderRadius: Layout.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
    paddingHorizontal: 4,
  },
  // Default variant styles
  defaultTab: {
    flex: 1,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.xs,
    position: 'relative',
  },
  defaultTabText: {
    fontSize: 14,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  // Pills variant styles
  pillTab: {
    paddingVertical: Layout.padding.xs,
    paddingHorizontal: Layout.padding.sm,
    borderRadius: Layout.borderRadius.full,
    marginHorizontal: Layout.spacing.xs,
    backgroundColor: Colors.neutral[100],
  },
  pillTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Segmented variant styles
  segmentedTab: {
    flex: 1,
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.xs,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginLeft: -1, // 隣接するボーダーの重複を防ぐ
  },
  segmentedTabFirst: {
    marginLeft: 0, // 最初のタブはマージンなし
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  segmentedTabLast: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  segmentedTabActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary[500],
    zIndex: 1,
  },
  segmentedTabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
