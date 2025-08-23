import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../utils/constants/design/colors';
import { Layout } from '../../../utils/constants/design/layout';
import { BaseComponentProps } from '../../../types/common/ui';

interface SkeletonLoaderProps extends BaseComponentProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width: skeletonWidth = '100%',
  height = 20,
  borderRadius = Layout.borderRadius.md,
  style,
  testID,
}) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: skeletonWidth,
          height,
          borderRadius,
        },
        style,
      ]}
      testID={testID}
    >
      <Animated.View style={[styles.skeleton, animatedStyle]}>
        <LinearGradient
          colors={[
            Colors.neutral[200],
            Colors.neutral[100],
            Colors.neutral[200],
          ]}
          style={[
            styles.gradient,
            {
              borderRadius,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

// Card skeleton component
interface SkeletonCardProps extends BaseComponentProps {
  showAvatar?: boolean;
  showButtons?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showButtons = false,
  lines = 3,
  style,
  testID,
}) => {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {/* Header */}
      <View style={styles.cardHeader}>
        {showAvatar && (
          <SkeletonLoader
            width={40}
            height={40}
            borderRadius={Layout.borderRadius.full}
          />
        )}
        <View style={styles.cardHeaderText}>
          <SkeletonLoader height={16} width="60%" />
          <SkeletonLoader height={12} width="40%" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={14}
            width={index === lines - 1 ? '80%' : '100%'}
            style={{ marginBottom: Layout.spacing.xs }}
          />
        ))}
      </View>

      {/* Buttons */}
      {showButtons && (
        <View style={styles.cardButtons}>
          <SkeletonLoader width={80} height={32} />
          <SkeletonLoader width={80} height={32} />
        </View>
      )}
    </View>
  );
};

// List skeleton component
interface SkeletonListProps extends BaseComponentProps {
  itemCount?: number;
  showAvatar?: boolean;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  itemCount = 5,
  showAvatar = true,
  style,
  testID,
}) => {
  return (
    <View style={[styles.list, style]} testID={testID}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          {showAvatar && (
            <SkeletonLoader
              width={48}
              height={48}
              borderRadius={Layout.borderRadius.full}
            />
          )}
          <View style={styles.listItemContent}>
            <SkeletonLoader height={16} width="70%" />
            <SkeletonLoader height={12} width="50%" />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  // Card styles
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.padding.md,
    marginBottom: Layout.spacing.sm,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
  },
  cardContent: {
    marginBottom: Layout.spacing.sm,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // List styles
  list: {
    paddingVertical: Layout.padding.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.padding.sm,
    paddingHorizontal: Layout.padding.md,
    marginBottom: Layout.spacing.xs,
  },
  listItemContent: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
  },
});
