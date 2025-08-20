import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

export interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [delay, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  distance = 50,
  style,
}) => {
  const translateX = useSharedValue(
    direction === 'left' ? -distance : direction === 'right' ? distance : 0
  );
  const translateY = useSharedValue(
    direction === 'up' ? distance : direction === 'down' ? -distance : 0
  );
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withSpring(0, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      })
    );
  }, [delay, duration, translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  style?: ViewStyle;
}

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  initialScale = 0.3,
  style,
}) => {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration * 0.8,
        easing: Easing.out(Easing.quad),
      })
    );
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 120,
        mass: 0.8,
      })
    );
  }, [delay, duration, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export interface PulseViewProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  repeatCount?: number;
  style?: ViewStyle;
}

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  scale = 1.05,
  duration = 1000,
  repeatCount = -1, // -1 for infinite
  style,
}) => {
  const scaleValue = useSharedValue(1);

  React.useEffect(() => {
    const pulse = () => {
      scaleValue.value = withSequence(
        withTiming(scale, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      );
    };

    if (repeatCount === -1) {
      // Infinite pulse
      const interval = setInterval(pulse, duration);
      return () => clearInterval(interval);
    } else {
      // Limited pulse
      for (let i = 0; i < repeatCount; i++) {
        setTimeout(pulse, i * duration);
      }
    }
  }, [scale, duration, repeatCount, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export interface ShakeViewProps {
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  style?: ViewStyle;
  trigger?: boolean;
}

export const ShakeView: React.FC<ShakeViewProps> = ({
  children,
  intensity = 10,
  duration = 500,
  style,
  trigger = false,
}) => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-intensity, { duration: duration / 8 }),
        withTiming(intensity, { duration: duration / 8 }),
        withTiming(-intensity, { duration: duration / 8 }),
        withTiming(intensity, { duration: duration / 8 }),
        withTiming(-intensity, { duration: duration / 8 }),
        withTiming(intensity, { duration: duration / 8 }),
        withTiming(-intensity, { duration: duration / 8 }),
        withTiming(0, { duration: duration / 8 })
      );
    }
  }, [trigger, intensity, duration, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  direction = 'up',
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <SlideInView
          key={index}
          direction={direction}
          delay={initialDelay + index * staggerDelay}
          duration={400}
          distance={30}
        >
          {child}
        </SlideInView>
      ))}
    </>
  );
};

// Hook for press animations
export const usePressAnimation = (scale: number = 0.95) => {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const onPressIn = () => {
    scaleValue.value = withTiming(scale, { duration: 100 });
  };

  const onPressOut = () => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
};

// Hook for loading animations
export const useLoadingAnimation = () => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      withTiming(720, { duration: 1000, easing: Easing.linear }),
      withTiming(1080, { duration: 1000, easing: Easing.linear })
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};
