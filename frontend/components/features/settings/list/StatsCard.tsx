import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/common/ui/Card';
import { StatItem } from './StatItem';
import { StatsCardProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  style,
  testID,
}) => {
  return (
    <Card variant="gradient" shadow="medium" style={style} testID={testID}>
      <Text style={styles.title}>幹事統計</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <StatItem
              value={stat.value}
              label={stat.label}
              variant={stat.variant}
            />
            {index < stats.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 16,
  },
});
