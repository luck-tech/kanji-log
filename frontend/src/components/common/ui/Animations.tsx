import React from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {
  FadeInViewProps,
  SlideInViewProps,
  ScaleInViewProps,
  PulseViewProps,
  ShakeViewProps,
  StaggeredListProps,
} from '@/types';

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
  initialOpacity = 0,
  finalOpacity = 1,
  testID,
}) => {
  const opacity = useSharedValue(initialOpacity);

  React.useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(finalOpacity, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [delay, duration, opacity, finalOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 500,
  distance = 50,
  style,
  testID,
}) => {
  const translateX = useSharedValue(
    direction === 'left' ? -distance : direction === 'right' ? distance : 0
  );
  const translateY = useSharedValue(
    direction === 'up' ? -distance : direction === 'down' ? distance : 0
  );

  React.useEffect(() => {
    translateX.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 1,
      })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 90,
        mass: 1,
      })
    );
  }, [delay, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  initialScale = 0,
  finalScale = 1,
  style,
  testID,
}) => {
  const scale = useSharedValue(initialScale);

  React.useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(finalScale, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      })
    );
  }, [delay, scale, finalScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  minScale = 1,
  maxScale = 1.05,
  duration = 1000,
  style,
  testID,
}) => {
  const scale = useSharedValue(minScale);

  React.useEffect(() => {
    const animate = () => {
      scale.value = withSequence(
        withTiming(maxScale, { duration: duration / 2 }),
        withTiming(minScale, { duration: duration / 2 })
      );
    };

    animate();
    const interval = setInterval(animate, duration);

    return () => clearInterval(interval);
  }, [scale, minScale, maxScale, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export const ShakeView: React.FC<ShakeViewProps> = ({
  children,
  intensity = 10,
  duration = 500,
  direction = 'horizontal',
  style,
  testID,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    const performShake = () => {
      if (direction === 'horizontal') {
        translateX.value = withSequence(
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(-intensity, { duration: duration / 4 }),
          withTiming(intensity, { duration: duration / 4 }),
          withTiming(-intensity, { duration: duration / 4 }),
          withTiming(0, { duration: duration / 8 })
        );
      } else {
        translateY.value = withSequence(
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(-intensity, { duration: duration / 4 }),
          withTiming(intensity, { duration: duration / 4 }),
          withTiming(-intensity, { duration: duration / 4 }),
          withTiming(0, { duration: duration / 8 })
        );
      }
    };

    performShake();
  }, [intensity, duration, direction, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  itemDelay = 100,
  direction = 'up',
  duration = 500,
  style,
  testID,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <Animated.View style={style} testID={testID}>
      {childrenArray.map((child, index) => (
        <SlideInView
          key={index}
          direction={direction}
          delay={index * itemDelay}
          duration={duration}
        >
          {child}
        </SlideInView>
      ))}
    </Animated.View>
  );
};

// カスタムフック
export const usePressAnimation = (scale: number = 0.95) => {
  const animatedScale = useSharedValue(1);

  const onPressIn = React.useCallback(() => {
    animatedScale.value = withSpring(scale, {
      damping: 15,
      stiffness: 300,
    });
  }, [animatedScale, scale]);

  const onPressOut = React.useCallback(() => {
    animatedScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  }, [animatedScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }));

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
};

export const useLoadingAnimation = (isLoading: boolean) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isLoading) {
      rotation.value = withSequence(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        withTiming(0, { duration: 0 })
      );
      const interval = setInterval(() => {
        rotation.value = withSequence(
          withTiming(360, { duration: 1000, easing: Easing.linear }),
          withTiming(0, { duration: 0 })
        );
      }, 1000);

      return () => clearInterval(interval);
    } else {
      rotation.value = 0;
    }
  }, [isLoading, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

// モーダル用のアニメーションフック
export const useModalAnimation = (isVisible: boolean) => {
  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 250 }, () => {
        runOnJS(setModalVisible)(false);
      });
    }
  }, [isVisible, opacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return {
    modalVisible,
    backdropStyle,
    modalStyle,
  };
};

// ピッカーホイール用のスクロールフック
export const usePickerScrollAnimation = (
  selectedValue: number,
  items: { value: number }[],
  itemHeight: number
) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [isUserScrolling, setIsUserScrolling] = React.useState(false);

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  React.useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0 && !isUserScrolling) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false,
      });
    }
  }, [selectedIndex, isUserScrolling, itemHeight]);

  const handleScrollBeginDrag = React.useCallback(() => {
    setIsUserScrolling(true);
  }, []);

  const handleMomentumScrollEnd = React.useCallback(
    (event: any) => {
      setIsUserScrolling(false);
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      return Math.max(0, Math.min(index, items.length - 1));
    },
    [itemHeight, items.length]
  );

  return {
    scrollViewRef,
    handleScrollBeginDrag,
    handleMomentumScrollEnd,
  };
};
