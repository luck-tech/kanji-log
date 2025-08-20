import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

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
  variant?: 'default' | 'pills' | 'segmented';
}

export function TabBar<T>({
  tabs,
  activeTab,
  onTabPress,
  style,
  variant = 'pills',
}: TabBarProps<T>) {
  const handleTabPress = (tabKey: T) => {
    // Add haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onTabPress(tabKey);
  };

  const renderPillTabs = () => (
    <View style={styles.rowContainer}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            style={[
              styles.pillTab,
              isActive ? styles.activePillTab : styles.inactivePillTab,
            ]}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              {tab.icon && (
                <Text
                  style={[styles.tabIcon, !isActive && styles.iconInactive]}
                >
                  {tab.icon}
                </Text>
              )}
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activePillLabel : styles.inactivePillLabel,
                ]}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderSegmentedTabs = () => (
    <View style={styles.segmentedContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            style={styles.segmentedTab}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            {isActive ? (
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeSegment}
              >
                <View style={styles.segmentContent}>
                  {tab.icon && (
                    <Text style={styles.segmentIcon}>{tab.icon}</Text>
                  )}
                  <Text style={styles.activeSegmentLabel}>{tab.label}</Text>
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveSegment}>
                <View style={styles.segmentContent}>
                  {tab.icon && (
                    <Text style={[styles.segmentIcon, styles.iconInactive]}>
                      {tab.icon}
                    </Text>
                  )}
                  <Text style={styles.inactiveSegmentLabel}>{tab.label}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDefaultTabs = () => (
    <View style={styles.rowContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={String(tab.key)}
            style={[
              styles.defaultTab,
              isActive ? styles.activeDefaultTab : styles.inactiveDefaultTab,
            ]}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              {tab.icon && (
                <Text
                  style={[styles.tabIcon, !isActive && styles.iconInactive]}
                >
                  {tab.icon}
                </Text>
              )}
              <Text
                style={[
                  styles.tabLabel,
                  isActive
                    ? styles.activeDefaultLabel
                    : styles.inactiveDefaultLabel,
                ]}
              >
                {tab.label}
              </Text>
            </View>
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
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={
          variant === 'segmented'
            ? styles.segmentedScrollView
            : styles.defaultScrollView
        }
        contentContainerStyle={
          variant === 'segmented' ? styles.segmentedContentContainer : undefined
        }
      >
        {renderTabs()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Pill styles
  pillTab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 16,
  },
  activePillTab: {
    backgroundColor: Colors.primary[600],
  },
  inactivePillTab: {
    backgroundColor: Colors.neutral[100],
  },
  activePillLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  inactivePillLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[600],
    letterSpacing: 0.5,
  },

  // Segmented styles
  segmentedContainer: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  segmentedTab: {
    flex: 1,
  },
  activeSegment: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  inactiveSegment: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  segmentContent: {
    alignItems: 'center',
  },
  segmentIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  activeSegmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 16,
  },
  inactiveSegmentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 16,
  },

  // Default styles
  defaultTab: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginRight: 16,
    borderBottomWidth: 2,
  },
  activeDefaultTab: {
    borderBottomColor: Colors.primary[600],
  },
  inactiveDefaultTab: {
    borderBottomColor: Colors.transparent,
  },
  activeDefaultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  inactiveDefaultLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[600],
  },

  // Common styles
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 16,
  },
  iconInactive: {
    opacity: 0.6,
  },

  // ScrollView styles
  defaultScrollView: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  segmentedScrollView: {
    paddingVertical: 16,
  },
  segmentedContentContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
});
