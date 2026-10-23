import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const SCREEN_DIAGONAL = Math.sqrt(width * width + height * height);

/**
 * ThemeTransitionOverlay - Animated circular reveal for theme switching
 *
 * Creates a beautiful expanding circle animation when switching themes,
 * similar to modern apps like Telegram.
 */
const ThemeTransitionOverlay = ({
  isAnimating,
  targetColor,
  onAnimationComplete,
  originX = width / 2,
  originY = height / 2,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isAnimating) {
      // Reset values
      scale.value = 0;
      opacity.value = 1;

      // Expand the circle
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      // Fade out after expansion with a slight delay
      opacity.value = withDelay(
        350,
        withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        }, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    }
  }, [isAnimating]);

  const animatedStyle = useAnimatedStyle(() => {
    const size = SCREEN_DIAGONAL * 2 * scale.value;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: opacity.value,
      transform: [
        { translateX: -size / 2 + originX },
        { translateY: -size / 2 + originY },
      ],
    };
  });

  if (!isAnimating) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.circle,
          { backgroundColor: targetColor },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default ThemeTransitionOverlay;
