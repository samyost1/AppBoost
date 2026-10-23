import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";
import Button from "./Button";

// Helper function to lighten a color
const lightenColor = (color, amount = 0.9) => {
  const hex = color.slice(1);
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Helper function to darken a color (for dark themes)
const darkenColor = (color, amount = 0.3) => {
  const hex = color.slice(1);
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const Dialog = ({
  visible = false,
  onClose,
  icon,
  title,
  text,
  primaryButton,
  secondaryButton,
  style,
  iconBackground,
}) => {
  const { colors, isDark } = useTheme();

  // Use darken for dark themes, lighten for light themes
  const getIconBg = (baseColor) => {
    if (!baseColor) return colors.card;
    return isDark ? darkenColor(baseColor, 0.5) : lightenColor(baseColor, 0.9);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[
          styles.dialog,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderWidth: isDark ? 1 : 0,
          },
          style
        ]}>
          {icon && (
            <View style={styles.iconContainer}>
              <View style={[
                styles.iconBackground,
                { backgroundColor: getIconBg(iconBackground) }
              ]}>
                {icon}
              </View>
            </View>
          )}

          {title && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}

          {text && (
            <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
          )}

          <View style={styles.buttonContainer}>
            {secondaryButton && (
              <Button
                title={secondaryButton.title}
                onPress={secondaryButton.onPress}
                variant="secondary"
                style={[
                  styles.button,
                  styles.secondaryButton,
                  secondaryButton && styles.buttonMargin
                ]}
              />
            )}

            {primaryButton && (
              <Button
                title={primaryButton.title}
                onPress={primaryButton.onPress}
                variant="primary"
                style={[
                  styles.button,
                  styles.primaryButton,
                  secondaryButton && styles.buttonMargin
                ]}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dialog: {
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get("window").width - 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  primaryButton: {},
  secondaryButton: {
    borderWidth: 0,
  },
  buttonMargin: {
    marginLeft: 12,
  },
});

export default Dialog;
