import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const Switch = ({
  value = false,
  onValueChange,
  disabled = false,
  size = "medium", // "small", "medium", "large"
  label,
  labelPosition = "right", // "left", "right"
  trackColorOn,
  trackColorOff,
  thumbColor,
  containerStyle,
  labelStyle,
}) => {
  const { colors } = useTheme();
  const [isOn, setIsOn] = useState(value);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Use theme colors as defaults if not provided
  const resolvedTrackColorOn = trackColorOn || colors.primary;
  const resolvedTrackColorOff = trackColorOff || colors.gray;
  const resolvedThumbColor = thumbColor || colors.white;

  // Sync with external value changes
  useEffect(() => {
    setIsOn(value);
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const sizes = {
    small: { width: 40, height: 24, thumbSize: 20, padding: 2 },
    medium: { width: 50, height: 30, thumbSize: 26, padding: 2 },
    large: { width: 60, height: 36, thumbSize: 32, padding: 2 },
  };

  const currentSize = sizes[size];

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isOn;
    setIsOn(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, currentSize.width - currentSize.thumbSize - currentSize.padding * 2],
  });

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [resolvedTrackColorOff, resolvedTrackColorOn],
  });

  const renderSwitch = () => (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity: disabled ? 0.5 : 1 },
        containerStyle,
      ]}
      onPress={handleToggle}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: currentSize.width,
            height: currentSize.height,
            backgroundColor: trackColor,
            shadowColor: colors.black,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: currentSize.thumbSize,
              height: currentSize.thumbSize,
              backgroundColor: resolvedThumbColor,
              transform: [{ translateX: thumbTranslateX }],
              shadowColor: colors.black,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );

  if (!label) {
    return renderSwitch();
  }

  return (
    <View style={styles.switchContainer}>
      {labelPosition === "left" && (
        <Text
          style={[
            styles.label,
            { color: colors.text },
            labelStyle,
            disabled && { color: colors.textMuted },
          ]}
        >
          {label}
        </Text>
      )}
      {renderSwitch()}
      {labelPosition === "right" && (
        <Text
          style={[
            styles.label,
            { color: colors.text },
            labelStyle,
            disabled && { color: colors.textMuted },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    borderRadius: 100,
    justifyContent: "center",
    paddingHorizontal: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  thumb: {
    borderRadius: 100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginHorizontal: 12,
  },
});

export default Switch;
