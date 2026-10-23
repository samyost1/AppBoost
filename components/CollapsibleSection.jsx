import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { IconChevronDown } from "@tabler/icons-react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const CollapsibleSection = ({ title, children }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animationProgress = useSharedValue(0);

  const animatedChevronStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [0, contentHeight],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  const onContentLayout = useCallback((event) => {
    const { height: layoutHeight } = event.nativeEvent.layout;
    if (layoutHeight > 0 && layoutHeight !== contentHeight) {
      setContentHeight(layoutHeight);
    }
  }, [contentHeight]);

  const toggleExpansion = useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    animationProgress.value = withTiming(
      newExpanded ? 1 : 0,
      { duration: 250 }
    );
  }, [expanded, animationProgress]);

  return (
    <View style={[styles.container, { borderColor: colors.cardBorder }]}>
      <TouchableOpacity
        onPress={toggleExpansion}
        style={[styles.header, { backgroundColor: colors.background }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.headerText, { color: colors.text }]}>{title}</Text>
        <Animated.View style={animatedChevronStyle}>
          <IconChevronDown size={24} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {children}
        </View>
      </Animated.View>

      {/* Hidden content to measure height - only render when needed */}
      {contentHeight === 0 && (
        <View style={styles.hiddenContent} onLayout={onContentLayout}>
          <View style={styles.content}>
            {children}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  hiddenContent: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    left: 0,
    right: 0,
  },
});

export default CollapsibleSection;
