import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppIcon } from './AppIcon';
import { AppDetails } from './AppDetails';
import { AppInfoCardProps } from '@/types/features/setting';

export const AppInfoCard: React.FC<AppInfoCardProps> = ({
  appInfo,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <AppIcon />
          <AppDetails appInfo={appInfo} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
