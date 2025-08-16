import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: any;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, style }) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Layout.padding.lg,
    paddingTop: Layout.padding.md,
    paddingBottom: Layout.padding.lg,
    backgroundColor: Colors.white,
  },
  title: {
    ...Typography.h2,
    color: Colors.gray[900],
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    ...Typography.body2,
    color: Colors.gray[600],
  },
});
