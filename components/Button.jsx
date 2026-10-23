import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const Button = ({
  title,
  onPress,
  variant = "primary", // "primary", "secondary", "tertiary"
  size = "medium", // "small", "medium", "large"
  icon,
  iconPosition = "left", // "left" or "right"
  fullWidth = false,
  round = false, // When true, button has a more circular appearance
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    small: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 },
    medium: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 },
  };

  const currentSize = sizes[size];

  const getVariantStyles = () => {
    const baseStyle = {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 1,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.cardBorder,
        };
      case "tertiary":
        return {
          ...baseStyle,
          backgroundColor: colors.backgroundTertiary,
          borderColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return colors.white;
      case "secondary":
        return colors.text;
      case "tertiary":
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const variantStyles = getVariantStyles();
  const textColor = getTextColor();

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles,
        {
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          width: fullWidth ? "100%" : "auto",
          borderRadius: round ? 999 : 16,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && (
        <Text style={[styles.icon, { marginRight: 8 }]}>{icon}</Text>
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
            color: textColor,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === "right" && (
        <Text style={[styles.icon, { marginLeft: 8 }]}>{icon}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Fonts.semiBold,
    textAlign: "center",
    lineHeight: 20,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
