import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppDetailsProps } from '@/types/features/setting';

export const AppDetails: React.FC<AppDetailsProps> = ({
  appInfo,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.appName}>{appInfo.name}</Text>
      <Text style={styles.appVersion}>バージョン {appInfo.version}</Text>
      <Text style={styles.appDescription}>{appInfo.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e0f2fe',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    color: '#b3e5fc',
    lineHeight: 16,
  },
});
