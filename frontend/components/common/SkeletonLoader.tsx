import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width: skeletonWidth = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: skeletonWidth,
          height,
          borderRadius,
          backgroundColor: Colors.neutral[200],
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.skeletonHeaderText}>
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="50%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={12} style={{ marginTop: 16 }} />
      <SkeletonLoader width="80%" height={12} style={{ marginTop: 8 }} />
      <View style={styles.skeletonFooter}>
        <SkeletonLoader width={60} height={24} borderRadius={12} />
        <SkeletonLoader width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

export const SkeletonEventCard: React.FC = () => {
  return (
    <View style={styles.skeletonEventCard}>
      <View style={styles.skeletonEventHeader}>
        <SkeletonLoader width="60%" height={20} />
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </View>
      <View style={styles.skeletonEventInfo}>
        <SkeletonLoader width="40%" height={14} />
        <SkeletonLoader width="50%" height={14} style={{ marginTop: 8 }} />
        <SkeletonLoader width="30%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
};

export const SkeletonMemberCard: React.FC = () => {
  return (
    <View style={styles.skeletonMemberCard}>
      <SkeletonLoader width={48} height={48} borderRadius={16} />
      <View style={styles.skeletonMemberInfo}>
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
      </View>
      <SkeletonLoader width={20} height={20} borderRadius={10} />
    </View>
  );
};

interface SkeletonListProps {
  count?: number;
  itemComponent?: React.ComponentType;
  style?: any;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  itemComponent: ItemComponent = SkeletonCard,
  style,
}) => {
  return (
    <View style={[styles.skeletonList, style]}>
      {Array.from({ length: count }, (_, index) => (
        <ItemComponent key={index} />
      ))}
    </View>
  );
};

// Wave animation for more advanced skeletons
interface ShimmerSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  width: skeletonWidth = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(withTiming(width, { duration: 1200 }), -1);
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        {
          width: skeletonWidth,
          height,
          borderRadius,
          backgroundColor: Colors.neutral[200],
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={['transparent', Colors.neutral[100], 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  skeletonEventCard: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  skeletonEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skeletonEventInfo: {
    gap: 8,
  },
  skeletonMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  skeletonMemberInfo: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonList: {
    gap: 16,
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    flex: 1,
  },
});
