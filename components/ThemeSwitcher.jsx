import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { IconCheck, IconSun, IconMoon } from "@tabler/icons-react-native";
import { useTheme } from "../hooks/useTheme";
import { Fonts } from "../constants/Fonts";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * ThemeSwitcher - A fancy theme selection component
 *
 * Displays available themes as selectable cards with color previews.
 * Shows the current theme with a checkmark indicator.
 */
const ThemeSwitcher = () => {
  const { colors, themeId, isDark, availableThemes, setTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + "20" }]}>
          {!isDark ? (
            <IconSun size={20} color={colors.primary} />
          ) : (
            <IconMoon size={20} color={colors.primary} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your preferred theme
          </Text>
        </View>
      </View>

      <View style={styles.themesContainer}>
        {availableThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={themeId === theme.id}
            onSelect={() => setTheme(theme.id)}
            currentColors={colors}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * Individual theme card with color preview
 */
const ThemeCard = ({ theme, isSelected, onSelect, currentColors }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: 2,
    borderColor: withTiming(isSelected ? currentColors.primary : theme.colors.cardBorder),
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0),
    transform: [{ scale: withSpring(isSelected ? 1 : 0.5) }],
  }));

  return (
    <AnimatedTouchable
      style={[
        styles.themeCard,
        animatedStyle,
        { backgroundColor: theme.colors.card },
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {/* Theme preview */}
      <View style={styles.previewContainer}>
        {/* Background preview */}
        <View
          style={[
            styles.previewBackground,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* Color dots showing the theme palette */}
          <View style={styles.colorDots}>
            <View style={[styles.colorDot, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.colorDot, { backgroundColor: theme.colors.secondary }]} />
            <View style={[styles.colorDot, { backgroundColor: theme.colors.tertiary || theme.colors.success }]} />
          </View>

          {/* Mini UI preview */}
          <View style={[styles.previewCard, { backgroundColor: theme.colors.card }]}>
            <View style={[styles.previewLine, { backgroundColor: theme.colors.text, width: "60%" }]} />
            <View style={[styles.previewLine, { backgroundColor: theme.colors.textSecondary, width: "40%" }]} />
          </View>

          {/* Mini button preview */}
          <View style={[styles.previewButton, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>

      {/* Theme info */}
      <View style={styles.themeInfo}>
        <View style={styles.themeNameRow}>
          <View style={[styles.themeIcon, { backgroundColor: theme.colors.background }]}>
            {theme.isDark ? (
              <IconMoon size={14} color={theme.colors.text} />
            ) : (
              <IconSun size={14} color={theme.colors.text} />
            )}
          </View>
          <Text style={[styles.themeName, { color: theme.colors.text }]}>
            {theme.name}
          </Text>
        </View>

        {/* Selected checkmark */}
        <Animated.View
          style={[
            styles.checkmark,
            checkmarkStyle,
            { backgroundColor: currentColors.primary },
          ]}
        >
          <IconCheck size={12} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  themesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  themeCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewContainer: {
    padding: 8,
  },
  previewBackground: {
    borderRadius: 8,
    padding: 10,
    height: 80,
    justifyContent: "space-between",
  },
  colorDots: {
    flexDirection: "row",
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewCard: {
    borderRadius: 4,
    padding: 6,
    gap: 4,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
  },
  previewButton: {
    height: 8,
    width: "50%",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  themeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  themeName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThemeSwitcher;
